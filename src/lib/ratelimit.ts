import { RateLimiterMemory } from 'rate-limiter-flexible';

import HttpStatusCode from '@/enums/http-status-codes';

const apiLimiter = new RateLimiterMemory({
  points: 10, // Number of points
  duration: 60, // Per second
  blockDuration: 60 // Block for 1 minute if exceeded
});

/**
 * Rate limiting middleware for API routes
 * @param ip Client IP address to rate limit
 * @returns Response object if rate limit exceeded, undefined otherwise
 */
export async function checkRateLimit(
  ip: string
): Promise<Response | undefined> {
  try {
    await apiLimiter.consume(ip);
    return undefined;
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Too many requests, please try again later',
        code: 'rate_limit_exceeded'
      }),
      {
        status: HttpStatusCode.TOO_MANY_REQUESTS_429,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
