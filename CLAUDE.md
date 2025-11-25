# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last updated**: November 25, 2025

## Workflow Guidelines

### Before Starting Work

- Always use plan mode to create a detailed implementation plan
- Research external dependencies or packages if needed (use Task tool)
- Think MVP - don't over-plan
- Ask for approval before starting implementation

### While Implementing

- Update plans as you work with detailed descriptions of changes made
- Never assume - always investigate thoroughly using available tools
- Keep code files focused and single-purpose
- All code must be efficiently commented using JSDoc style, focusing on "why" and "how"

## Project Overview

Hamburg Cofounder Platform - A web application for connecting startup founders in Hamburg. Built with React, Express, tRPC, and Supabase.

## Development Commands

### Core Commands

```bash
# Start development server (uses tsx watch for hot reload)
pnpm dev

# Type checking (no emit)
pnpm check

# Run tests (vitest)
pnpm test

# Format code with Prettier
pnpm format
```

### Building and Production

```bash
# Build both frontend (Vite) and backend (esbuild)
pnpm build

# Start production server
pnpm start
```

### Testing

- Tests are located in `server/**/*.test.ts`
- Test environment is Node (not jsdom)
- Test config: [vitest.config.ts](vitest.config.ts)
- Run single test file: `pnpm vitest run server/path/to/file.test.ts`

## Architecture

### Project Structure

```
client/           # React frontend (Vite)
  src/
    pages/        # Route components (Home, Dashboard, Profile, etc.)
    components/   # Reusable UI components
    contexts/     # React contexts (Theme, Auth)
    lib/          # Client utilities (trpc, supabase, utils)
    hooks/        # Custom React hooks
    _core/        # Core client functionality

server/           # Express backend
  _core/          # Core server infrastructure
    index.ts      # Server entry point
    trpc.ts       # tRPC setup (publicProcedure, protectedProcedure, adminProcedure)
    context.ts    # Request context with Supabase auth
    oauth.ts      # OAuth callback handling
    cookies.ts    # Cookie management
    security.ts   # Security middleware (CORS, Helmet, HTTPS)
    rateLimiting.ts # Rate limiting configuration
    sentry.ts     # Error tracking
    logger.ts     # Winston logging
  routers.ts      # tRPC router definitions (auth, profile)
  supabaseServer.ts # Supabase client and database operations

shared/           # Code shared between client and server
  types.ts        # Shared TypeScript types
  const.ts        # Shared constants
  _core/errors.ts # Error definitions
```

### Tech Stack

- **Frontend**: React 19, Wouter (routing), TanStack Query, Radix UI, Tailwind CSS
- **Backend**: Express, tRPC v11, Supabase (auth & database)
- **Build**: Vite (frontend), esbuild (backend), TypeScript
- **Testing**: Vitest
- **Styling**: Tailwind CSS v4, @tailwindcss/vite

### Key Architecture Patterns

#### Authentication Flow

1. Client authenticates with Supabase and obtains access token
2. Client sends access token in `Authorization: Bearer <token>` header
3. Server extracts token in [context.ts](server/_core/context.ts:16-49) and verifies with Supabase
4. tRPC procedures use `protectedProcedure` middleware to enforce auth
5. User context includes `{ id, email, accessToken }` from Supabase

#### Database Pattern (Supabase)

- Server uses Row Level Security (RLS) policies via `VITE_SUPABASE_ANON_KEY`
- For user-specific operations, creates authenticated client with `getSupabaseClientForUser(accessToken)`
- Profile operations in [routers.ts](server/routers.ts) enforce authorization checks
- No direct service role key usage - all operations respect RLS

#### tRPC Procedures

Three types defined in [trpc.ts](server/_core/trpc.ts):

- `publicProcedure`: No authentication required
- `protectedProcedure`: Requires authenticated user
- `adminProcedure`: Requires admin role (currently simplified)

#### Request/Response Flow

```
Client (React + TanStack Query)
  ↓ tRPC client with Supabase auth headers
Express Server
  ↓ tRPC middleware (createContext extracts Supabase user)
Router (appRouter in routers.ts)
  ↓ Procedure handlers
Supabase (via supabaseServer.ts)
```

#### Path Aliases

TypeScript path aliases configured in [tsconfig.json](tsconfig.json:18-21):

- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`

Vite aliases match in [vite.config.ts](vite.config.ts:14-19):

- `@` → `client/src`
- `@shared` → `shared`
- `@assets` → `attached_assets`

### Environment Variables

Required environment variables (validated on startup in [validateEnv.ts](server/_core/validateEnv.ts)):

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NODE_ENV` - development or production

Optional:

- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS
- `SENTRY_DSN` - Error tracking
- `LOG_LEVEL` - Logging verbosity

### Security Features

- Rate limiting on API routes ([rateLimiting.ts](server/_core/rateLimiting.ts))
- CORS, Helmet, HTTPS enforcement ([security.ts](server/_core/security.ts))
- 10MB body size limit
- Supabase RLS policies for data access control
- Authorization checks in tRPC procedures (users can only modify their own data)

### Development Server

- Port auto-discovery: tries PORT env var, then searches for available port starting from 3000
- Development mode: Vite dev server with HMR
- Production mode: Serves static files from `dist/public`
- Both modes proxy `/api/` requests to Express

## Development Rules & Standards

### Global Principles

- Use TypeScript strict mode - never suppress type errors without documentation
- **"Any" types are not allowed** - always provide explicit types
- Each code file should be single-purpose and focused
- Use async/await for asynchronous flows - avoid raw promises in business logic
- Use explicit return types for all functions
- Follow SOLID, DRY, and KISS principles
- Security is non-negotiable: validate and sanitize all inputs
- Remove dead code and unused dependencies regularly
- Favor simple, elegant, and robust solutions over complexity

### Backend-Specific Rules

#### Architecture

- Use modular, layered architecture with clear separation: API layer, business logic, data access
- Services should be stateless unless persistence is essential
- All authentication must follow best practices (Supabase JWT tokens)
- **NEVER use SUPABASE_SERVICE_KEY in application code** - Always use `VITE_SUPABASE_ANON_KEY` with RLS policies
- All environment configuration must be validated on startup ([validateEnv.ts](server/_core/validateEnv.ts))

#### API Design

- All tRPC procedures must use appropriate middleware (`publicProcedure`, `protectedProcedure`)
- Use Zod schemas for input validation
- Error responses must be meaningful and consistent
- Follow REST principles for OAuth routes

#### Performance

- Design for minimal latency - use streaming and pagination for large datasets
- Leverage caching where safe (TanStack Query on client)
- Avoid synchronous operations in request paths
- Use non-blocking I/O

### Frontend-Specific Rules

#### Architecture

- Organize by feature where practical
- State management: React hooks, TanStack Query, or context - avoid global mutable state
- TypeScript must be strict - type everything, especially API calls and props
- All third-party integrations must be isolated in providers/contexts
- Authentication must use Supabase's secure primitives - never handle raw JWTs in UI

#### Code Style

- File naming: kebab-case for files, PascalCase for components, camelCase for variables/functions
- Keep components small and focused - prefer composition over inheritance
- Use explicit imports/exports
- Prefer function components with hooks
- Use Tailwind utility classes - avoid inline styles unless necessary
- Use TanStack Query for all remote data fetching

#### UI/UX

- UI must be accessible - use semantic HTML, ARIA attributes, keyboard navigation
- Use shadcn/ui components for accessible UI primitives (in `client/src/components/ui/`)
- Prioritize responsive design - mobile, tablet, desktop
- Support theme switching via `ThemeProvider`
- Use Lucide icons for consistent iconography
- Use clear error states, loading indicators, and optimistic UI

#### Performance

- Code-split pages using React.lazy/Suspense where appropriate
- Avoid unnecessary re-renders - use `React.memo`, `useMemo`, `useCallback` wisely
- Optimize assets (images, fonts) for minimal load time
- Handle network errors gracefully

## Important Notes

### Authorization Pattern

Profile mutations enforce that `input.supabaseId === ctx.user.id` - users can only modify their own profiles. This is implemented at the procedure level in [routers.ts](server/routers.ts:54-61).

### Supabase Client Pattern

- Public reads: Use `getSupabaseClient()` (respects RLS)
- Authenticated writes: Use `getSupabaseClientForUser(accessToken)` to act as the user
- Never bypass RLS - all operations go through anon key with proper auth headers

### Test Writing

- Tests should be in `server/**/*.test.ts`
- Import shared types from `@shared/*`
- Use vitest's built-in assertions and mocking
- See examples: [auth.logout.test.ts](server/auth.logout.test.ts), [pagination.test.ts](server/pagination.test.ts)

### UI Components

- Using shadcn/ui components in `client/src/components/ui/`
- Component config: [components.json](components.json)
- Theme managed via `ThemeProvider` context
- Toast notifications via Sonner

## Testing Status

Currently, tests are located in `server/**/*.test.ts` with limited coverage. When adding new features:

- Write tests for all new server-side business logic
- Use Vitest's built-in assertions and mocking
- Keep tests focused on behavior, not implementation
- See examples: [auth.logout.test.ts](server/auth.logout.test.ts), [pagination.test.ts](server/pagination.test.ts)
