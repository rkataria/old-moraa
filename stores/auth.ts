import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TAuthStore {
  token: string | null;
  isAuthenticated: boolean;
  logOut: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<TAuthStore>()(
  persist(
    (set) => ({
      router: null,
      token: null,
      isAuthenticated: false,
      setToken: async (token) => {
        set(() => ({ token: token, isAuthenticated: true }));
      },
      logOut: () => {
        set(() => ({ isAuthenticated: false }));
      },
    }),
    {
      name: "authToken",
    }
  )
);
