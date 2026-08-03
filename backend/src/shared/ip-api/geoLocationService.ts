import { env } from "@/env";

export interface GeoLocationResponse {
  ip: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_capital: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  org?: string;
  asn?: string;
}

export async function GeoLocationService(
  ip: string,
): Promise<GeoLocationResponse | null> {
  try {
    const res = await fetch(`${env.GEO_API}/json/${ip}`);
    if (!res.ok) {
      throw new Error(`GeoLocation request failed with status: ${res.status}`);
    }
    const data: GeoLocationResponse = await res.json();
    return data;
  } catch (error) {
    console.error("[GeoLocationService Error]:", error);
    return null;
  }
}
