"use client"
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth'
import { useWallet } from '@txnlab/use-wallet-react'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { wallets, activeAccount } = useWallet()

  const handleConnect = () => {
    if (wallets && wallets.length > 0) wallets[0]?.connect()
  }

  const handleDisconnect = () => {
    if (wallets) wallets.forEach(w => w.disconnect())
  }

  return (
    <nav className="w-full bg-[#0d0d14] border-b border-white/5 px-5 h-13 flex justify-between items-center z-10 sticky top-0">
      <div className="flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
            B
          </div>
          <span className="font-semibold text-white text-sm">Algobounty</span>
        </Link>
      </div>

      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-zinc-400 text-sm">Hi, {user.username}</span>
            <button
              onClick={logout}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 font-medium transition-opacity"
            >
              Register
            </Link>
          </>
        )}

        {activeAccount ? (
          <button
            onClick={handleDisconnect}
            className="text-xs px-3 py-1.5 bg-[#0a0a0f] border border-green-900 rounded-full font-mono text-green-400 hover:border-green-700 transition-colors"
          >
            {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="text-sm px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  )
}
