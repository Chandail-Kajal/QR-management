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
    <aside className="w-64 border-r border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#EEF2F7] p-4 flex flex-col justify-between h-screen relative select-none overflow-hidden">
      {/* Decorative Top Sub-ambient Shadow Blurs */}
      <div className="absolute top-0 left-1/4 h-28 w-32 rounded-full bg-[#60A5FA]/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-24 -right-6 h-24 w-24 rounded-full bg-[#34D399]/10 blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -left-8 h-20 w-20 rounded-full bg-[#818CF8]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Brand App Header Section */}
        <div className="flex items-center gap-2.5 px-3 py-4 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#6366F1] text-white shadow-lg shadow-[#3B82F6]/30">
            <QrCode className="h-4 w-4 stroke-[2.25]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight text-[#1E293B] flex items-center gap-1">
              <span>QR Platform</span>
              <Sparkles className="h-3 w-3 text-[#3B82F6]" />
            </h1>
            <span className="text-[10px] font-medium text-[#94A3B8] tracking-wider uppercase">
              Pro Dashboard
            </span>
          </div>
        </div>

        {/* Navigation Items Link Node Loop */}
        <nav className="space-y-2 px-0.5">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 relative overflow-hidden active:scale-[0.97] cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md shadow-[#3B82F6]/25 border border-white/30"
                    : "text-[#334155] hover:text-[#0F172A] hover:bg-white hover:shadow-md hover:-translate-y-0.5 hover:border-[#CBD5E1] border border-transparent"
                }`}
              >
                {/* Active link indicator line overlay */}
                {active && (
                  <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-full bg-white/90" />
                )}

                <item.icon
                  size={18}
                  className={`transition-transform duration-200 ${
                    active
                      ? "stroke-[2.25] text-white"
                      : "text-[#64748B] group-hover:text-[#3B82F6] group-hover:scale-110 stroke-[1.75]"
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
      <div className="relative z-10 p-2.5 bg-white/80 border border-[#E2E8F0] rounded-2xl flex items-center gap-3 mt-auto shadow-sm">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#DBEAFE] to-[#E0E7FF] border border-white/60 text-[#3B82F6] flex items-center justify-center font-mono font-bold text-xs shadow-inner">
          QR
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-[#1E293B] truncate">
            Aesthetic User
          </span>
          <span className="text-[10px] text-[#64748B] truncate">
            Premium Workspace
          </span>
        </div>
      </div>
    </aside>
  );
}
