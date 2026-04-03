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
    return Seq(
        Assert(Not(app.state.tasks[task_id].exists()), comment="Task ID already exists"),
        
        # The frontend/backend should send an ALGO payment txn to the app address grouped with this call
        # We ensure GroupTxn index 0 is the payment to this contract
        Assert(Global.group_size() >= Int(2), comment="Must group with payment"),
        Assert(Gtxn[0].type_enum() == TxnType.Payment, comment="First txn must be payment"),
        Assert(Gtxn[0].receiver() == Global.current_application_address(), comment="Payment must be to contract"),
        Assert(Gtxn[0].amount() == reward.get(), comment="Payment amount must equal reward"),
        Assert(Gtxn[0].sender() == creator.get(), comment="Payment sender must be creator"),
        
        # We initialize the task record
        (record := TaskRecord()).set(
            creator, 
            Global.zero_address(), # Worker not assigned yet
            reward,
            TaskStatus.FUNDED # Directly to FUNDED since it requires payment
        ),
        app.state.tasks[task_id].set(record)
    )

@app.external
def assign_worker(task_id: abi.Uint64, worker: abi.Address):
    """
    Assigns a worker to a specific task. Can only be called if task is in FUNDED state.
    """
    return Seq(
        Assert(app.state.tasks[task_id].exists(), comment="Task does not exist"),
        
        (record := TaskRecord()).decode(app.state.tasks[task_id].get()),
        
        # Read fields
        (creator := abi.Address()).set(record.creator),
        (_w := abi.Address()).set(record.worker),
        (rew := abi.Uint64()).set(record.reward),
        (status := abi.Uint8()).set(record.status),
        
        Assert(status.get() == TaskStatus.FUNDED, comment="Task must be in FUNDED state"),
        
        # Update worker and status to CLAIMED
        record.set(
            creator,
            worker,
            rew,
            TaskStatus.CLAIMED
        ),
        app.state.tasks[task_id].set(record)
    )

@app.external
def release_payment(task_id: abi.Uint64):
    """
    Releases payment to the assigned worker.
    """
    return Seq(
        Assert(app.state.tasks[task_id].exists(), comment="Task does not exist"),
        
        (record := TaskRecord()).decode(app.state.tasks[task_id].get()),
        
        # Read fields
        (creator := abi.Address()).set(record.creator),
        (worker := abi.Address()).set(record.worker),
        (reward := abi.Uint64()).set(record.reward),
        (status := abi.Uint8()).set(record.status),
        
        # Verify state
        Assert(status.get() == TaskStatus.CLAIMED, comment="Task must be CLAIMED to release payment"),
        # (Optional logic: verify caller is the backend service or creator)
        
        # Release funds to the worker
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: worker.get(),
            TxnField.amount: reward.get(),
            TxnField.fee: Int(0) # Pool fee from caller or subtract from reward, assuming 0 for simplicity
        }),
        InnerTxnBuilder.Submit(),
        
        # Mark as PAID
        record.set(
            creator,
            worker,
            reward,
            TaskStatus.PAID
        ),
        app.state.tasks[task_id].set(record)
    )

if __name__ == "__main__":
    app.build().export("./artifacts")
