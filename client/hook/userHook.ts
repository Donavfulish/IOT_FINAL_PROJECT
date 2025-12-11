import { api } from "@/lib/axios";
import { useAuthStore, User } from "@/store/auth.store";

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserRegisterPayload {
  email: string;
  password: string;
  bin_id: string;
  bin_password: string;
}

export interface UserRegisterResult {
  success: boolean;
  log: string;
  user?: User;
}

export const useLogin = async (
  payload: UserLoginPayload
): Promise<User | undefined | null> => {
  if (!payload) return undefined;

  try {
    const res = await api.post("/user/login", payload);
    useAuthStore.getState().setUser(res.data);
    return res.data;
  } catch (e) {
    console.error("Login failed: ", e);
    return undefined;
  }
};

export const useGuestLogin = () => {
  useAuthStore.getState().setGuest();
};

export const useRegister = async (
  payload: UserRegisterPayload
): Promise<UserRegisterResult> => {
  if (!payload)
    return {
      success: false,
      log: "Empty data",
    };

  try {
    const res = await api.post("/user/register", payload);
    const { success } = res.data;
    if (!success) return res.data;
    return res.data;
  } catch (e) {
    console.error("Login failed: ", e);
    return {
      success: false,
      log: "Internal Server Error",
    };
  }
};
