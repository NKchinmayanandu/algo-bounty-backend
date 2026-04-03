"use client"
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth'
import { useWallet } from '@txnlab/use-wallet-react'
import { useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { wallets, activeAccount } = useWallet()

  // Find the Pera or Defly provider currently available
  const handleConnect = () => {
    if (wallets && wallets.length > 0) {
      // Just pick the first available provider for demo (usually Pera or Defly)
      const wallet = wallets[0]
      if (wallet) {
        wallet.connect()
      }
    }
  }

  const handleDisconnect = () => {
    if (wallets) {
      wallets.forEach(w => w.disconnect())
    }
  }

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center z-10 sticky top-0">
      <div className="font-bold text-xl text-blue-500">
        <Link href="/">Algobounty</Link>
      </div>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-zinc-400 text-sm">Hi, {user.username}</span>
            <button onClick={logout} className="text-sm hover:text-white text-zinc-400">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm hover:text-white text-zinc-400">Login</Link>
            <Link href="/register" className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors">Register</Link>
          </>
        )}

        {/* Wallet Connection */}
        {activeAccount ? (
          <button onClick={handleDisconnect} className="text-sm px-4 py-2 bg-zinc-800 rounded-md font-semibold font-mono text-green-400 border border-green-900 shadow-sm">
            {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
          </button>
        ) : (
          <button onClick={handleConnect} className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-md font-semibold shadow-sm">
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  )
}
