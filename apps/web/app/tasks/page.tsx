"use client"
import { useEffect, useState, useCallback } from "react"
import Link from 'next/link'
import { useWallet } from '@txnlab/use-wallet-react'
import { fetchWithAuth } from '@/lib/api'
import { constructClaimTx, algodClient } from '@/lib/algorand'
import { useTaskWebSocket } from '@/lib/useTaskWebSocket'

const STATUS_STYLES: Record<string, string> = {
  OPEN:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  FUNDED:    'bg-green-500/10 text-green-400 border-green-500/20',
  CLAIMED:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  SUBMITTED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  VERIFIED:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  PAID:      'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

const ALL_STATUSES = ['All', 'OPEN', 'FUNDED', 'CLAIMED', 'SUBMITTED', 'VERIFIED', 'PAID']

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const { signTransactions, activeAccount } = useWallet()

  const loadTasks = useCallback(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${BASE_URL}/tasks/`)
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setTasks(data) })
      .catch(console.error)
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  // Auto-refresh when backend broadcasts a task event
  useTaskWebSocket(() => { loadTasks() })

  const handleClaim = async (task: any) => {
    if (!activeAccount) { alert("Please connect your wallet first"); return; }
    try {
      const txns = await constructClaimTx(activeAccount.address, task.id);
      const encodedTxns = txns.map(tx => tx.toByte() as Uint8Array);
      const signedTxns = await signTransactions(encodedTxns);
      const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
      const res = await fetchWithAuth(`/tasks/${task.id}/claim`, { method: 'POST', body: JSON.stringify({ tx_hash: txId }) });
      if (!res.ok) throw new Error("Backend claim failed");
      alert("Task Claimed Successfully!");
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'CLAIMED' } : t));
    } catch (err: any) {
      console.error(err);
      alert("Failed to claim: " + err.message);
    }
  };

  const filtered = tasks.filter(t =>
    (filter === 'All' || t.status === filter) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Tasks</h1>
          <p className="text-zinc-400 text-sm mt-1">Browse available bounties and start earning Algorand.</p>
        </div>
        <Link
          href="/create-task"
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 font-medium text-sm transition-opacity shadow-lg shadow-purple-900/20"
        >
          + Post a Task
        </Link>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-500 text-xs mr-1">⚙</span>
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === s
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white'
                  : 'bg-white/[0.03] border-white/8 text-zinc-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Task grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(task => (
          <div
            key={task.id}
            className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all p-5 flex flex-col gap-3"
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-500 font-mono">#{task.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_STYLES[task.status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                {task.status}
              </span>
            </div>

            {/* Title & desc */}
            <div>
              <h2 className="font-semibold text-white line-clamp-2 leading-snug">{task.title}</h2>
              <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5">
              <span className="text-sm font-bold text-purple-300">{task.reward} ALGO</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600">
                  {task.created_at ? new Date(task.created_at).toLocaleDateString() : ''}
                </span>
                {task.status === 'FUNDED' && (
                  <button
                    onClick={() => handleClaim(task)}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-xs font-semibold text-white transition-opacity"
                  >
                    Claim Task
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500">
            No tasks found.
          </div>
        )}
      </div>
    </div>
  )
}
