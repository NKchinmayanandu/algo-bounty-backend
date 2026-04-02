import api from "./api";
import { endpoints } from "@/config/endpoints";
import type {
  Task,
  TaskDetail,
  TaskCreate,
  TaskSubmission,
  FundPayload,
  Submission,
} from "@/types";

export const taskService = {
  async list(skip = 0, limit = 100): Promise<Task[]> {
    const res = await api.get<Task[]>(endpoints.tasks.list, {
      params: { skip, limit },
    });
    return res.data;
  },

  async create(data: TaskCreate): Promise<Task> {
    const res = await api.post<Task>(endpoints.tasks.create, data);
    return res.data;
  },

  async getDetail(id: number): Promise<TaskDetail> {
    const res = await api.get<TaskDetail>(endpoints.tasks.detail(id));
    return res.data;
  },

  async fund(id: number, data: FundPayload): Promise<Task> {
    const res = await api.post<Task>(endpoints.tasks.fund(id), data);
    return res.data;
  },

  async claim(id: number): Promise<Task> {
    const res = await api.post<Task>(endpoints.tasks.claim(id));
    return res.data;
  },

  async submit(id: number, data: TaskSubmission): Promise<Submission> {
    const res = await api.post<Submission>(endpoints.tasks.submit(id), data);
    return res.data;
  },

  async verify(id: number): Promise<Task> {
    const res = await api.post<Task>(endpoints.tasks.verify(id));
    return res.data;
  },

  async release(id: number): Promise<Task> {
    const res = await api.post<Task>(endpoints.tasks.release(id));
    return res.data;
  },
};
