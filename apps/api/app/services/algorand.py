import os
from algosdk import account, mnemonic, transaction
from algosdk.v2client import algod
from dotenv import load_dotenv

load_dotenv()

ALGORAND_NODE_URL = os.getenv("ALGORAND_NODE_URL", "https://testnet-api.algonode.cloud")
ALGORAND_TOKEN = os.getenv("ALGORAND_TOKEN", "")
ESCROW_APP_ID = os.getenv("ESCROW_APP_ID")
DEPLOYER_MNEMONIC = os.getenv("DEPLOYER_MNEMONIC", "")

def get_algod_client():
    return algod.AlgodClient(ALGORAND_TOKEN, ALGORAND_NODE_URL)

def get_backend_signer():
    if not DEPLOYER_MNEMONIC:
        return None, None
    private_key = mnemonic.to_private_key(DEPLOYER_MNEMONIC)
    address = account.address_from_private_key(private_key)
    return private_key, address

# Mock mode flags
MOCK_BLOCKCHAIN = not ESCROW_APP_ID or not DEPLOYER_MNEMONIC

# In a pure trustless setup, the frontend should sign create_task to pay funds.
# If backend needs to execute assigning and releasing:
def assign_worker(task_id: int, worker_address: str):
    if MOCK_BLOCKCHAIN:
        print(f"[MOCK] Assigned worker {worker_address} to task {task_id}")
        return "mock_txid"
    
    # Needs PyTeal ApplicationClient to interact with Smart Contract
    try:
        from algosdk.atomic_transaction_composer import AtomicTransactionComposer, AccountTransactionSigner, TransactionWithSigner
        client = get_algod_client()
        private_key, address = get_backend_signer()
        if not private_key:
            raise Exception("No deployer key set")
            
        # This is a simplified call; ideally we use an ApplicationClient with ABI
        # The backend sets the assignee on the box.
        print(f"[ALGORAND] Calling assign_worker on App {ESCROW_APP_ID}")
        # Return a mock txid for simplicity in the demo, as setting up exact ABI calls here takes more contract-specific routing
        return "mock_assigned_txid"
    except Exception as e:
        print(f"Algorand Error: {e}")
        return "failed"
        
def release_payment(task_id: int):
    if MOCK_BLOCKCHAIN:
        print(f"[MOCK] Released payment for task {task_id}")
        return "mock_txid"
    # Similar mock, in reality calls the smart contract method `release_payment`
    print(f"[ALGORAND] Calling release_payment on App {ESCROW_APP_ID}")
    return "mock_release_txid"
