"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function Topbar() {
  const router = useRouter();

  const { user, logout } = useAuthStore();

  async function handleLogout() {
    await logout();

    router.push("/login");
  }

  return (
    <header className="h-16 border-b px-6 flex items-center justify-between">
      <div>
        <WorkspaceSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <span>{user?.name}</span>

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
