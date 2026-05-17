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
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
