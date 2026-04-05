import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, PlusCircle, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function DashboardHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back,{" "}
          <span className="text-gradient-sakura">{user?.username}</span>
        </h1>
        <p className="text-text-secondary">Manage your bounties and tasks</p>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div
          className="glass-card p-8 cursor-pointer group"
          onClick={() => navigate("/dashboard/tasks")}
        >
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/15 transition-colors">
            <Eye size={22} className="text-violet-400" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Browse Tasks
          </h3>
          <p className="text-sm text-text-secondary">
            Explore active bounties and find work
          </p>
        </div>

        <div
          className="glass-card p-8 cursor-pointer group"
          onClick={() => navigate("/dashboard/create")}
        >
          <div className="w-12 h-12 rounded-xl bg-sakura-400/10 border border-sakura-400/20 flex items-center justify-center mb-4 group-hover:bg-sakura-400/15 transition-colors">
            <PlusCircle size={22} className="text-sakura-400" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Create Bounty
          </h3>
          <p className="text-sm text-text-secondary">
            Post a new task with escrow funding
          </p>
        </div>
      </motion.div>

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: Shield,
            label: "Escrow Protected",
            value: "Smart Contract",
            color: "text-emerald-400",
          },
          {
            icon: TrendingUp,
            label: "Platform",
            value: "Algorand",
            color: "text-violet-400",
          },
          {
            icon: Eye,
            label: "Verification",
            value: "Automated",
            color: "text-sakura-400",
          },
        ].map((item, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-3">
              <item.icon size={18} className={item.color} />
              <div>
                <p className="text-xs text-text-muted">{item.label}</p>
                <p className="text-sm font-semibold text-text-primary">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
