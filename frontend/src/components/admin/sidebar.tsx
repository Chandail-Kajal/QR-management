"use client";
import {
  LayoutDashboard,
  QrCode,
  ChartColumn,
  Folder,
  Users,
  CreditCard,
  Settings,
  LucideIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useUIStore } from "@/stores/ui.store";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface NavItemProps {
  item: NavItem;
  onClick: () => void;
}

const navigation: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    id: "qr-codes",
    label: "QR Codes",
    icon: QrCode,
    href: "/admin/qr-codes",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: ChartColumn,
    href: "/admin/analytics",
  },
  {
    id: "folders",
    label: "Folders",
    icon: Folder,
    href: "/admin/folders",
  },
  {
    id: "teams",
    label: "Team",
    icon: Users,
    href: "/admin/teams",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/admin/billing",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
  onClick: () => void;
}

function SidebarItem({ item, collapsed, onClick }: NavItemProps) {
  const pathname = usePathname();

  const Icon = item.icon;

  const active = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <button
      title={collapsed ? item.label : undefined}
      onClick={onClick}
      className={clsx(
        "group flex w-full items-center border-r-4 py-3 text-sm transition-all duration-200",
        collapsed ? "justify-center px-0" : "gap-3 px-5",
        active
          ? "border-secondary bg-white/10 text-sidebar-text"
          : "border-transparent text-sidebar-muted hover:bg-white/5 hover:text-sidebar-text",
      )}
    >
      <Icon size={20} strokeWidth={2} className="shrink-0" />

      {!collapsed && <span className="font-medium">{item.label}</span>}
    </button>
  );
}

export function Sidebar() {
  const router = useRouter();

  const sidebar = useUIStore((s) => s.sidebar);

  if (sidebar === "closed") {
    return null;
  }

  const collapsed = sidebar === "compact";

  return (
    <aside
      className={clsx(
        "flex h-screen flex-col bg-sidebar transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}

      <div
        className={clsx(
          "border-border/40 flex border-b p-6",
          collapsed ? "justify-center" : "gap-4",
        )}
      >
        <div className="bg-secondary shadow-card flex h-11 w-11 items-center justify-center rounded-xl shrink-0">
          <QrCode size={22} className="text-white" />
        </div>

        {!collapsed && (
          <div>
            <h1 className="text-base font-semibold text-sidebar-text">
              QR Platform
            </h1>

            <p className="text-sidebar-muted text-xs uppercase">
              Pro Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}

      <nav className="flex-1 py-2">
        {navigation.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            onClick={() => router.push(item.href)}
          />
        ))}
      </nav>

      {/* <div
        className={clsx(
          "border-white/10 border-t p-5",
          collapsed ? "flex justify-center" : "",
        )}
      >
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white shrink-0">
            AU
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-text">
                Aesthetic User
              </p>

              <p className="text-sidebar-muted truncate text-xs">
                Premium Workspace
              </p>
            </div>
          )}
        </div>
      </div> */}
    </aside>
  );
}
