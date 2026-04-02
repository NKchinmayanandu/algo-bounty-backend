import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Star, Coins, Clock, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/hooks/useAuthStore";
import { userService } from "@/services/user.service";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/types";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, walletAddress, connectWallet, disconnectWallet, logout } =
    useAuthStore();
  const [history, setHistory] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setHistory(await userService.getHistory());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!walletInput.trim()) return;
    setWalletLoading(true);
    try {
      await connectWallet(walletInput.trim());
      setShowWalletModal(false);
    } catch {
      /* ignore */
    } finally {
      setWalletLoading(false);
    }
  };

  const created = history.filter((t) => t.creator_user_id === user?.id);
  const assigned = history.filter((t) => t.assignee_user_id === user?.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Your profile and activity</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sakura-400/20 to-violet-500/20 border border-sakura-400/20 flex items-center justify-center shrink-0">
            <User size={32} className="text-sakura-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary mb-1">
              {user?.username}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-amber-400" />
                {user?.rating_avg?.toFixed(1) || "0.0"} (
                {user?.rating_count || 0} ratings)
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                Joined{" "}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "—"}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-xl bg-surface-800 border border-border-subtle">
                <p className="text-xs text-text-muted">Created</p>
                <p className="text-lg font-bold text-text-primary">
                  {created.length}
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-surface-800 border border-border-subtle">
                <p className="text-xs text-text-muted">Assigned</p>
                <p className="text-lg font-bold text-text-primary">
                  {assigned.length}
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-surface-800 border border-border-subtle">
                <p className="text-xs text-text-muted">Earned</p>
                <p className="text-lg font-bold text-sakura-400">
                  {assigned
                    .filter((t) => t.status === "PAID")
                    .reduce((s, t) => s + t.reward, 0)
                    .toFixed(2)}{" "}
                  ALGO
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet section */}
        <div className="mt-6 pt-6 border-t border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet size={18} className="text-violet-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Algorand Wallet
              </p>
              {walletAddress ? (
                <p className="text-xs text-emerald-400 font-mono">
                  {walletAddress.slice(0, 12)}...{walletAddress.slice(-8)}
                </p>
              ) : (
                <p className="text-xs text-text-muted">Not connected</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {walletAddress ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => disconnectWallet()}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWalletModal(true)}
              >
                Connect
              </Button>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut size={14} /> Sign Out
          </Button>
        </div>
      </motion.div>

      {/* Task History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Your Bounties
        </h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <Coins size={32} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-secondary">No bounties yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
                  className="!p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={task.status} />
                        <span className="text-xs text-text-muted">
                          #{task.id}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary truncate">
                        {task.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-sm font-bold text-sakura-400">
                        {task.reward} ALGO
                      </span>
                      <p className="text-xs text-text-muted">
                        {task.creator_user_id === user?.id
                          ? "Created"
                          : "Assigned"}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Connect Wallet"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Enter your Algorand wallet address.
          </p>
          <Input
            placeholder="ALGO wallet address"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            id="profile-wallet"
          />
          <Button
            onClick={handleConnect}
            isLoading={walletLoading}
            className="w-full"
          >
            Connect
          </Button>
        </div>
      </Modal>
    </div>
  );
}
