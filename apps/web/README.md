# 🌐 Frontend - Bounty Escrow Agent

A premium, high-performance dashboard for managing decentralized bounties, built with a focus on seamless user experience, secure wallet interactions, and real-time updates.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Real-Time:** `useTaskWebSocket` custom hook (Auto-refresh on backend events)
- **Wallet Integration:** `@txnlab/use-wallet-react` (Pera Wallet & Defly Supported)
- **Styling:** Tailwind CSS (Custom Dark Theme with Glassmorphism)
- **State Management:** Zustand (Auth Store)

## ✨ Key Features

- **⚡ Real-Time Dashboards:** "Live Tasks" and "Work History" pages automatically refresh when states change on the backend via WebSockets.
- **🛡️ Secure Wallet Popup:** Customized `WalletButton` with a unified connection/disconnection flow.
- **📱 Pera Wallet First:** Optimized for use with the **Pera Wallet Mobile App** (Testnet).
- **📋 Smart Task Lifecycle:** Dynamic color-coded status pills (Open, Funded, Claimed, Submitted, Verified, Paid).

## 📂 Folder Structure

```text
apps/web/
├── app/              # Next.js App Router (Pages & Layouts)
├── components/       # Premium UI Components (Navbar, WalletButton, Dashboard cards)
├── lib/              # Auth, API, useTaskWebSocket, and Algorand Logic
├── public/           # Static Assets
└── tailwind.config.ts# Theme Definitions (Zinc-950, Purple/Pink gradients)
```

## 🚀 Run Locally

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Set Environment Variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8000
   NEXT_PUBLIC_ESCROW_APP_ID=758200883
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
