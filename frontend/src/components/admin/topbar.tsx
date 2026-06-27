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
    <header className="h-16 border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 flex items-center justify-between select-none relative z-40 overflow-hidden shadow-sm">
      {/* Ambient glow accents */}
      <div className="absolute top-0 left-1/3 h-16 w-40 rounded-full bg-[#60A5FA]/10 blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-24 h-16 w-24 rounded-full bg-[#34D399]/10 blur-2xl pointer-events-none" />

      {/* Left Area: Glassmorphic Workspace Switcher */}
      <div className="flex items-center gap-2 relative z-10">
        <WorkspaceSwitcher />
      </div>

      {/* Right Area: Profile Node & Action Controls */}
      <div className="flex items-center gap-5 relative z-10">
        {/* User Card Combo */}
        <div className="group flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#3B82F6]/30 hover:shadow-sm transition-all duration-200">
          {/* Mock Miniature Avatar */}
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#DBEAFE] to-[#E0E7FF] border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] shadow-inner group-hover:shadow-[#3B82F6]/10 transition-all duration-200">
            <User className="h-4 w-4 stroke-[2]" />
          </div>

          <div className="flex flex-col items-start hidden sm:flex">
            <span className="text-xs font-bold text-[#1E293B] tracking-wide leading-tight">
              {user?.name || "Active Session"}
            </span>
            <span className="text-[9px] font-bold text-[#3B82F6] tracking-widest uppercase opacity-90 flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-[#22C55E] shadow-[0_0_4px_#22C55E]" />
              Operator
            </span>
          </div>
        </div>

        {/* Divider Stripe */}
        <div className="h-5 w-[1px] bg-gradient-to-b from-transparent via-[#CBD5E1] to-transparent hidden sm:block" />

        {/* Dynamic Aesthetic Exit Trigger  */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="h-9 rounded-xl border-[#E2E8F0] bg-white text-xs font-semibold tracking-wide text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#FCA5A5] hover:shadow-md hover:shadow-[#EF4444]/10 active:scale-95 transition-all duration-200 px-4 flex items-center gap-2"
        >
          <LogOut className="h-3.5 w-3.5 stroke-[2]" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}
