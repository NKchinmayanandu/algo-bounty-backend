# ⚙️ Backend - Bounty Escrow Agent

The "Agent Layer" that bridges the gap between Web2 work delivery (GitHub) and Web3 financial execution (Algorand).

## 🛠 Tech Stack

- **Framework:** FastAPI
- **Language:** Python 3
- **Database:** Supabase (PostgreSQL)
- **SDKs:** Algosdk, GitHub Octokit

## ✨ Key Features

- **Automated Verification:** Checks GitHub Pull Request or Repository existence before enabling on-chain release.
- **Micro-History Syncing:** Fast Supabase indexing of active tasks and user ratings.
- **Status Machine Logic:** Ensures tasks only move from `OPEN` to `PAID` through strict validation.
- **RESTful API:** Structured endpoints for user activity, histories, and task detail verification.

## 🔗 Endpoints

- **`/auth/`**: User login, registration, and wallet linking.
- **`/tasks/`**: Creation, claiming, and submitting GitHub repo links.
- **`/verify/`**: Core agentic logic for repository access checks.

## 📂 Folder Structure

```text
apps/api/
├── app/
│   ├── routes/      # Verification, Tasks, and Auth endpoints
│   ├── services/    # GitHub API Bridge and Database Logic
│   ├── models/      # Pydantic Schemas and DB Models
│   └── main.py      # FastAPI Initialization
└── requirements.txt # Python dependencies
```

## 🚀 Run Locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set Environment Variables in `.env`:
   ```bash
   DATABASE_URL=your_supabase_url
   GITHUB_TOKEN=your_github_pat
   ```
3. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```
