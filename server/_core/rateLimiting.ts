import rateLimit from "express-rate-limit";

/**
 * Rate Limiting Configuration - November 2025 Best Practices
 *
 * Protects against:
 * - Brute force attacks
 * - API abuse
 * - DoS attacks
 * - Resource exhaustion
 */

// General API rate limiter - applies to all /api/ routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip successful requests to avoid penalizing normal usage
  skipSuccessfulRequests: false,
  // Skip failed requests (optional - set to true if you want to only count successful requests)
  skipFailedRequests: false,
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth attempts per window
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  // Don't skip anything for auth - count all attempts
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Stricter limiter for file uploads (photo uploads)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: "Too many upload attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
