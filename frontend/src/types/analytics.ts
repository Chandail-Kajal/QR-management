export interface QRAnalyticsData {
  overview: Overview;
  scanTrend: ScanTrendItem[];
  scanTime: ScanTime;
  countries: CountValue<string | null>[];
  cities: CountValue<string | null>[];
  devices: CountValue<string>[];
  browsers: CountValue<string>[];
  os: CountValue<string>[];
  languages: CountValue<string>[];
  referrers: CountValue<string | null>[];
}

export interface Overview {
  totalScans: number;
  uniqueVisitors: number;
  uniqueRate: number;
  scansToday: number;
  lastScannedAt: string | null;
}

export interface ScanTrendItem {
  date: string;
  scans: number;
  uniqueVisitors: number;
}

export interface ScanTime {
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
}

export interface CountValue<T> {
  _count: number;
  country?: T;
  city?: T;
  device?: T;
  browser?: T;
  os?: T;
  language?: T;
  referer?: T;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  scanVolume: ScanVolumePoint[];
  deviceSplit: DeviceSplitItem[];
}

export interface DashboardSummary {
  totalScans: number;
  growth: number;
  activeQrCodes: number;
  uniqueVisitors: number;
  topPerformer: TopPerformer | null;
}

export interface TopPerformer {
  id: number;
  name: string;
  scans: number;
}

export interface ScanVolumePoint {
  date: string; // ISO date: "2025-01-15"
  scans: number;
}

export interface DeviceSplitItem {
  device: string;
  scans: number;
  percent: number;
}
