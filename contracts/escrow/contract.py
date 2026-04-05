from pyteal import *
from beaker import *

# Define Task Status Enum
class TaskStatus:
    OPEN = Int(1)
    FUNDED = Int(2)
    CLAIMED = Int(3)
    SUBMITTED = Int(4)
    VERIFIED = Int(5)
    PAID = Int(6)

class TaskRecord(abi.NamedTuple):
    creator: abi.Field[abi.Address]
    worker: abi.Field[abi.Address]
    reward: abi.Field[abi.Uint64]
    status: abi.Field[abi.Uint8]

class EscrowState:
    tasks = lib.storage.BoxMapping(abi.Uint64, TaskRecord)

app = Application("TaskEscrow", state=EscrowState())

@app.external
def create_task(task_id: abi.Uint64, creator: abi.Address, reward: abi.Uint64):
    """
    Creates a new task in the escrow contract and locks funds via PaymentTransaction.
    """
    # Helper to wrap status
    status_funded = abi.Uint8()
    zero_addr = abi.Address()

    return Seq(
        Assert(Not(app.state.tasks[task_id].exists()), comment="Task ID already exists"),
        
        # Verify payment
        Assert(Global.group_size() >= Int(2), comment="Must group with payment"),
        Assert(Gtxn[0].type_enum() == TxnType.Payment, comment="First txn must be payment"),
        Assert(Gtxn[0].receiver() == Global.current_application_address(), comment="Payment must be to contract"),
        Assert(Gtxn[0].amount() == reward.get(), comment="Payment amount must equal reward"),
        
        # We initialize the task record
        status_funded.set(Int(2)), # FUNDED = 2
        zero_addr.set(Global.zero_address()),
        (record := TaskRecord()).set(
            creator, 
            zero_addr, 
            reward,
            status_funded
        ),
        app.state.tasks[task_id].set(record)
    )

@app.external
def assign_worker(task_id: abi.Uint64, worker: abi.Address):
    """
    Assigns a worker to a specific task. Can only be called if task is in FUNDED state.
    """
    status_claimed = abi.Uint8()
    
    return Seq(
        Assert(app.state.tasks[task_id].exists(), comment="Task does not exist"),
        
        (record := TaskRecord()).decode(app.state.tasks[task_id].get()),
        
        # Read the current status directly (It's the last byte of the record)
        # We use a more robust way to check the status byte
        (curr_status := abi.Uint8()).set(record.status),
        Assert(curr_status.get() == Int(2), comment="Task must be in FUNDED state (2)"),
        
        # Update worker and status to CLAIMED (3)
        (creator_addr := abi.Address()).set(record.creator),
        (rew_val := abi.Uint64()).set(record.reward),
        status_claimed.set(Int(3)),
        
        record.set(
            creator_addr,
            worker,
            rew_val,
            status_claimed
        ),
        app.state.tasks[task_id].set(record)
    )

@app.external
def release_payment(task_id: abi.Uint64):
    """
    Releases payment to the assigned worker.
    """
    status_paid = abi.Uint8()

    return Seq(
        Assert(app.state.tasks[task_id].exists(), comment="Task does not exist"),
        
        (record := TaskRecord()).decode(app.state.tasks[task_id].get()),
        
        # Read current state
        (curr_status := abi.Uint8()).set(record.status),
        (worker_addr := abi.Address()).set(record.worker),
        (reward_val := abi.Uint64()).set(record.reward),
        
        # Verify state: must be CLAIMED (3)
        Assert(curr_status.get() == Int(3), comment="Task must be CLAIMED (3) to release payment"),
        
        # Release funds to the worker
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: worker_addr.get(),
            TxnField.amount: reward_val.get(),
            TxnField.fee: Int(0)
        }),
        InnerTxnBuilder.Submit(),
        
        # Mark as PAID (6)
        (creator_addr := abi.Address()).set(record.creator),
        status_paid.set(Int(6)),
        record.set(
            creator_addr,
            worker_addr,
            reward_val,
            status_paid
        ),
        app.state.tasks[task_id].set(record)
    )

if __name__ == "__main__":
    app.build().export("./artifacts")
