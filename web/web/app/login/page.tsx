"use client"
import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        const meRes = await fetch("http://localhost:8000/auth/me", {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
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
    <div className="w-full max-w-sm px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center -z-10">
        <div className="w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="text-zinc-400 text-sm mt-2">Sign in to access your bounties</p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-7">
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">✉</span>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full bg-white/[0.04] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔒</span>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-white/[0.04] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/30 mt-2"
          >
            Sign In <span>→</span>
          </button>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-zinc-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-pink-400 hover:text-pink-300 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
