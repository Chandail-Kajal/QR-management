import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponseDTO, UserDTO, WorkspaceDTO } from "@/types";

interface AuthState {
  user: UserDTO | null;
  workspaces: WorkspaceDTO[];
  accessToken: string | null;

  selectedWorkspaceId: number | null;

  setAuth: (data: LoginResponseDTO) => void;
  setAccessToken: (token: string) => void;
  setWorkspace: (workspaceId: number) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      workspaces: [],
      accessToken: null,
      selectedWorkspaceId: null,

      setAuth: (data) =>
        set({
          user: data.user,
          workspaces: data.workspaces,
          accessToken: data.accessToken,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),
        
      setWorkspace: (workspaceId) =>
        set({
          selectedWorkspaceId: workspaceId,
        }),

      logout: () =>
        set({
          user: null,
          workspaces: [],
          accessToken: null,
        }),
    }),
    {
      name: "qr-auth",
    },
  ),
);
