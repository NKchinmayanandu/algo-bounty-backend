import type { TaskStatus } from "@/types";

const statusConfig: Record<
  TaskStatus,
  { label: string; color: string; bg: string }
> = {
  OPEN: {
    label: "Open",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  FUNDED: {
    label: "Funded",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  CLAIMED: {
    label: "Claimed",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  SUBMITTED: {
    label: "Submitted",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
  },
  VERIFIED: {
    label: "Verified",
    color: "text-sakura-400",
    bg: "bg-sakura-400/10 border-sakura-400/20",
  },
  PAID: {
    label: "Paid",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </span>
  );
}
