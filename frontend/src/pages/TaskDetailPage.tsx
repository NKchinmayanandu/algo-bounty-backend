import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Coins,
  User,
  Clock,
  ExternalLink,
  CheckCircle,
  XCircle,
  Send,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { taskService } from "@/services/tasks.service";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { TaskDetail } from "@/types";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [report, setReport] = useState("");
  const [showFundModal, setShowFundModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [escrowAppId, setEscrowAppId] = useState("");

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    if (!id) return;
    try {
      setTask(await taskService.getDetail(parseInt(id)));
    } catch {
      setError("Task not found");
    } finally {
      setLoading(false);
    }
  };

  const doAction = async (fn: () => Promise<void>) => {
    setActionLoading(true);
    setError("");
    try {
      await fn();
      await loadTask();
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  if (!task)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Task not found
        </h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/tasks")}
        >
          Back
        </Button>
      </div>
    );

  const isCreator = user?.id === task.creator_user_id;
  const isAssignee = user?.id === task.assignee_user_id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate("/dashboard/tasks")}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back to tasks
      </motion.button>

      {error && (
        <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={task.status} />
              <span className="text-xs text-text-muted font-mono">
                #{task.id}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              {task.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sakura-400/10 border border-sakura-400/20">
            <Coins size={18} className="text-sakura-400" />
            <span className="text-xl font-bold text-sakura-300">
              {task.reward}
            </span>
            <span className="text-sm text-sakura-400/60">ALGO</span>
          </div>
        </div>
        <p className="text-text-secondary leading-relaxed mb-6 whitespace-pre-wrap">
          {task.description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border-subtle">
          <div>
            <p className="text-xs text-text-muted mb-1">Creator</p>
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-violet-400" />
              <span className="text-sm font-medium">
                {task.creator.username}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Assignee</p>
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-sakura-400" />
              <span className="text-sm">{task.assignee?.username || "—"}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Created</p>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-text-muted" />
              <span className="text-sm">
                {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Escrow</p>
            <span className="text-sm">
              {task.escrow_app_id ? `App #${task.escrow_app_id}` : "—"}
            </span>
          </div>
        </div>
      </motion.div>

      {task.submission && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <GitBranch size={18} className="text-violet-400" />
            Submission
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-muted mb-1">Repository</p>
              <a
                href={task.submission.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sakura-400 hover:text-sakura-300 flex items-center gap-1"
              >
                {task.submission.repo_url}
                <ExternalLink size={12} />
              </a>
            </div>
            {task.submission.report && (
              <div>
                <p className="text-xs text-text-muted mb-1">Report</p>
                <p className="text-sm text-text-secondary">
                  {task.submission.report}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <p className="text-xs text-text-muted">Verification:</p>
              {task.submission.verification_status === "VERIFIED" ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle size={12} />
                  Verified
                </span>
              ) : task.submission.verification_status === "FAILED" ? (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <XCircle size={12} />
                  Failed
                </span>
              ) : (
                <span className="text-xs text-amber-400">Pending</span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-3">
        {isCreator && task.status === "OPEN" && (
          <Button
            onClick={() => setShowFundModal(true)}
            isLoading={actionLoading}
          >
            <Coins size={16} />
            Fund Escrow
          </Button>
        )}
        {!isCreator && task.status === "FUNDED" && (
          <Button
            onClick={() =>
              doAction(() => taskService.claim(task.id).then(() => {}))
            }
            isLoading={actionLoading}
          >
            Claim Task
          </Button>
        )}
        {isAssignee && task.status === "CLAIMED" && (
          <Button
            onClick={() => setShowSubmitModal(true)}
            isLoading={actionLoading}
          >
            <Send size={16} />
            Submit Work
          </Button>
        )}
        {isCreator && task.status === "SUBMITTED" && (
          <Button
            onClick={() =>
              doAction(() => taskService.verify(task.id).then(() => {}))
            }
            isLoading={actionLoading}
          >
            <CheckCircle size={16} />
            Verify
          </Button>
        )}
        {isCreator && task.status === "VERIFIED" && (
          <Button
            onClick={() =>
              doAction(() => taskService.release(task.id).then(() => {}))
            }
            isLoading={actionLoading}
          >
            <Coins size={16} />
            Release Payment
          </Button>
        )}
      </div>

      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Your Work"
      >
        <div className="space-y-4">
          <Input
            label="Repository URL"
            placeholder="https://github.com/..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            id="submit-repo"
          />
          <Textarea
            label="Report (optional)"
            placeholder="Describe what you built..."
            value={report}
            onChange={(e) => setReport(e.target.value)}
            id="submit-report"
          />
          <Button
            onClick={() =>
              doAction(async () => {
                await taskService.submit(task.id, {
                  repo_url: repoUrl,
                  report,
                });
                setShowSubmitModal(false);
              })
            }
            isLoading={actionLoading}
            className="w-full"
          >
            Submit
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
        title="Fund Escrow"
      >
        <div className="space-y-4">
          <Input
            label="Transaction Hash"
            placeholder="Algorand tx hash"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            id="fund-tx"
          />
          <Input
            label="Escrow App ID"
            type="number"
            placeholder="App ID"
            value={escrowAppId}
            onChange={(e) => setEscrowAppId(e.target.value)}
            id="fund-app"
          />
          <Button
            onClick={() =>
              doAction(async () => {
                await taskService.fund(task.id, {
                  tx_hash: txHash,
                  escrow_app_id: parseInt(escrowAppId),
                });
                setShowFundModal(false);
              })
            }
            isLoading={actionLoading}
            className="w-full"
          >
            Fund Task
          </Button>
        </div>
      </Modal>
    </div>
  );
}
