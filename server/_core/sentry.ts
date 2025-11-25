import * as Sentry from '@sentry/node';
import type { Express } from 'express';
import { logger } from './logger';

/**
 * Sentry Error Tracking Configuration - November 2025 Best Practices
 * 
 * Features:
 * - Automatic error capture
 * - Performance monitoring
 * - Request context tracking
 * - User context tracking
 */

export function setupSentry(app: Express) {
  const sentryDsn = process.env.SENTRY_DSN;
  const isProduction = process.env.NODE_ENV === 'production';

  // Only initialize Sentry if DSN is provided
  if (!sentryDsn) {
    logger.warn('[Sentry] SENTRY_DSN not configured - error tracking disabled');
    return;
  }

  // Initialize Sentry
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV || 'development',
    
    // Performance Monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0, // 10% in prod, 100% in dev
    
    // Only send errors in production
    enabled: isProduction,
  });

  // Note: Express middleware integration simplified for Sentry v10
  // Request tracking is handled automatically by Sentry.init()

  logger.info('[Sentry] Error tracking initialized', {
    environment: process.env.NODE_ENV,
    enabled: isProduction,
  });
}

// Error handler must be registered after all controllers
export function setupSentryErrorHandler(app: Express) {
  const sentryDsn = process.env.SENTRY_DSN;

  if (!sentryDsn) {
    return;
  }

  // Custom error handler that sends to Sentry
  app.use((err: Error, req: any, res: any, next: any) => {
    Sentry.captureException(err);
    logger.error('[Error]', { error: err.message, stack: err.stack });
    next(err);
  });

  logger.info('[Sentry] Error handler registered');
}

// Export Sentry for manual error reporting
export { Sentry };
