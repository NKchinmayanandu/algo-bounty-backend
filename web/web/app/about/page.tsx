export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold mb-8">How It Works</h1>
      
      <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Escrow Explanation</h2>
        <p className="text-zinc-300">
          When a task creator posts a bounty, their Algorand funds are immediately locked in an immutable PyTeal smart contract.
          This ensures the worker is guaranteed payment upon successful completion of the task.
        </p>
      </section>

      <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Automated Verification</h2>
        <p className="text-zinc-300">
          Once the worker submits their GitHub repository, the backend verifies the repository's status.
          If it meets the requirements, the platform instructs the smart contract to release the funds directly to the worker.
        </p>
      </section>

      <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. Rating System</h2>
        <p className="text-zinc-300">
          Both creators and workers can rate each other after a successful transaction. Higher ratings build trust within the community.
        </p>
      </section>
    </div>
  )
}
