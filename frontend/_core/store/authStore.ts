import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserProfile = {
  email: string;
  role: string;
  name: string;
  title?: string;
  specialization?: string;
  createdAt?: any;
  [key: string]: any;
};

type User = {
  uid: string;
  token: string;
  user?: UserProfile;
};

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
