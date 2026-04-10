"use client"
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth'
import WalletButton from '@/components/WalletButton'

export default function LandingNavbar() {
  const { user, logout } = useAuthStore()

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

          <WalletButton />
        </div>
      </div>
    </nav>
  )
}
