export interface UrlQRContent {
  type: "URL";
  url: string;
}

export interface TextQRContent {
  type: "TEXT";
  text: string;
}

export interface EmailQRContent {
  type: "EMAIL";
  email: string;
  subject?: string;
  body?: string;
}

export interface PhoneQRContent {
  type: "PHONE";
  phone: string;
}

export interface SmsQRContent {
  type: "SMS";
  phone: string;
  message?: string;
}

export interface WifiQRContent {
  type: "WIFI";
  ssid: string;
  password: string;
  encryption: "WPA" | "WPA2" | "WEP" | "NONE";
  hidden?: boolean;
}

export interface FileQRContent {
  type: "FILE";

  fileId: number;

  fileName?: string;
}

export interface VCardQRContent {
  type: "VCARD";

  firstName: string;
  lastName?: string;

  company?: string;
  title?: string;

  phone?: string;
  email?: string;
  website?: string;

  address?: string;

  note?: string;
}

export interface WhatsAppQRContent {
  type: "WHATSAPP";

  phone: string;
  message?: string;
}

export interface GoogleReviewQRContent {
  type: "GOOGLE_REVIEW";
  placeId: string;
  reviewUrl: string;
}

export interface InstagramQRContent {
  type: "INSTAGRAM";
  username: string;
  url: string;
}

export interface FacebookQRContent {
  type: "FACEBOOK";
  pageName?: string;
  url: string;
}

export interface LinkedInQRContent {
  type: "LINKEDIN";
  profileName?: string;
  url: string;
}

export interface XQRContent {
  type: "X";
  username?: string;
  url: string;
}

export interface YouTubeQRContent {
  type: "YOUTUBE";
  channelName?: string;
  url: string;
}

export interface TikTokQRContent {
  type: "TIKTOK";
  username?: string;
  url: string;
}

export interface SocialQRContent {
  type: "SOCIAL";
  title?: string;
  description?: string;
  avatarFileId?: number;
  links: {
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}

export type QRContent =
  | UrlQRContent
  | TextQRContent
  | EmailQRContent
  | PhoneQRContent
  | SmsQRContent
  | WifiQRContent
  | FileQRContent
  | VCardQRContent
  | WhatsAppQRContent
  | GoogleReviewQRContent
  | InstagramQRContent
  | FacebookQRContent
  | LinkedInQRContent
  | XQRContent
  | YouTubeQRContent
  | TikTokQRContent
  | SocialQRContent;

export interface ContactCardDto {
  fullName: string;
  company?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  avatarUrl?: string;
}
