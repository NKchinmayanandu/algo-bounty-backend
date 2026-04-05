"use client"
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth'
import WalletButton from '@/components/WalletButton'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <nav className="w-full bg-[#0d0d14] border-b border-white/5 px-5 h-14 py-2 flex justify-between items-center z-10 sticky top-0">
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

        <WalletButton />
      </div>
    </nav>
  )
}
