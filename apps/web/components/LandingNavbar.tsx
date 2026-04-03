"use client"
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth'
import { useWallet } from '@txnlab/use-wallet-react'

export default function LandingNavbar() {
  const { user, logout } = useAuthStore()
  const { wallets, activeAccount } = useWallet()

  const handleConnect = () => {
    if (wallets && wallets.length > 0) {
      wallets[0]?.connect()
    }
  }

  const handleDisconnect = () => {
    if (wallets) wallets.forEach(w => w.disconnect())
  }

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
            B
          </div>
          <span className="font-semibold text-white">Bounty Escrow</span>
          <span className="text-xs text-zinc-500 font-normal mt-0.5">Agent</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-zinc-400 text-sm">Hi, {user.username}</span>
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
              <button onClick={logout} className="text-sm text-zinc-400 hover:text-white transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-zinc-300 hover:text-white transition-colors">Sign in</Link>
              <Link href="/register" className="text-sm px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 font-medium transition-opacity">
                Get Started
              </Link>
            </>
          )}

          {/* Wallet */}
          {activeAccount ? (
            <button
              onClick={handleDisconnect}
              className="text-xs px-3 py-1.5 bg-zinc-900 border border-green-900 rounded-full font-mono text-green-400 hover:border-green-700 transition-colors"
            >
              {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="text-sm px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
