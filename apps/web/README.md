# 🌐 Frontend - Bounty Escrow Agent

A premium, high-performance dashboard for managing decentralized bounties, built with a focus on seamless user experience and secure wallet interactions.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Dark Theme)
- **Wallet Integration:** @txnlab/use-wallet-react
- **Icons:** Lucide React

## ✨ Key Features

- **Pera/Defly Wallet Connection:** Securely sign transactions directly from your mobile device.
- **Dynamic Task Creation:** Intuitive forms for defining task requirements and locking rewards.
- **Work History:** Comprehensive tracking of "Creator" and "Worker" roles.
- **Automated Verification UI:** One-click "Verify & Release" flow that triggers backend agent checks.

## 📂 Folder Structure

```text
apps/web/
├── app/              # Next.js App Router (Pages & Layouts)
├── components/       # Reusable UI Components (Navbar, WalletButton, Sidebar)
├── lib/              # Auth, API, and Algorand Logic
├── public/           # Static Assets
└── tailwind.config.ts# Custom Theme Definitions
```

## 🚀 Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set Environment Variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_ESCROW_APP_ID=your_app_id
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
