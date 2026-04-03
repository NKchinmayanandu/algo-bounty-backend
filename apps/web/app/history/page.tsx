"use client"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/api"
import { useWallet } from "@txnlab/use-wallet-react"
import { constructReleaseTx, algodClient } from "@/lib/algorand"

export default function History() {
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState<any[]>([])
  const { signTransactions, activeAccount } = useWallet()

  useEffect(() => {
    if (!user) return
    loadHistory()
  }, [user])

  const loadHistory = async () => {
    try {
      const res = await fetchWithAuth("/users/me/history");
      const data = await res.json();
      setTasks(data);
    } catch(err) {
      console.error(err);
    }
  }

  const handleSubmit = async (taskId: number) => {
    const defaultRepo = prompt("Enter GitHub Repo URL to submit:", "https://github.com/my/repo");
    if(!defaultRepo) return;

    try {
      const res = await fetchWithAuth(`/tasks/${taskId}/submit`, {
        method: "POST",
        body: JSON.stringify({ repo_url: defaultRepo })
      })
      if (res.ok) {
        alert("Work Submitted!")
        loadHistory()
      }
    } catch(e) {
      alert("Submission failed");
    }
  }

  const handleVerifyAndRelease = async (task: any) => {
    if (!activeAccount) {
      alert("Connect wallet to sign release transaction!");
      return;
    }
    
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
           
           if(window.confirm(`Automated verification failed.\n\nThe worker submitted the following URL:\n${repoUrl}\n\nDo you want to manually approve AND release funds?`)) {
             const manualRes = await fetchWithAuth(`/tasks/${task.id}/verify?manual=true`, { method: "POST" });
             const manualData = await manualRes.json();
             if(manualData.status === "VERIFIED") {
                isVerified = true;
             }
           }
        }
      }

      if (!isVerified) {
          alert("Task is not verified. Payment will not be released.");
          loadHistory(); // Refresh just in case status changed
          return;
      }

      // 2. Fetch details to get worker address for the inner transaction routing
      const detailResForWorker = await fetchWithAuth(`/tasks/${task.id}`);
      const detailForWorker = await detailResForWorker.json();
      const workerAddress = detailForWorker.assignee?.wallet_address;
      
      if (!workerAddress) {
          alert("Error: Worker does not have a wallet address linked.");
          return;
      }

      // 3. Prompt Algorand Wallet to release funds securely
      alert("Verification complete! Please approve the final release of funds in your wallet.");
      const txns = await constructReleaseTx(activeAccount.address, workerAddress, task.id);
      const encodedTxns = txns.map(tx => tx.toByte() as Uint8Array);
      const signedTxns = await signTransactions(encodedTxns);
      await algodClient.sendRawTransaction(signedTxns).do();
      
      const releaseRes = await fetchWithAuth(`/tasks/${task.id}/release`, { method: "POST" })
      if(releaseRes.ok) {
        alert("Payment Released Successfully!");
        loadHistory();
      }
    } catch(e: any) {
      alert("Process failed: " + e.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">Your Active Escrows & Tasks</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-sm">
            <tr>
              <th className="p-4 font-semibold">Task</th>
              <th className="p-4 font-semibold">Your Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Reward</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-zinc-200 divide-y divide-zinc-800">
            {tasks.map(task => {
              const isCreator = user?.id === task.creator_user_id;

              return (
                <tr key={task.id} className="hover:bg-zinc-800/50">
                  <td className="p-4 font-medium">{task.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${isCreator ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                      {isCreator ? 'Creator' : 'Worker'}
                    </span>
                  </td>
                  <td className="p-4"><span className="text-yellow-500 font-mono text-xs">{task.status}</span></td>
                  <td className="p-4">{task.reward} ALGO</td>
                  <td className="p-4 flex gap-2">
                    {/* Worker Action */}
                    {!isCreator && (task.status === 'CLAIMED' || task.status === 'SUBMITTED') && (
                      <button onClick={() => handleSubmit(task.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white">
                        {task.status === 'SUBMITTED' ? 'Resubmit Work' : 'Submit Work'}
                      </button>
                    )}
                    {/* Creator Actions */}
                    {isCreator && task.status === 'SUBMITTED' && (
                      <button onClick={() => handleVerifyAndRelease(task)} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm text-white">
                        Verify & Release Payment
                      </button>
                    )}
                    {task.status === 'VERIFIED' && (
                      <span className="text-zinc-500 text-sm">Payment Completed</span>
                    )}
                    {task.status === 'PAID' && (
                      <span className="text-zinc-500 text-sm">Completed</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  No history to display yet. Post or claim a task!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
