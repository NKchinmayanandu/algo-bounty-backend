"use client"
import { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { fetchWithAuth } from '@/lib/api';
import { constructFundingTxGroup, algodClient, ESCROW_APP_ID } from '@/lib/algorand';
import { useRouter } from 'next/navigation';

export default function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signTransactions, activeAccount } = useWallet();
  const router = useRouter();

  const handleCreateAndFund = async () => {
    if (!activeAccount) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Create task in DB (State: OPEN)
      const res = await fetchWithAuth("/tasks/", {
        method: 'POST',
        body: JSON.stringify({ title, description, reward: parseFloat(reward) })
      });
      if (!res.ok) throw new Error("Failed to create task");
      const task = await res.json();

      // 2. Generate atomic funding tx in ALGO (reward * 1_000_000)
      const microAlgos = Math.floor(parseFloat(reward) * 1000000);
      const txns = await constructFundingTxGroup(activeAccount.address, task.id, microAlgos);

      // 3. Sign transaction
      const encodedTxns = txns.map(tx => tx.toByte() as Uint8Array);
      const signedTxns = await signTransactions(encodedTxns);

      // 4. Send transaction
      const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
      
      // 5. Notify backend to update status to FUNDED
      const fundRes = await fetchWithAuth(`/tasks/${task.id}/fund`, {
        method: 'POST',
        body: JSON.stringify({ tx_hash: txId, escrow_app_id: ESCROW_APP_ID }) // You would get app_id dynamically or securely
      });

      if (!fundRes.ok) throw new Error("Failed to verify funding on backend");
      
      alert("Task funded successfully! TxId: " + txId);
      router.push('/tasks');
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Task</h1>
      
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300">Task Title</label>
          <input 
            type="text" 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
            placeholder="e.g. Build a Web3 Login component" 
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300">Description</label>
          <textarea 
            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
            placeholder="Describe the requirements..." 
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300">Reward (ALGO)</label>
            <input 
              type="number" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="100" 
              value={reward} onChange={e => setReward(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300">Deadline (Days)</label>
            <input 
              type="number" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="7" />
          </div>
        </div>

        <button 
          onClick={handleCreateAndFund} 
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-bold text-white transition-colors mt-4">
          {loading ? 'Processing...' : 'Lock Funds & Create Task'}
        </button>
      </div>
    </div>
  )
}
