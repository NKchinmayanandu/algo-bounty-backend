# ⚙️ Backend - Bounty Escrow Agent

The "Agent Layer" that bridges the gap between Web2 work delivery (GitHub) and Web3 financial execution (Algorand).

## 🛠 Tech Stack

- **Framework:** FastAPI
- **Language:** Python 3.10+
- **Database:** Supabase (PostgreSQL with SQLAlchemy)
- **Real-Time:** WebSockets (ConnectionManager Broadcast System)
- **SDKs:** Algosdk, PyGitHub

## ✨ Key Features

- **⚡ Live Event Broadcasting:** Uses a `ConnectionManager` to push `task_created`, `task_funded`, and `task_paid` events to the frontend via WebSockets.
- **🛡️ Escrow Guard Logic:** Re-validates transaction hashes from the Algorand blockchain before updating local database status.
- **🤖 Automated Verification:** Checks GitHub Pull Request or Repository existence before enabling on-chain release.
- **🚀 Cloud Optimized:** Configured for Render/Railway with explicit SSL engine handling for Postgres.

## 📂 Folder Structure

```text
apps/api/
├── app/
│   ├── routes/      # Auth, Tasks, User endpoints
│   ├── services/    # GitHub API Bridge, Task Business Logic
│   ├── db/          # SQLAlchemy session and SSL config
│   ├── models/      # Pydantic Schemas and DB Models
│   ├── realtime/    # WebSocket Connection Manager logic
│   └── main.py      # FastAPI Initialization & CORS
└── requirements.txt # Python dependencies (pinned for cloud)
```

## 🚀 Run Locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set Environment Variables in `.env`:
   ```bash
   DATABASE_URL=postgresql+psycopg2://...
   JWT_SECRET=your_jwt_secret
   GITHUB_TOKEN=your_github_pat
   ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
   ```
3. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```
