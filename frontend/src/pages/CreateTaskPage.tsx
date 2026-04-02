import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Coins, FileText, Type, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { taskService } from "@/services/tasks.service";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const { isAuthenticated, walletAddress, connectWallet } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Wallet modal
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!walletAddress) {
      setShowWalletModal(true);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const task = await taskService.create({
        title,
        description,
        reward: parseFloat(reward),
      });
      setSuccess(true);
      setTimeout(() => navigate(`/dashboard/tasks/${task.id}`), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    if (!walletInput.trim()) return;
    setWalletLoading(true);
    try {
      await connectWallet(walletInput.trim());
      setShowWalletModal(false);
    } catch (err: any) {
      setError("Failed to connect wallet");
    } finally {
      setWalletLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center"
          >
            <CheckCircle size={36} className="text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Task Created!
          </h2>
          <p className="text-text-secondary">Redirecting to your task...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Create a Bounty
        </h1>
        <p className="text-text-secondary">
          Define your task and set a reward. Funds will be held in escrow.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-card p-8 flex flex-col gap-6"
        id="create-task-form"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <Input
          label="Title"
          placeholder="e.g., Build a landing page for DeFi app"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={<Type size={16} />}
          required
          id="task-title"
        />

        <Textarea
          label="Description"
          placeholder="Describe the task requirements, deliverables, and acceptance criteria..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          id="task-description"
        />

        <Input
          label="Reward (ALGO)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="10.00"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          icon={<Coins size={16} />}
          required
          id="task-reward"
        />

        {/* Wallet status */}
        <div className="p-4 rounded-xl bg-surface-800 border border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Algorand Wallet
              </p>
              {walletAddress ? (
                <p className="text-xs text-emerald-400 mt-1 font-mono">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                </p>
              ) : (
                <p className="text-xs text-text-muted mt-1">Not connected</p>
              )}
            </div>
            {!walletAddress && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowWalletModal(true)}
              >
                Connect
              </Button>
            )}
          </div>
        </div>

        <Button type="submit" size="lg" isLoading={loading} className="w-full">
          Create Bounty
          <ArrowRight size={16} />
        </Button>
      </motion.form>

      {/* Wallet Modal */}
      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Connect Algorand Wallet"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Enter your Algorand wallet address to create and fund bounties.
          </p>
          <Input
            placeholder="ALGO wallet address"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            id="wallet-address-input"
          />
          <Button
            onClick={handleConnectWallet}
            isLoading={walletLoading}
            className="w-full"
          >
            Connect Wallet
          </Button>
        </div>
      </Modal>
    </div>
  );
}
