import os
from dotenv import load_dotenv
from algosdk import account, mnemonic
from algosdk.v2client import algod
from beaker import client, sandbox, consts
from escrow.contract import app

load_dotenv()

def get_algod_client():
    # Fallback to public testnet node (AlgoNode)
    algod_address = os.getenv("ALGORAND_NODE_URL", "https://testnet-api.algonode.cloud")
    algod_token = os.getenv("ALGORAND_TOKEN", "")
    return algod.AlgodClient(algod_token, algod_address)

def get_deployer_account():
    mnemo = os.getenv("DEPLOYER_MNEMONIC")
    if mnemo:
        private_key = mnemonic.to_private_key(mnemo)
        address = account.address_from_private_key(private_key)
        print(f"Using provided deployer account: {address}")
        return private_key, address
    else:
        # Generate temporary wallet
        private_key, address = account.generate_account()
        print(f"WARNING: No DEPLOYER_MNEMONIC found. Generated a temporary wallet.")
        print(f"Temporary Account Address: {address}")
        print(f"Temporary Account Mnemonic: {mnemonic.from_private_key(private_key)}")
        print("Please fund this account using the Algorand TestNet Dispenser and rerun deployment.")
        return private_key, address

def deploy():
    algod_client = get_algod_client()
    private_key, address = get_deployer_account()

    # Check balance
    try:
        account_info = algod_client.account_info(address)
        if account_info.get("amount", 0) == 0:
            print(f"Account {address} has 0 ALGO. Please fund it to deploy the contract.")
            return
    except Exception as e:
        print(f"Failed to fetch account info (might not exist on-chain or node error): {e}")
        return

    # Deploy the application using Beaker's ApplicationClient
    app_client = client.ApplicationClient(
        client=algod_client,
        app=app,
        signer=client.api_providers.AlgoSigner(private_key) if hasattr(client.api_providers, "AlgoSigner") else None # Actually we can just use account directly or AccountTransactionSigner
    )
    
    # In newer beaker versions we use AccountTransactionSigner
    from algosdk.atomic_transaction_composer import AccountTransactionSigner
    signer = AccountTransactionSigner(private_key)
    
    app_client = client.ApplicationClient(
        client=algod_client,
        app=app,
        signer=signer
    )

    print("Deploying Escrow application...")
    try:
        app_id, app_addr, txid = app_client.create()
        print(f"Deployed Escrow Application ID: {app_id}")
        print(f"Deployed Escrow Application Address: {app_addr}")
        print(f"Transaction ID: {txid}")
        
        # Save the App ID and Address to .env or standard output
        with open(".env", "a") as f:
            f.write(f"\nESCROW_APP_ID={app_id}\n")
            f.write(f"ESCROW_APP_ADDRESS={app_addr}\n")
    except Exception as e:
        print(f"Deployment failed: {e}")

if __name__ == "__main__":
    deploy()
