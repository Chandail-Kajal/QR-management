"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  QrCode,
  LayoutDashboard,
  BarChart3,
  Folder,
  Users,
  CreditCard,
  Settings,
  Sparkles,
} from "lucide-react";

const items = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "QR Codes",
    href: "/admin/qrs",
    icon: QrCode,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Folders",
    href: "/admin/folders",
    icon: Folder,
  },
  {
    name: "Team",
    href: "/admin/team",
    icon: Users,
  },
  {
    name: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-sidebar-border/50 bg-sidebar/60 backdrop-blur-md p-4 flex flex-col justify-between h-screen relative select-none">
      {/* Decorative Top Sub-ambient Shadow Blurs */}
      <div className="absolute top-0 left-1/4 h-24 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      <div>
        {/* Brand App Header Section */}
        <div className="flex items-center gap-2.5 px-3 py-4 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulse">
            <QrCode className="h-4 w-4 stroke-[2.25]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1">
              <span>QR Platform</span>
              <Sparkles className="h-3 w-3 text-primary" />
            </h1>
            <span className="text-[10px] font-medium text-muted-foreground/60 tracking-wider uppercase">Pro Dashboard</span>
          </div>
        </div>

        {/* Navigation Items Link Node Loop */}
        <nav className="space-y-1.5 px-0.5">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 relative overflow-hidden ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10 border border-primary/20"
                    : "text-sidebar-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 border border-transparent"
                }`}
              >
                {/* Active link indicator line overlay */}
                {active && (
                  <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-full bg-primary-foreground/80" />
                )}

                <item.icon 
                  size={18} 
                  className={`transition-transform duration-200 ${
                    active 
                      ? "stroke-[2.25]" 
                      : "text-muted-foreground/70 group-hover:text-primary group-hover:scale-105 stroke-[1.75]"
                  }`} 
                />
                
                <span className={active ? "font-semibold" : ""}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Aesthetic Profile Status Banner Footer */}
      <div className="p-2 bg-card/40 border border-border/20 rounded-2xl flex items-center gap-3 mt-auto">
        <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-mono font-bold text-xs shadow-inner">
          QR
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-foreground truncate">Aesthetic User</span>
          <span className="text-[10px] text-muted-foreground/70 truncate">Premium Workspace</span>
        </div>
      </div>
    </aside>
  );
}