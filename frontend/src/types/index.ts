export interface User {
  id: number;
  username: string;
  rating_avg: number;
  rating_count: number;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export type TaskStatus =
  | "OPEN"
  | "FUNDED"
  | "CLAIMED"
  | "SUBMITTED"
  | "VERIFIED"
  | "PAID";
export type VerificationStatus = "PENDING" | "VERIFIED" | "FAILED";

export interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  status: TaskStatus;
  creator_user_id: number;
  assignee_user_id: number | null;
  created_at: string;
  escrow_app_id: number | null;
  escrow_tx_id: string | null;
  funded_at: string | null;
}

export interface Submission {
  task_id: number;
  repo_url: string;
  report: string | null;
  verification_status: VerificationStatus;
  tx_hash: string | null;
  block_round: number | null;
}

export interface TaskDetail extends Task {
  submission: Submission | null;
  creator: User;
  assignee: User | null;
}

export interface TaskCreate {
  title: string;
  description: string;
  reward: number;
}

export interface UserRegister {
  username: string;
  password: string;
  wallet_address?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface WalletConnect {
  wallet_address: string;
  signature?: string;
}

export interface TaskSubmission {
  repo_url: string;
  report?: string;
}

export interface FundPayload {
  tx_hash: string;
  escrow_app_id: number;
}

export interface WSEvent {
  event: string;
  task_id: number;
  status?: boolean;
}
