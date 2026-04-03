"use client"
import Link from 'next/link'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, TorusKnot } from '@react-three/drei'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="h-64 w-full mb-8 cursor-grab">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <TorusKnot args={[1, 0.3, 128, 32]}>
            <meshStandardMaterial color="#3b82f6" wireframe />
          </TorusKnot>
          <OrbitControls autoRotate enableZoom={false} />
        </Canvas>
      </div>
      <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
        Trustless Task Bounty Platform
      </h1>
      <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
        Complete tasks funded by Algorand smart contracts. Escrow guarantees payment. No middlemen.
      </p>
      <div className="flex gap-4">
        <Link href="/tasks" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-colors">
          View Tasks
        </Link>
        <Link href="/about" className="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-semibold transition-colors">
          How it Works
        </Link>
      </div>
    </div>
  )
}
