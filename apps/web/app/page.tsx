"use client"
import Link from 'next/link'
import { AsciiScene } from '@/components/tree/ascii-scene'

export default function Home() {
  return (
    <div className="flex flex-col relative w-full h-full min-h-screen">
      <AsciiScene />
      <div className="relative z-10 w-full">
        {/* ───── HERO ───── */}
        <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-56px)] text-center px-6 overflow-hidden">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px]" />
          </div>
          <div className="pointer-events-none absolute left-1/4 top-1/4">
            <div className="w-[300px] h-[300px] rounded-full bg-pink-900/10 blur-[100px]" />
          </div>

          {/* Hero Glass Container */}
          <div className="relative z-10 flex flex-col items-center p-8 md:p-12 rounded-[2rem] bg-white/[0.04] border border-white/10 backdrop-blur-sm shadow-xl max-w-3xl mx-auto">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs text-purple-300">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
              Powered by Algorand Smart Contracts
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-2xl">
              Trustless Bounty{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">
                Escrow
              </span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-zinc-300 max-w-lg leading-relaxed">
              Eliminate trust issues in open bounty platforms with automated escrow agents. Secure,
              transparent, and fully on-chain.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex gap-4 flex-wrap justify-center">
              <Link
                href="/create-task"
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/30"
              >
                Create Task
                <span className="text-white/70 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/tasks"
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 font-semibold hover:bg-white/20 transition-colors"
              >
                View Active Tasks
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 flex gap-12 text-center">
            <div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-xs text-zinc-500 mt-1">On-chain Escrow</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-xs text-zinc-500 mt-1">Trust Required</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">&lt;2s</div>
              <div className="text-xs text-zinc-500 mt-1">Settlement Time</div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 text-zinc-600 animate-bounce text-lg">∨</div>
        </section>

        {/* ───── HOW IT WORKS ───── */}
        <section className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-pink-500 uppercase mb-3">How it Works</p>
              <h2 className="text-4xl font-bold">Built for fairness</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🛡️',
                  title: 'Smart Escrow',
                  desc: 'Funds locked in Algorand smart contracts and released only after verified completion.',
                },
                {
                  icon: '⚡',
                  title: 'Instant Settlement',
                  desc: 'Verified submissions trigger automated payment — no intermediary, no delays.',
                },
                {
                  icon: '🔒',
                  title: 'Trustless by Design',
                  desc: 'Neither party can run away. The protocol enforces fair outcomes mathematically.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-purple-500/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── THE PROCESS ───── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-pink-500 uppercase mb-3">The Process</p>
              <h2 className="text-4xl font-bold">Four steps to trustless payment</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { n: '01', title: 'Create Task', desc: 'Post your bounty with a description and reward amount in ALGO.' },
                { n: '02', title: 'Fund Escrow', desc: 'Connect wallet and lock funds into a tamper-proof smart contract.' },
                { n: '03', title: 'Claim & Submit', desc: 'Contributors claim the task and submit work for review.' },
                { n: '04', title: 'Verify & Release', desc: 'Creator verifies delivery and funds are automatically released.' },
              ].map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all"
                >
                  <div className="text-2xl font-bold text-zinc-600 mb-3">{step.n}</div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── CTA BANNER ───── */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto rounded-3xl border border-purple-500/10 bg-gradient-to-br from-purple-900/20 to-pink-900/10 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build without trust issues?</h2>
            <p className="text-zinc-400 mb-8">Start posting bounties or contribute to existing tasks today.</p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/30"
              >
                Get Started Free
                <span className="text-white/70 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/tasks"
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-colors"
              >
                Browse Tasks
              </Link>
            </div>

            <div className="mt-6 flex justify-center gap-6 text-xs text-zinc-500">
              <span>✓ No credit card</span>
              <span>✓ Open source</span>
              <span>✓ Fully on-chain</span>
            </div>
          </div>
        </section>

        {/* ───── FOOTER ───── */}
        <footer className="border-t border-white/5 py-8 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                B
              </div>
              <span className="text-sm font-medium text-zinc-400">Bounty Escrow Agent</span>
            </div>
            <p className="text-xs text-zinc-600">© 2026 Bounty Escrow Agent. Built on Algorand.</p>
          </div>
        </footer>

      </div >
    </div >
  )
}
