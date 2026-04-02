export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
export const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000";

export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    walletConnect: "/auth/wallet/connect",
    walletMe: "/auth/wallet/me",
    walletDisconnect: "/auth/wallet/disconnect",
  },
  tasks: {
    list: "/tasks/",
    create: "/tasks/",
    detail: (id: number) => `/tasks/${id}`,
    fund: (id: number) => `/tasks/${id}/fund`,
    claim: (id: number) => `/tasks/${id}/claim`,
    submit: (id: number) => `/tasks/${id}/submit`,
    verify: (id: number) => `/tasks/${id}/verify`,
    release: (id: number) => `/tasks/${id}/release`,
  },
  users: {
    history: "/users/me/history",
    profile: (id: number) => `/users/${id}`,
  },
  websocket: {
    tasks: "/ws/tasks",
  },
} as const;
