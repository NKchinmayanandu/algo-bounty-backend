"use client"
import { useAuthStore } from '@/lib/auth'
import Link from 'next/link'

export default function Dashboard() {
  const { user, logout } = useAuthStore()

  const initial = user?.username?.[0]?.toUpperCase() ?? '?'
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your identity, wallet, and track your bounty history.</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
        {/* Avatar + info row */}
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {initial}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.username ?? 'Guest'}</h2>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-sm text-zinc-400">
                <span className="text-yellow-400">☆</span>
                <span className="text-white font-medium">{user?.rating_avg?.toFixed(1) ?? '0.0'}</span>
                <span>({user?.rating_count ?? 0} reviews)</span>
              </span>
              <span className="flex items-center gap-1 text-sm text-zinc-400">
                <span>⏱</span> Joined {joined}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
            <p className="text-xs text-zinc-500 font-medium mb-1">Bounties Created</p>
            <p className="text-2xl font-bold text-white">—</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
            <p className="text-xs text-zinc-500 font-medium mb-1">Tasks Completed</p>
            <p className="text-2xl font-bold text-white">—</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-pink-500/10 p-4">
            <p className="text-xs text-pink-400 font-medium mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-pink-400">0.00 ALGO</p>
          </div>
        </div>

        {/* Sign out */}
        <div className="flex justify-end mt-6 border-t border-white/5 pt-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <span>→</span> Sign Out
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/create-task"
          className="rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-colors p-5 flex flex-col gap-2"
        >
          <span className="text-2xl">➕</span>
          <p className="font-semibold text-white">Create a Bounty</p>
          <p className="text-xs text-zinc-400">Post a task and lock funds in escrow</p>
        </Link>
        <Link
          href="/tasks"
          className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 flex flex-col gap-2"
        >
          <span className="text-2xl">📋</span>
          <p className="font-semibold text-white">Browse Live Tasks</p>
          <p className="text-xs text-zinc-400">Find and claim open bounties</p>
        </Link>
      </div>
    </div>
  )
}
