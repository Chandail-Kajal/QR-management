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
    <aside className="w-64 border-r bg-background p-4">
      <h1 className="mb-6 text-xl font-bold">QR Platform</h1>

      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
