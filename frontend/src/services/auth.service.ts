import api from "./api";
import { endpoints } from "@/config/endpoints";
import type {
  User,
  Token,
  UserRegister,
  UserLogin,
  WalletConnect,
} from "@/types";

export const authService = {
  async register(data: UserRegister): Promise<User> {
    const res = await api.post<User>(endpoints.auth.register, data);
    return res.data;
  },

  async login(data: UserLogin): Promise<Token> {
    const res = await api.post<Token>(endpoints.auth.login, data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>(endpoints.auth.me);
    return res.data;
  },

  async connectWallet(data: WalletConnect) {
    const res = await api.post(endpoints.auth.walletConnect, data);
    return res.data;
  },

  async getMyWallet() {
    const res = await api.get(endpoints.auth.walletMe);
    return res.data;
  },

  async disconnectWallet() {
    const res = await api.delete(endpoints.auth.walletDisconnect);
    return res.data;
  },
};
