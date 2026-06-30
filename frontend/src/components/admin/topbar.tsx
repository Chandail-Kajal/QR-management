"use client";

import { ChevronRight, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function Topbar() {
  const router = useRouter();

  const { user, workspaces, setWorkspace, selectedWorkspaceId, logout } =
    useAuthStore();

  const { breadcrumbs, theme, toggleTheme, sidebar, setSidebar } = useUIStore();

  async function handleLogout() {
    logout();
    router.push("/login");
  }

  function toggleSidebar() {
    setSidebar(sidebar === "open" ? "compact" : "open");
  }

  return (
    <header className="flex h-full w-full py-1 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-5">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {index !== 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}

              {item.href ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
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

        <Select
          value={workspaces.find((ws) => selectedWorkspaceId === ws.id)?.name}
          onValueChange={(val) => {
            const wsId = workspaces.find((ws) => ws.name === val);
            if (!wsId) return;
            setWorkspace(wsId?.id);
          }}
        >
          <SelectTrigger className="border-border bg-background focus:border-secondary w-full text-left">
            <SelectValue placeholder="Select context" />
          </SelectTrigger>
          <SelectContent className="bg-surface border border-border">
            {workspaces.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className=" flex items-center gap-3 rounded-xl border border-border bg-background pr-4 py-0.5">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full">
            <User className="h-5 w-5" />
          </div>

          <div className="hidden md:block">
            <div className="max-w-40 truncate text-sm font-medium">
              {user?.name ?? "User"}
            </div>

            <div className="text-muted-foreground text-xs">Operator</div>
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
