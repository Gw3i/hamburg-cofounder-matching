import * as Sentry from '@sentry/react';

/**
 * Sentry Frontend Error Tracking - November 2025 Best Practices
 * 
 * Features:
 * - Automatic error capture
 * - Performance monitoring
 * - User session tracking
 * - React component error boundaries
 */

export function setupSentry() {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  const isProduction = import.meta.env.PROD;

  // Only initialize Sentry if DSN is provided
  if (!sentryDsn) {
    console.warn('[Sentry] VITE_SENTRY_DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    
    // Performance Monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0, // 10% in prod, 100% in dev
    
    // Only send errors in production
    enabled: isProduction,
    
    // React-specific integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  });

  console.log('[Sentry] Frontend error tracking initialized', {
    environment: import.meta.env.MODE,
    enabled: isProduction,
  });
}

// Export Sentry for manual error reporting
export { Sentry };
