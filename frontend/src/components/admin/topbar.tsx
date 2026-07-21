/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { LogOut, Menu, User } from "lucide-react";

export function Topbar() {
  const router = useRouter();

  const { user, logout } = useAuthStore();

  const { breadcrumbs, theme, toggleTheme, sidebar, setSidebar } = useUIStore();

  async function handleLogout() {
    logout();
    router.push("/login");
  }

  function toggleSidebar() {
    setSidebar(sidebar === "open" ? "compact" : "open");
  }

  return (
    <header className="flex h-16 w-full py-1 items-center justify-between border-b border-border bg-surface px-6 bg-linear-120 from-purple-900 to-purple-700">
      <div className="flex items-center gap-5">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5 text-white" />
        </Button>

        <div className="flex flex-col gap-0">
          <span className="text-lg font-bold text-white leading-tight">
            {breadcrumbs?.[0]?.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* <Button size="icon" variant="ghost">
          <Search className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost">
          <Bell className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button> */}

        <div className=" flex items-center gap-3 rounded-xl border border-border bg-background pr-4 py-0.5">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full">
            <User className="h-5 w-5" />
          </div>

          <div className="hidden md:block">
            <div className="max-w-40 truncate text-sm font-medium">
              {user?.name ?? "User"}
            </div>
            <div className="text-muted-foreground text-[10px]">
              {user?.role}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className={"rounded-sm"}
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
