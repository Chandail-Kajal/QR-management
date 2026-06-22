import Redis, { RedisOptions } from "ioredis";

export function createRedisClient(options: RedisOptions) {
  return new Redis(options);
}
