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

  const { signTransactions, activeAccount, activeAddress } = useWallet();
  const router = useRouter();

  const handleCreateAndFund = async () => {
    if (!activeAccount || !activeAddress) {
      alert("Please connect your wallet first and ensure an active address is selected");
      return;
    }
    try {
      setLoading(true);
      const res = await fetchWithAuth("/tasks/", {
        method: 'POST',
        body: JSON.stringify({ title, description, reward: parseFloat(reward) })
      });
      if (!res.ok) throw new Error("Failed to create task");
      const task = await res.json();
      if (!task || !task.id) throw new Error("Backend did not return a valid task ID");

      const microAlgos = Math.floor(parseFloat(reward) * 1000000);
      const txns = await constructFundingTxGroup(activeAddress!, task.id, microAlgos);

      const encodedTxns = txns.map(tx => tx.toByte() as Uint8Array);
      const signedTxns = await signTransactions(encodedTxns);

      const validSignedTxns = signedTxns.filter(tx => tx !== null) as Uint8Array[];
      const response = await algodClient.sendRawTransaction(validSignedTxns).do();
      const txId = typeof response === 'string' ? response : (response as any).txId || (response as any).txid;

      const fundRes = await fetchWithAuth(`/tasks/${task.id}/fund`, {
        method: 'POST',
        body: JSON.stringify({ tx_hash: txId, escrow_app_id: ESCROW_APP_ID })
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
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Create a Bounty</h1>
        <p className="text-zinc-400 text-sm mt-1">Post a task and lock reward funds in a trustless smart contract.</p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-7 space-y-6">

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Task Title</label>
          <input
            type="text"
            className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all"
            placeholder="e.g. Build a Web3 Login component"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Description</label>
          <textarea
            className="w-full h-32 bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all resize-none"
            placeholder="Describe the requirements clearly..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* Reward + Deadline */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Reward (ALGO)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">◎</span>
              <input
                type="number"
                className="w-full bg-white/[0.04] border border-white/8 rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
                placeholder="0.5"
                value={reward}
                onChange={e => setReward(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Deadline (Days)</label>
            <input
              type="number"
              className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
              placeholder="7"
            />
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-xl border border-purple-500/15 bg-purple-500/5 p-4 text-xs text-purple-300 leading-relaxed">
          💡 Funds are locked on-chain in an Algorand smart contract. Payment is released automatically after your work is verified.
        </div>

        {/* Submit */}
        <button
          onClick={handleCreateAndFund}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 font-semibold text-white transition-opacity shadow-lg shadow-purple-900/20"
        >
          {loading ? '⏳ Processing...' : '🔒 Lock Funds & Create Task'}
        </button>
      </div>
    </div>
  )
}
