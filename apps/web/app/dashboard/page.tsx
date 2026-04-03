"use client"

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-zinc-400 font-medium mb-2">Total Earnings</p>
          <div className="text-3xl font-bold text-blue-400">0 ALGO</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-zinc-400 font-medium mb-2">Tasks Completed</p>
          <div className="text-3xl font-bold">0</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-zinc-400 font-medium mb-2">Trust Rating</p>
          <div className="text-3xl font-bold text-yellow-500">5.0 ★</div>
        </div>
      </div>
    </div>
  )
}
