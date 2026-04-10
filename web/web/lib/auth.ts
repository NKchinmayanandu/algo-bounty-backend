import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  rating_avg: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null, // Will fetch on load
  setAuth: (token, user) => {
    if (typeof window !== 'undefined') localStorage.setItem('token', token);
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
