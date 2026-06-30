/* eslint-disable @typescript-eslint/no-explicit-any */
import { QRType } from "@/types";
import {
  Link2,
  Type,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  FileText,
  Contact,
  Globe,
  Star,
  Share2,
  LucideIcon,
} from "lucide-react";
import {
  CiInstagram as Instagram,
  CiFacebook as Facebook,
  CiLinkedin as Linkedin,
  CiYoutube as Youtube,
} from "react-icons/ci";

const qrTypeIcons: Record<QRType, any> = {
  URL: Link2,
  TEXT: Type,
  EMAIL: Mail,
  PHONE: Phone,
  SMS: MessageSquare,
  WIFI: Wifi,
  FILE: FileText,
  VCARD: Contact,

  WHATSAPP: MessageSquare,
  GOOGLE_REVIEW: Star,

  INSTAGRAM: Instagram,
  FACEBOOK: Facebook,
  LINKEDIN: Linkedin,
  X: Globe,
  YOUTUBE: Youtube,
  TIKTOK: Share2,

  SOCIAL: Share2,
};

export function getQRTypeIcon(type: QRType): LucideIcon {
  return qrTypeIcons[type] ?? Link2;
}
