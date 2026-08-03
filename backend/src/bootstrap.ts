import { bootstrapChecks, env } from "./env";
import { registerIpApiGeoLocationService } from "./shared/3rd-party/geolocaiton-ip-api";

const run = async () => {
    bootstrapChecks();
    const { logger } = await import("./config/logger")
    logger.info(`Starting server in [${env.NODE_ENV}] environment...`)
    registerIpApiGeoLocationService()
    logger.info("3rd Party Geolocation service registered");
    const { startServer } = await import("./server");
    await startServer();
};

run();