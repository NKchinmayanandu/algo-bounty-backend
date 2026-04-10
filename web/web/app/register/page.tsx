"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="w-full max-w-sm px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center -z-10">
        <div className="w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-zinc-400 text-sm mt-2">Join the trustless bounty ecosystem on Algorand</p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-7">
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">👤</span>
              <input
                type="text"
                placeholder="Choose a username"
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
                placeholder="Create a password (min. 4 chars)"
                className="w-full bg-white/[0.04] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔒</span>
              <input
                type="password"
                placeholder="Repeat your password"
                className="w-full bg-white/[0.04] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Wallet Address (optional) */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Wallet Address <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">◎</span>
              <input
                type="text"
                placeholder="Your Algorand wallet address"
                className="w-full bg-white/[0.04] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all font-mono"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/30 mt-2"
          >
            Create Account <span>→</span>
          </button>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-zinc-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
