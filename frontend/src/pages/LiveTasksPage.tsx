import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Coins } from "lucide-react";
import { Card, CardSkeleton } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/Input";
import { taskService } from "@/services/tasks.service";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { Task } from "@/types";

export default function LiveTasksPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.list();
      setTasks(data);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTaskClick = (taskId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/dashboard/tasks/${taskId}`);
  };

  const statuses = [
    "ALL",
    "OPEN",
    "FUNDED",
    "CLAIMED",
    "SUBMITTED",
    "VERIFIED",
    "PAID",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Live Tasks
        </h1>
        <p className="text-text-secondary">
          Browse available bounties and start earning
        </p>
      </motion.div>

      {/* Search & Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
            id="search-tasks"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter size={14} className="text-text-muted shrink-0" />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all
                ${
                  filterStatus === s
                    ? "bg-sakura-400/15 text-sakura-300 border border-sakura-400/30"
                    : "bg-surface-800 text-text-muted border border-border-subtle hover:text-text-secondary"
                }
              `}
            >
              {s === "ALL" ? "All" : s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Task Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-800 flex items-center justify-center">
            <Search size={24} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            No tasks found
          </h3>
          <p className="text-sm text-text-secondary">
            Try adjusting your search or filter
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card onClick={() => handleTaskClick(task.id)} className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <StatusBadge status={task.status} />
                  <span className="text-xs text-text-muted font-mono">
                    #{task.id}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                  {task.title}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-3 mb-6">
                  {task.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                  <div className="flex items-center gap-1.5 text-sakura-400">
                    <Coins size={14} />
                    <span className="text-sm font-semibold">
                      {task.reward} ALGO
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
