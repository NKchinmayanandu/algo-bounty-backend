"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, CheckSquare, Clock } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: CheckSquare, label: 'Live Tasks' },
  { href: '/create-task', icon: PlusCircle, label: 'Create Task' },
  { href: '/history', icon: Clock, label: 'History' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-full bg-[#0d0d14] border-r border-white/5 p-4 hidden md:flex flex-col gap-1">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={16} className={active ? 'text-purple-400' : ''} />
            {label}
          </Link>
        )
      })}
    </aside>
  )
}
