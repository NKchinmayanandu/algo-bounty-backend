"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import LandingNavbar from '@/components/LandingNavbar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const isLoginPage = pathname === '/login'
  const isRegisterPage = pathname === '/register'
  const isAuthPage = isLoginPage || isRegisterPage

  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingNavbar />
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
        {/* Minimal auth nav */}
        <nav className="w-full px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
              B
            </div>
            <span className="font-semibold text-white">Bounty Escrow</span>
          </Link>
          <div className="text-sm text-zinc-400">
            {isLoginPage ? (
              <>No account?{' '}<Link href="/register" className="text-pink-400 hover:text-pink-300 font-medium">Register</Link></>
            ) : (
              <>Have an account?{' '}<Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium">Sign in →</Link></>
            )}
          </div>
        </nav>
        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  )
}
