"use client"
import { useEffect, useState } from "react"
import Link from 'next/link'
import { useWallet } from '@txnlab/use-wallet-react'
import { fetchWithAuth } from '@/lib/api'
import { constructClaimTx, algodClient } from '@/lib/algorand'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const { signTransactions, activeAccount } = useWallet()

  useEffect(() => {
    fetch('http://localhost:8000/tasks/')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setTasks(data)
      })
      .catch(console.error)
  }, [])

  const handleClaim = async (task: any) => {
    if (!activeAccount) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      // 1. Generate Application Call to `assign_worker`
      const txns = await constructClaimTx(activeAccount.address, task.id);
      
      // 2. Sign transaction
      const encodedTxns = txns.map(tx => tx.toByte() as Uint8Array);
      const signedTxns = await signTransactions(encodedTxns);
      
      // 3. Send transaction
      const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
      
      // 4. Update backend state directly
      const res = await fetchWithAuth(`/tasks/${task.id}/claim`, {
        method: 'POST',
        body: JSON.stringify({ tx_hash: txId })
      });

      if (!res.ok) throw new Error("Backend claim failed");

      alert("Task Claimed Successfully!");
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'CLAIMED' } : t));
    } catch (err: any) {
      console.error(err);
      alert("Failed to claim: " + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-8 items-center">
        <h1 className="text-3xl font-bold">Live Tasks</h1>
        <Link href="/create-task" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">Post a Task</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold line-clamp-2">{task.title}</h2>
              <span className="px-2 py-1 text-xs font-semibold bg-green-900 text-green-300 rounded-full">{task.status}</span>
            </div>
            <p className="text-zinc-400 text-sm mb-6 line-clamp-3">{task.description}</p>
            <div className="flex justify-between items-center text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="text-lg bg-zinc-800 px-3 py-1 rounded-md text-blue-400">{task.reward} ALGO</span>
              </div>
              {task.status === 'FUNDED' && (
                <button 
                  onClick={() => handleClaim(task)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-white">
                  Claim Task
                </button>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No live tasks found.
          </div>
        )}
      </div>
    </div>
  )
}
