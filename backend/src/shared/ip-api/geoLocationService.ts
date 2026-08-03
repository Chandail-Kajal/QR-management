import { env } from "@/env";

// 1. Strongly typed interface matching ipapi.co JSON structure
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

/**
 * Service to retrieve visitor geolocation data based on IP address.
 * Call this function on the server side or inside Next.js API route handlers.
 */
export async function GeoLocationService(): Promise<GeoLocationResponse | null> {
  try {
    const res = await fetch(env.GEO_API, {
      // "no-store" ensures fresh location lookup per request without caching outdated data
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error(`GeoLocation request failed with status: ${res.status}`);
    }

    const data: GeoLocationResponse = await res.json();
    
    // Optional debug log
    console.log(
      `[GeoLocationService] Detected: ${data.city}, ${data.country_name} (${data.latitude}, ${data.longitude})`
    );

    return data;
  } catch (error) {
    console.error("[GeoLocationService Error]:", error);
    return null;
  }
}