
import { logger } from "@/config/logger";


const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

interface RetryOptions {
  retries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
}

function isRetryableStatus(status: number) {
  return (
    status === 408 ||
    status === 425 ||
    status === 429 ||
    (status >= 500 && status < 600)
  );
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;

  // Retry-After: 120
  const seconds = Number(header);
  if (!Number.isNaN(seconds)) {
    return seconds * 1000;
  }

  // Retry-After: Wed, 21 Oct 2015 07:28:00 GMT
  const retryDate = new Date(header).getTime();
  if (Number.isNaN(retryDate)) {
    return null;
  }

  return Math.max(0, retryDate - Date.now());
}

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  {
    retries = 5,
    initialDelayMs = 500,
    maxDelayMs = 30_000,
    timeoutMs = 10_000,
  }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        return (await response.json()) as T;
      }

      if (!isRetryableStatus(response.status)) {
        throw new Error(
          `Non-retryable response: ${response.status} ${response.statusText}`
        );
      }

      lastError = new Error(
        `Retryable response: ${response.status} ${response.statusText}`
      );

      if (attempt > retries) {
        throw lastError;
      }

      const retryAfter = parseRetryAfter(
        response.headers.get("retry-after")
      );

      // Full jitter (AWS recommendation)
      const exponential = Math.min(
        initialDelayMs * 2 ** (attempt - 1),
        maxDelayMs,
      );

      const delay =
        retryAfter ??
        Math.floor(Math.random() * exponential);

      logger.warn(
        `[GeoLocationService] Attempt ${attempt}/${retries + 1} failed (${response.status}). Retrying in ${delay}ms.`,
      );

      await sleep(delay);
    } catch (err) {
      clearTimeout(timeout);

      lastError = err;

      if (attempt > retries) {
        break;
      }

      // Retry only network/timeout errors
      if (
        err instanceof Error &&
        err.name !== "AbortError" &&
        err.name !== "TypeError"
      ) {
        throw err;
      }

      const exponential = Math.min(
        initialDelayMs * 2 ** (attempt - 1),
        maxDelayMs,
      );

      const delay = Math.floor(Math.random() * exponential);

      logger.warn(
        `[GeoLocationService] Attempt ${attempt}/${retries + 1} failed with ${err instanceof Error ? err.name : "UnknownError"
        }. Retrying in ${delay}ms.`,
        { err },
      );

      await sleep(delay);
    }
  }

  throw new Error(`Request failed after ${retries + 1} attempts`);
}

