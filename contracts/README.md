# 📜 Smart Contracts - Bounty Escrow Agent

The "Finality Layer" of the platform. Using the Algorand Virtual Machine (AVM) for secure, on-chain task funding and instant release.

## 🛠 Tech Stack

- **Framework:** PyTeal / Beaker
- **Language:** Python
- **Network:** Algorand Testnet
- **State:** Box Storage

## ✨ Key Features

- **Escrow Logic:** Securely locks ALGOs in the contract account during task creation.
- **Trustless Payouts:** Funds can only be released to a worker address that has been registered via a signed claim.
- **Atomic Grouping:** Ensures a task cannot be "Created" without being "Funded" on-chain.
- **Box Storage:** Efficiently manages 10,000+ potential concurrent bounties using L1 Boxes.

## 🛠 Deployment & Testing

1. Setup virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
2. Install Beaker & SDK:
   ```bash
   pip install -r requirements.txt
   ```
3. Deploy to Testnet:
   ```bash
   python deploy.py
   ```

## 📜 Key Methods

- `create_task()`: Initializes the task record in on-chain Box storage.
- `assign_worker()`: Registers the contributor as the valid recipient.
- `release_payment()`: Executes an inner transaction to the worker address.
