"use client";
import { QrCode, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Role } from "@/lib/roles";
import { useState } from "react";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { navigations, NavItem } from "@/lib/navigations";

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.href) {
    if (pathname === item.href || pathname.startsWith(item.href + "/")) {
      return true;
    }
  }
  return item.children?.some((child) => isItemActive(child, pathname)) ?? false;
}

function hasAccess(item: NavItem, role: Role) {
  return item.access.includes(role);
}

interface SidebarItemProps {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  role: Role;
  level?: number;
}

function SidebarItem({
  item,
  collapsed,
  pathname,
  role,
  level = 0,
}: SidebarItemProps) {
  const router = useRouter();
  const active = isItemActive(item, pathname);
  const [open, setOpen] = useState(active);

  if (!hasAccess(item, role)) return null;

  const hasChildren = !!item.children?.length;

  const Icon = item.icon;

  return (
    <>
      <button
        onClick={() => {
          if (hasChildren) {
            setOpen((o) => !o);
          } else if (item.href) {
            router.push(item.href);
          }
        }}
        className={clsx(
          "flex w-full items-cente py-3 text-sm transition",
          active
            ? "bg-white/10 border-r-4 text-white font-semibold border-secondary"
            : "hover:bg-white/5 text-white/70",
          collapsed ? "justify-center" : "gap-3 px-5",
          "items-center",
        )}
        style={{
          paddingLeft: collapsed ? undefined : 20 + level * 20,
        }}
      >
        {Icon ? (
          <Icon size={20} />
        ) : level > 0 ? (
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full",
              active ? "bg-white" : "bg-white/70",
            )}
          />
        ) : null}

        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {hasChildren &&
              (open ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </>
        )}
      </button>

      {!collapsed &&
        hasChildren &&
        open &&
        item.children!.map((child) => (
          <SidebarItem
            key={child.id}
            item={child}
            pathname={pathname}
            collapsed={collapsed}
            role={role}
            level={level + 1}
          />
        ))}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const sidebar = useUIStore((s) => s.sidebar);
  const role = useAuthStore((s) => s.user?.role);

  if (sidebar === "closed") {
    return null;
  }

  const collapsed = sidebar === "compact";

  return (
    <aside
      className={clsx(
        "flex h-screen flex-col bg-linear-120 from-purple-900 to-purple-700 transition-all duration-300",
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
        {navigations.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            pathname={pathname}
            role={role as Role}
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
