import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // 👈 Import persist

export interface User {
  id: number;
  email: string;
  bin_id: number;
  role: "user" | "guest";
}

interface AuthState {
  user: User | undefined | null;
  setUser: (user: User | null) => void;
  setGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: undefined,
      setUser: (user: User | null) => set({ user }),
      setGuest: () =>
        set({
          user: {
            id: 0,
            email: "",
            bin_id: 0,
            role: "guest",
          },
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // Tên key sẽ được lưu trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
