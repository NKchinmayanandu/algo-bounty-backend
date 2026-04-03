"use client"
import Link from 'next/link'
import { LayoutDashboard, PlusCircle, CheckSquare, Clock } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-full p-4 hidden md:block">
      <ul className="space-y-4 text-sm font-medium">
        <li>
          <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
        </li>
        <li>
          <Link href="/tasks" className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <CheckSquare size={18} /> Live Tasks
          </Link>
        </li>
        <li>
          <Link href="/create-task" className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <PlusCircle size={18} /> Create Task
          </Link>
        </li>
        <li>
          <Link href="/history" className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <Clock size={18} /> History
          </Link>
        </li>
      </ul>
    </aside>
  )
}
