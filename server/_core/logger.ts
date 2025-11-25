import winston from 'winston';

/**
 * Structured Logging Configuration - November 2025 Best Practices
 * 
 * Features:
 * - JSON format for production (machine-readable)
 * - Pretty format for development (human-readable)
 * - Log levels: error, warn, info, debug
 * - Automatic timestamp inclusion
 */

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  isProduction
    ? winston.format.json() // JSON format for production
    : winston.format.combine( // Pretty format for development
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let metaStr = '';
          if (Object.keys(meta).length > 0) {
            metaStr = '\n' + JSON.stringify(meta, null, 2);
          }
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      )
);

// Create logger instance
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // Console output
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

// Log startup info
logger.info('[Logger] Structured logging initialized', {
  environment: process.env.NODE_ENV,
  logLevel,
  format: isProduction ? 'json' : 'pretty',
});

// Export convenience methods
export const log = {
  error: (message: string, meta?: object) => logger.error(message, meta),
  warn: (message: string, meta?: object) => logger.warn(message, meta),
  info: (message: string, meta?: object) => logger.info(message, meta),
  debug: (message: string, meta?: object) => logger.debug(message, meta),
};
