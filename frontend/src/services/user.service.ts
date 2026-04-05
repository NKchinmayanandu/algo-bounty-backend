import api from "./api";
import { endpoints } from "@/config/endpoints";
import type { Task, User } from "@/types";

export const userService = {
  async getHistory(): Promise<Task[]> {
    const res = await api.get<Task[]>(endpoints.users.history);
    return res.data;
  },

  async getProfile(id: number): Promise<User> {
    const res = await api.get<User>(endpoints.users.profile(id));
    return res.data;
  },
};
