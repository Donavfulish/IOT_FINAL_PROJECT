import { useAuthStore } from "@/store/auth.store";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const user = useAuthStore.getState().user; // lấy state trực tiếp, không dùng hook
  if (user) {
    // Nếu config.headers là AxiosHeaders, dùng set()
    config.headers?.set?.("user-id", user.id);
  }
  return config;
});
