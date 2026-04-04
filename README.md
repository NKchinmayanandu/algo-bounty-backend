# 🔗 Bounty Escrow Agent: Trustless Task Lifecycle

**Eliminate trust issues in open bounty platforms with automated escrow agents. Secure, transparent, and fully on-chain.**

The Bounty Escrow Agent is a decentralized platform that replaces manual payment disputes with an automated, agent-driven verification pipeline. By locking funds in an Algorand smart contract upfront and using real-time WebSockets to sync state, we create a "Trustless Lifecycle" for digital labor.

---

## 🛠 Tech Stack

[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](apps/web/README.md)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge&logo=fastapi)](apps/api/README.md)
[![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-Algorand%20PyTeal-blue?style=for-the-badge&logo=algorand)](contracts/README.md)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

---

## ✨ Key Features

- **🛡️ On-Chain Trustless Escrow:** Rewards are locked in an Algorand Smart Contract  at creation. No middleman holds the funds.
- **⚡ Real-Time Synchronization:** Integrated **WebSockets** ensure that when a task is funded, claimed, or paid, every user's dashboard updates instantly without refreshing.
- **🤖 Automated Verification:** The backend agent validates GitHub repository submissions before allowing the "Release Payment" step.
- **📱 Pera Wallet Integration:** Seamlessly connect via the **Pera Wallet Mobile App** (Testnet mode) to sign transactions securely.
- **💎 Premium Dark UI:** A state-of-the-art glassmorphism design with a unified purple/pink aesthetic across the entire dashboard.
- **📊 Micro-History Tracking:** Immutable audit logs for every state change in the task lifecycle.

---

## 📂 Project Structure

```bash
.
├── apps/
│   ├── web/        # Frontend (Next.js 14, WebSocket Hook, Pera Integration)
│   └── api/        # Backend (FastAPI, ConnectionManager, SQLAlchemy)
├── contracts/      # Smart Contracts (PyTeal, Beaker, State Machine Logic)
├── README.md       # Root Documentation
└── package.json    # Workspace Definitions
```

---

## 🔄 The Trustless Workflow

1.  **POST & FUND:** A Creator posts a task. They must fund the task by sending ALGO to the Smart Contract via **Pera Wallet**.
2.  **CLAIM:** A Worker finds an active task and "Claims" it. This locks their address as the official worker on the blockchain.
3.  **SUBMIT:** Once work is done, the Worker submits their GitHub repository URL.
4.  **VERIFY & RELEASE:** The Creator triggers the "Verify" agent. If the GitHub repo exists and the check passes, the Creator signs the final "Release" transaction, and the Smart Contract instantly pays the Worker.

---

## 🚀 Getting Started

### **Prerequisites**
- **Pera Wallet App:** Download on your phone and switch it to **Testnet** mode (Developer Settings).
- **Testnet ALGO:** Get some free coins from the [Algorand Testnet Faucet](https://bank.testnet.algorand.network/).
- **Node.js & Python 3.10+**

### **Installation**

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Yaseen-711/algo-bounty.git
    cd algo-bounty
    ```

2.  **Backend Setup (`apps/api`):**
    ```bash
    cd apps/api
    pip install -r requirements.txt
    # Create .env with DATABASE_URL, JWT_SECRET, and GITHUB_TOKEN
    uvicorn app.main:app --reload
    ```

3.  **Frontend Setup (`apps/web`):**
    ```bash
    cd ../web
    npm install --legacy-peer-deps
    # Create .env.local with NEXT_PUBLIC_API_URL and NEXT_PUBLIC_ESCROW_APP_ID
    npm run dev
    ```

---

## 🤝 Contributors

Optimized and built for the **Algorand Global Hackathon**. Designed with ❤️ by **Antigravity**.
