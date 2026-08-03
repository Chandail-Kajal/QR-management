import { prisma } from "@/config/prisma";
import { env } from "@/env";
import { eventBus } from "@/config/eventBus";
import { fetchWithRetry } from "../fetch-with-retry/geoLocationService";
import { logger } from "@/config/logger";

export function registerIpApiGeoLocationService() {
    eventBus.on("addGeoLocationDetail", async (data) => {
        try {
            const geoData = await fetchWithRetry<{ city?: string, country?: string }>(
                `${env.GEO_API}/json/${data.ip}`,
                {},
                {
                    retries: 5,
                    timeoutMs: 5000,
                },
            );

            await prisma.qRScan.update({
                where: { id: data.logId },
                data: {
                    city: geoData.city ?? "",
                    country: geoData.country ?? "",
                },
            });

            logger.info("[GeoLocationService] QR scan updated.", {
                ip: data.ip,
                logId: data.logId,
            });
        } catch (error) {
            logger.error("[GeoLocationService] Failed to fetch geolocation.", {
                ip: data.ip,
                logId: data.logId,
                error,
            });
        }
    });
}


export function updateGeolocationOnScan(ip: string, logId: number) {
    logger.info(`[GeoLocationService] Emitted scan update.`, { ip, logId })
    eventBus.emit("addGeoLocationDetail", { ip, logId: logId })
}