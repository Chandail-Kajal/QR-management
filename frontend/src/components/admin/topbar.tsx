"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { LogOut, User } from "lucide-react"; // Contextual icons for visual weight

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md px-6 flex items-center justify-between select-none relative z-40">
      {/* Left Area: Glassmorphic Workspace Switcher */}
      <div className="flex items-center gap-2">
        <WorkspaceSwitcher />
      </div>

      {/* Right Area: Profile Node & Action Controls */}
      <div className="flex items-center gap-5">
        {/* User Card Combo */}
        <div className="flex items-center gap-2.5 px-2 py-1 rounded-xl bg-muted/30 border border-border/10">
          {/* Mock Miniature Avatar */}
          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <User className="h-4 w-4 stroke-[2]" />
          </div>
          
          <div className="flex flex-col items-start hidden sm:flex">
            <span className="text-xs font-bold text-foreground/90 tracking-wide">
              {user?.name || "Active Session"}
            </span>
            <span className="text-[9px] font-bold text-primary tracking-widest uppercase opacity-80">
              Operator
            </span>
          </div>
        </div>

        {/* Divider Stripe */}
        <div className="h-4 w-[1px] bg-border/40 hidden sm:block" />

        {/* Dynamic Aesthetic Exit Trigger */}
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="h-9 rounded-xl border-border/80 text-xs font-semibold tracking-wide text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 active:scale-95 transition-all duration-200 px-4 flex items-center gap-2"
        >
          <LogOut className="h-3.5 w-3.5 stroke-[2]" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}