"use client"
import { useState, useRef, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'

export default function WalletButton() {
  const { wallets, activeAccount } = useWallet()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleConnect = () => {
    if (wallets && wallets.length > 0) wallets[0]?.connect()
  }

  const handleDisconnect = () => {
    if (wallets) wallets.forEach(w => w.disconnect())
    setOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!activeAccount) {
    return (
      <button
        onClick={handleConnect}
        className="text-sm px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-colors"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="text-xs px-3 py-1.5 bg-[#0a0a0f] border border-green-900 rounded-full font-mono text-green-400 hover:border-green-700 transition-colors"
      >
        {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/8 bg-[#12121a] shadow-xl shadow-black/40 overflow-hidden z-50">
          <div className="px-4 py-2.5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Connected</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 truncate">{activeAccount.address}</p>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <span>⏏</span> Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  )
}
