"use client"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/api"
import { useWallet } from "@txnlab/use-wallet-react"
import { constructReleaseTx, algodClient } from "@/lib/algorand"
import { useTaskWebSocket } from '@/lib/useTaskWebSocket'

const STATUS_STYLES: Record<string, string> = {
  OPEN:      'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  FUNDED:    'bg-green-500/10 text-green-400 border border-green-500/20',
  CLAIMED:   'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  SUBMITTED: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  VERIFIED:  'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  PAID:      'bg-pink-500/10 text-pink-400 border border-pink-500/20',
}

// ─── Star Rating Component ───────────────────────────────────────
function StarRating({ taskId, isCreator, status }: { taskId: number; isCreator: boolean; status: string }) {
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(0)
  const [review, setReview] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [existingRating, setExistingRating] = useState<any>(null)
  const [showReviewInput, setShowReviewInput] = useState(false)

  // Only show for creators on VERIFIED/PAID tasks
  const canRate = isCreator && (status === "VERIFIED" || status === "PAID")

  useEffect(() => {
    if (!canRate) return
    // Check if already rated
    fetchWithAuth(`/tasks/${taskId}/rating`)
      .then(res => {
        if (res.ok) return res.json()
        return null
      })
      .then(data => {
        if (data && data.stars) {
          setExistingRating(data)
          setSelected(data.stars)
          setSubmitted(true)
        }
      })
      .catch(() => {})
  }, [taskId, canRate])

  if (!canRate) return null

  const handleSubmitRating = async () => {
    if (selected === 0) return
    setSubmitting(true)
    try {
      const res = await fetchWithAuth(`/tasks/${taskId}/rate`, {
        method: "POST",
        body: JSON.stringify({ stars: selected, review: review || "" })
      })
      if (res.ok) {
        const data = await res.json()
        setExistingRating(data)
        setSubmitted(true)
        setShowReviewInput(false)
      } else {
        const err = await res.json()
        alert(err.detail || "Failed to submit rating")
      }
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Already rated — show the result
  if (submitted && existingRating) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`text-base transition-colors ${
                star <= existingRating.stars ? 'text-yellow-400' : 'text-zinc-700'
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-zinc-500 ml-1.5">Rated</span>
        </div>
        {existingRating.review && (
          <p className="text-xs text-zinc-500 italic max-w-[200px] truncate">&quot;{existingRating.review}&quot;</p>
        )}
      </div>
    )
  }

  // Rating picker
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => {
              setSelected(star)
              setShowReviewInput(true)
            }}
            className={`text-lg transition-all duration-150 hover:scale-125 ${
              star <= (hover || selected) ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]' : 'text-zinc-700 hover:text-zinc-500'
            }`}
          >
            ★
          </button>
        ))}
        {selected > 0 && !showReviewInput && (
          <button
            onClick={handleSubmitRating}
            disabled={submitting}
            className="ml-2 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
          >
            {submitting ? "..." : "Submit"}
          </button>
        )}
      </div>

      {showReviewInput && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <textarea
            className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-3 py-2 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-500/40 transition-all resize-none"
            placeholder="Write a short review (optional)..."
            rows={2}
            value={review}
            onChange={e => setReview(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitRating}
              disabled={submitting}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Submitting..." : `Rate ${selected} Star${selected > 1 ? 's' : ''}`}
            </button>
            <button
              onClick={() => { setShowReviewInput(false); setSelected(0) }}
              className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/8 text-zinc-400 text-xs hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────
export default function History() {
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState<any[]>([])
  const { signTransactions, activeAccount } = useWallet()

  useEffect(() => {
    if (!user) return
    loadHistory()
  }, [user])

  // Auto-refresh when backend broadcasts a task event
  useTaskWebSocket(() => { if (user) loadHistory() })

  const loadHistory = async () => {
    try {
      const res = await fetchWithAuth("/users/me/history");
      const data = await res.json();
      setTasks(data);
    } catch(err) { console.error(err); }
  }

  const handleSubmit = async (taskId: number) => {
    const defaultRepo = prompt("Enter GitHub Repo URL to submit:", "https://github.com/my/repo");
    if(!defaultRepo) return;
    try {
      const res = await fetchWithAuth(`/tasks/${taskId}/submit`, { method: "POST", body: JSON.stringify({ repo_url: defaultRepo }) })
      if (res.ok) { alert("Work Submitted!"); loadHistory() }
    } catch(e) { alert("Submission failed"); }
  }

  const handleVerifyAndRelease = async (task: any) => {
    if (!activeAccount) { alert("Connect wallet to sign release transaction!"); return; }
    try {
      let isVerified = false;
      const res = await fetchWithAuth(`/tasks/${task.id}/verify`, { method: "POST" })
      const data = await res.json()
      if(data.status === "VERIFIED") {
        isVerified = true;
      } else {
        const detailRes = await fetchWithAuth(`/tasks/${task.id}`);
        if(detailRes.ok) {
          const detail = await detailRes.json();
          const repoUrl = detail.submission?.repo_url || "Unknown Repo URL";
          if(window.confirm(`Automated verification failed.\n\nThe worker submitted:\n${repoUrl}\n\nManually approve AND release funds?`)) {
            const manualRes = await fetchWithAuth(`/tasks/${task.id}/verify?manual=true`, { method: "POST" });
            const manualData = await manualRes.json();
            if(manualData.status === "VERIFIED") isVerified = true;
          }
        }
      }
      if (!isVerified) { alert("Task not verified. Payment will not be released."); loadHistory(); return; }

      const detailResForWorker = await fetchWithAuth(`/tasks/${task.id}`);
      const detailForWorker = await detailResForWorker.json();
      const workerAddress = detailForWorker.assignee?.wallet_address;
      if (!workerAddress) { alert("Error: Worker does not have a wallet address linked."); return; }

      alert("Verification complete! Please approve the final release of funds in your wallet.");
      const txns = await constructReleaseTx(activeAccount.address, workerAddress, task.id);
      const encodedTxns = txns.map(tx => tx.toByte() as Uint8Array);
      const signedTxns = await signTransactions(encodedTxns);
      await algodClient.sendRawTransaction(signedTxns).do();

      const releaseRes = await fetchWithAuth(`/tasks/${task.id}/release`, { method: "POST" })
      if(releaseRes.ok) { alert("Payment Released Successfully!"); loadHistory(); }
    } catch(e: any) { alert("Process failed: " + e.message); }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Your Active Escrows & Tasks</h1>
        <p className="text-zinc-400 text-sm mt-1">Track and manage all your bounties in one place.</p>
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3.5 font-semibold">Task</th>
              <th className="px-5 py-3.5 font-semibold">Your Role</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Reward</th>
              <th className="px-5 py-3.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/3">
            {tasks.map(task => {
              const isCreator = user?.id === task.creator_user_id;
              return (
                <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 font-medium text-white">{task.title}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-semibold border ${
                      isCreator
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                    }`}>
                      {isCreator ? 'Creator' : 'Worker'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-mono font-semibold ${STATUS_STYLES[task.status] ?? 'text-zinc-400'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-purple-300 font-semibold">{task.reward} ALGO</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        {!isCreator && (task.status === 'CLAIMED' || task.status === 'SUBMITTED') && (
                          <button
                            onClick={() => handleSubmit(task.id)}
                            className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-colors"
                          >
                            {task.status === 'SUBMITTED' ? 'Resubmit Work' : 'Submit Work'}
                          </button>
                        )}
                        {isCreator && task.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleVerifyAndRelease(task)}
                            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-semibold transition-opacity"
                          >
                            Verify & Release
                          </button>
                        )}
                        {task.status === 'VERIFIED' && (
                          <span className="text-xs text-green-400 font-medium">&#10003; Payment Completed</span>
                        )}
                        {task.status === 'PAID' && (
                          <span className="text-xs text-zinc-500">Completed</span>
                        )}
                      </div>

                      {/* Star Rating — only for creators on completed tasks */}
                      <StarRating taskId={task.id} isCreator={isCreator} status={task.status} />
                    </div>
                  </td>
                </tr>
              )
            })}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-zinc-500">
                  No history yet. Post or claim a task!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
