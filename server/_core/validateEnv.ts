/**
 * Environment Variable Validation - November 2025 Best Practices
 * 
 * Validates required environment variables on server startup
 * Prevents silent failures due to misconfiguration
 */

interface EnvConfig {
  name: string;
  required: boolean;
  description: string;
}

const ENV_VARS: EnvConfig[] = [
  // Supabase Configuration (Required)
  {
    name: 'VITE_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key',
  },
  
  // Server Configuration (Required)
  {
    name: 'NODE_ENV',
    required: true,
    description: 'Environment (development, production)',
  },
  
  // Optional Configuration
  {
    name: 'PORT',
    required: false,
    description: 'Server port (default: 3000)',
  },
  {
    name: 'FRONTEND_URL',
    required: false,
    description: 'Frontend URL for CORS (default: http://localhost:3000)',
  },
  {
    name: 'SENTRY_DSN',
    required: false,
    description: 'Sentry DSN for error tracking',
  },
  {
    name: 'LOG_LEVEL',
    required: false,
    description: 'Logging level (error, warn, info, debug)',
  },
];

export function validateEnvironment(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  console.log('[Environment] Validating environment variables...');

  for (const config of ENV_VARS) {
    const value = process.env[config.name];

    if (config.required && !value) {
      missing.push(`${config.name} - ${config.description}`);
    } else if (!config.required && !value) {
      warnings.push(`${config.name} - ${config.description}`);
    } else {
      // Mask sensitive values in logs
      const displayValue = config.name.includes('KEY') || config.name.includes('SECRET') || config.name.includes('DSN')
        ? '***REDACTED***'
        : value;
      console.log(`[Environment] ✓ ${config.name}: ${displayValue}`);
    }
  }

  // Report warnings
  if (warnings.length > 0) {
    console.warn('[Environment] Optional environment variables not set:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  // Fail if required variables are missing
  if (missing.length > 0) {
    console.error('[Environment] ❌ Missing required environment variables:');
    missing.forEach(msg => console.error(`  - ${msg}`));
    console.error('\n[Environment] Please set these variables in your .env file or environment');
    process.exit(1);
  }

  console.log('[Environment] ✓ All required environment variables are set');
}
