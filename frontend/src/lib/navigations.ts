import {
  CreditCard,
  Folder,
  LayoutDashboard,
  LucideIcon,
  QrCode,
  Settings,
  Users,
} from "lucide-react";
import { Role } from "./roles";

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  access: Role[];
  children?: NavItem[];
}

export const navigations: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    access: [Role.ADMIN, Role.USER],
  },
  {
    id: "qr",
    label: "All QR Codes",
    icon: QrCode,
    access: [Role.ADMIN, Role.USER],
    href: "/admin/qr-codes",
  },
  {
    id: "folders",
    label: "Folders",
    href: "/admin/folders",
    icon: Folder,
    access: [Role.ADMIN, Role.USER],
  },
  {
    id: "users",
    label: "Users",
    href: "/admin/users",
    icon: Users,
    access: [Role.ADMIN],
  },
  {
    id: "billing",
    label: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
    access: [Role.ADMIN],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    access: [Role.ADMIN],

  },
];
