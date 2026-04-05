import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setLoading(true);
    try {
      await register(username, password);
      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950 relative overflow-hidden font-sans">
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-sakura-400/5 blur-[100px] animate-pulse-glow" />

      <div className="flex-1 flex items-center justify-center px-6 relative z-10 w-full h-full">
        <div className="w-full max-w-6xl mx-auto flex justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md flex flex-col"
          >
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <Sparkles size={20} className="text-sakura-400" />
                <span className="text-xl font-bold text-gradient-sakura">
                  Bounty Escrow
                </span>
              </Link>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Create Account
              </h1>
              <p className="text-text-secondary text-sm">
                Join the trustless bounty platform
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="glass-card w-full max-w-md p-8 rounded-2xl flex flex-col gap-6 mx-auto"
              id="register-form"
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
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User size={16} />}
                required
                id="register-username"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                required
                id="register-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock size={16} />}
                required
                id="register-confirm-password"
              />

              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                className="w-full mt-2"
              >
                Create Account
                <ArrowRight size={16} />
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-sakura-400 hover:text-sakura-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
