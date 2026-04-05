import { create } from "zustand";
import type { User } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  walletAddress: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    walletAddress?: string,
  ) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  connectWallet: (address: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  fetchWallet: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: true,
  walletAddress: null,

  initialize: async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await get().fetchUser();
        await get().fetchWallet();
      } catch {
        get().logout();
      }
    }
    set({ isLoading: false });
  },

  login: async (username, password) => {
    const data = await authService.login({ username, password });
    localStorage.setItem("access_token", data.access_token);
    set({ token: data.access_token, isAuthenticated: true });
    await get().fetchUser();
    await get().fetchWallet();
  },

  register: async (username, password, walletAddress) => {
    await authService.register({
      username,
      password,
      wallet_address: walletAddress,
    });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      walletAddress: null,
    });
  },

  fetchUser: async () => {
    const user = await authService.getMe();
    set({ user, isAuthenticated: true });
  },

  connectWallet: async (address) => {
    await authService.connectWallet({ wallet_address: address });
    set({ walletAddress: address });
  },

  disconnectWallet: async () => {
    await authService.disconnectWallet();
    set({ walletAddress: null });
  },

  fetchWallet: async () => {
    try {
      const data = await authService.getMyWallet();
      set({ walletAddress: data.wallet_address });
    } catch {
      set({ walletAddress: null });
    }
  },
}));
