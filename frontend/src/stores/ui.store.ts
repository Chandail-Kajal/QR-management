import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

export type SidebarState = "open" | "compact" | "closed";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface UIState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  sidebar: SidebarState;
  setSidebar: (state: SidebarState) => void;
  toggleSidebar: () => void;
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  clearBreadcrumbs: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "system",
      setTheme: (theme) =>
        set({
          theme,
        }),

      toggleTheme: () => {
        const current = get().theme;

        set({
          theme: current === "dark" ? "light" : "dark",
        });
      },

      sidebar: "open",

      setSidebar: (sidebar) =>
        set({
          sidebar,
        }),

      toggleSidebar: () => {
        const current = get().sidebar;

        set({
          sidebar:
            current === "open"
              ? "compact"
              : current === "compact"
                ? "closed"
                : "open",
        });
      },

      breadcrumbs: [],

      setBreadcrumbs: (breadcrumbs) =>
        set({
          breadcrumbs,
        }),

      clearBreadcrumbs: () =>
        set({
          breadcrumbs: [],
        }),
    }),
    {
      name: "qr-ui",
      partialize: (state) => ({
        theme: state.theme,
        sidebar: state.sidebar,
      }),
    },
  ),
);
