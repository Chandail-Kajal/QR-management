import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ILoginResponseDTO } from "@/types";

interface AuthState {
  user: ILoginResponseDTO["user"] | null;
  plan: ILoginResponseDTO["subscription"] | null;
  accessToken: ILoginResponseDTO["accessToken"] | null;

  hydrated: boolean;
  setHydrated: () => void;

  setAuth: (data: ILoginResponseDTO) => void;
  setAccessToken: (token: string) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      plan: null,
      accessToken: null,
      hydrated: false,
      selectedWorkspaceId: null,
      setHydrated: () => set({ hydrated: true }),

      setAuth: (data) =>
        set({
          ...data,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),

      logout: () =>
        set({
          user: null,
          plan: null,
          accessToken: null,
        }),
    }),
    {
      name: "qr-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
