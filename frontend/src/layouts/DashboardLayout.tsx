import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Eye,
  PlusCircle,
  User,
  Sparkles,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

const navItems = [
  { label: "Home", path: "/dashboard", icon: Home, end: true },
  { label: "Live Tasks", path: "/dashboard/tasks", icon: Eye },
  { label: "Create Task", path: "/dashboard/create", icon: PlusCircle },
  { label: "Profile", path: "/dashboard/profile", icon: User },
];

export default function DashboardLayout() {
  const { walletAddress, connectWallet, disconnectWallet, user, logout } =
    useAuthStore();
  const navigate = useNavigate();

  // Wallet Modal State
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  const handleConnectWallet = async () => {
    if (!walletInput.trim()) return;
    setWalletLoading(true);
    try {
      await connectWallet(walletInput.trim());
      setShowWalletModal(false);
    } catch (err: any) {
      console.error("Failed to connect wallet", err);
    } finally {
      setWalletLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface-950 flex font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex flex-col w-64 shrink-0 border-r border-border-subtle bg-surface-900/50 backdrop-blur-sm z-40"
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border-subtle">
          <a href="/" className="flex items-center gap-2">
            <Sparkles size={18} className="text-sakura-400" />
            <span className="text-lg font-bold text-gradient-sakura">
              Bounty Escrow
            </span>
          </a>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-sakura-400/10 text-sakura-300 border border-sakura-400/15"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-800"
                }
              `}
            >
              <item.icon size={18} />
              {item.label}
              <ChevronRight size={14} className="ml-auto opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-6 py-4 border-t border-border-subtle">
          <button
            onClick={handleLogout}
            className="text-xs text-sakura-400 hover:text-sakura-300 transition-colors"
          >
            Log out
          </button>
        </div>
      </motion.aside>

      {/* Main content wrapper - offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-y-auto w-full">
        {/* Top Header */}
        <header className="h-16 border-b border-border-subtle bg-surface-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="text-sm font-medium text-text-secondary">
            {user?.username ? `Hello, ${user.username}` : "Dashboard"}
          </div>
          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-text-muted hover:text-red-400 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowWalletModal(true)}
                className="py-1.5 px-4 h-9 text-xs"
              >
                <Wallet size={14} className="mr-1.5" />
                Connect Wallet
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 w-full max-w-5xl mx-auto flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-900/90 backdrop-blur-xl border-t border-border-subtle">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors
                ${isActive ? "text-sakura-400" : "text-text-muted"}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Wallet Modal */}
      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Connect Algorand Wallet"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Enter your Algorand wallet address to access on-chain bounties.
          </p>
          <Input
            placeholder="ALGO wallet address"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            id="global-wallet-address-input"
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
