"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, wallet_address: walletAddress || null })
      });
      if (res.ok) {
        alert("Registration complete! Please log in.");
        router.push('/login');
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-zinc-400">Username</label>
          <input 
            type="text" 
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 focus:border-blue-500 outline-none" 
            value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1 text-zinc-400">Password</label>
          <input 
            type="password" 
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 focus:border-blue-500 outline-none" 
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1 text-zinc-400">Default Wallet Address (Optional)</label>
          <input 
            type="text" 
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 focus:border-blue-500 outline-none" 
            value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold transition-colors">SignUp</button>
      </form>
    </div>
  )
}
