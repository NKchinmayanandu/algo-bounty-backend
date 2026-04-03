"use client"
import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        
        // Fetch user object using the token immediately
        const meRes = await fetch("http://localhost:8000/auth/me", {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });
        const userObj = await meRes.json();
        
        setAuth(data.access_token, userObj);
        router.push('/dashboard');
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
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
        <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold transition-colors">SignIn</button>
      </form>
    </div>
  )
}
