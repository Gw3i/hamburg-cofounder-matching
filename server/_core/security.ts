import type { Express } from "express";
import helmet from "helmet";
import cors from "cors";

/**
 * Security Middleware Configuration - November 2025 Best Practices
 *
 * Implements:
 * - CORS (Cross-Origin Resource Sharing)
 * - Security headers via Helmet
 * - HTTPS enforcement for production
 * - CSP (Content Security Policy)
 */

export function setupSecurityMiddleware(app: Express) {
  const isProduction = process.env.NODE_ENV === "production";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "";

  // CORS Configuration
  app.use(
    cors({
      origin: isProduction
        ? frontendUrl // In production, only allow configured frontend domain
        : true, // In development, allow all origins
      credentials: true, // Allow cookies and authorization headers
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: [
        "RateLimit-Limit",
        "RateLimit-Remaining",
        "RateLimit-Reset",
      ],
    })
  );

  // Security Headers via Helmet
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          scriptSrc: [
            "'self'",
            // Allow Vite inline scripts in development
            ...(!isProduction ? ["'unsafe-inline'"] : []),
            // Allow Manus analytics
            "https://manus-analytics.com",
          ],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: [
            "'self'",
            supabaseUrl,
            // Allow Manus analytics connection
            "https://manus-analytics.com",
          ],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      // HTTP Strict Transport Security (HSTS)
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      // X-Frame-Options: Prevent clickjacking
      frameguard: {
        action: "deny",
      },
      // X-Content-Type-Options: Prevent MIME sniffing
      noSniff: true,
      // X-XSS-Protection: Enable XSS filter
      xssFilter: true,
      // Referrer-Policy: Control referrer information
      referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
      },
    })
  );

  // HTTPS Enforcement in Production (skip for localhost)
  if (isProduction) {
    app.use((req, res, next) => {
      // Skip HTTPS enforcement for localhost (development/testing)
      const isLocalhost =
        req.headers.host?.includes("localhost") ||
        req.headers.host?.includes("127.0.0.1");

      if (isLocalhost) {
        return next();
      }

      // Check if request is already HTTPS
      const isHttps =
        req.secure ||
        req.headers["x-forwarded-proto"] === "https" ||
        req.headers["x-forwarded-ssl"] === "on";

      if (!isHttps) {
        // Redirect HTTP to HTTPS
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
      }

      next();
    });
  }

  console.log("[Security] Security middleware configured");
  console.log(
    `[Security] CORS origin: ${isProduction ? frontendUrl : "all origins (development)"}`
  );
  console.log(
    `[Security] HTTPS enforcement: ${isProduction ? "enabled" : "disabled (development)"}`
  );
}
