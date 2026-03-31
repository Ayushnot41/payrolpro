"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/constants";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
  login: (token: string, user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (token, user) =>
        set({ isAuthenticated: true, token, user }),
      logout: () =>
        set({ isAuthenticated: false, token: null, user: null }),
    }),
    { name: "payrollpro-auth" }
  )
);

interface UIState {
  sidebarOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMonth: (month) => set({ selectedMonth: month }),
  setYear: (year) => set({ selectedYear: year }),
}));
