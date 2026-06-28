import { NextRequest } from "next/server";

interface RateLimitInfo {
  count: number;
  reset: number;
}

const cache = new Map<string, RateLimitInfo>();

// Periodic cleanup of expired cache entries to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    cache.forEach((value, key) => {
      if (now > value.reset) {
        cache.delete(key);
      }
    });
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Extracts the real client IP address from request headers.
 */
export function getClientIp(request: Request | NextRequest): string {
  const headers = request.headers;
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Rate limit check function.
 * @param key unique identifier (e.g. IP + endpoint)
 * @param limit maximum requests allowed in window
 * @param windowMs window size in milliseconds
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  const reset = now + windowMs;

  const current = cache.get(key);

  if (!current) {
    cache.set(key, { count: 1, reset });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset,
    };
  }

  if (now > current.reset) {
    cache.set(key, { count: 1, reset });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset,
    };
  }

  current.count += 1;

  if (current.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: current.reset,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - current.count,
    reset: current.reset,
  };
}
