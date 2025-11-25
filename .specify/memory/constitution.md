# Hamburg Cofounder Platform Constitution

<!--
Sync Impact Report - Constitution v1.0.0

Version Change: Initial Constitution (v1.0.0)

Sections Created:
- Core Principles (7 principles established)
- Security Requirements
- Development Workflow
- Governance

Templates Alignment Status:
✅ plan-template.md - Constitution Check section ready for validation
✅ spec-template.md - Requirement structure aligns with principles
✅ tasks-template.md - Task organization reflects testing and modular design principles

Follow-up Items:
- None - all placeholders filled

Rationale: Initial constitution establishment based on comprehensive CLAUDE.md guidance file.
This constitution formalizes the development practices and non-negotiable principles
already established in the project documentation.
-->

## Core Principles

### I. TypeScript Strict Mode (NON-NEGOTIABLE)

TypeScript MUST be used in strict mode with explicit typing for all code. "Any" types are prohibited unless explicitly documented with strong justification. All functions MUST have explicit return types.

**Rationale**: Type safety prevents runtime errors, improves code maintainability, and enables better refactoring. The prohibition of "any" types ensures type safety is not circumvented.

### II. Single Responsibility & Modularity

Each code file MUST be single-purpose and focused. Components MUST be small and favor composition over inheritance. Services MUST be stateless unless persistence is essential.

**Rationale**: Modular, focused code is easier to test, maintain, and understand. Single-responsibility principle reduces coupling and increases cohesion, making the codebase more maintainable and scalable.

### III. Security First

Security is non-negotiable. All inputs MUST be validated and sanitized. Authentication MUST use Supabase JWT tokens. Row Level Security (RLS) MUST be enforced via `VITE_SUPABASE_ANON_KEY`. Service role keys (`SUPABASE_SERVICE_KEY`) MUST NEVER be used in application code. All tRPC procedures MUST use appropriate middleware (`publicProcedure`, `protectedProcedure`, `adminProcedure`).

**Rationale**: Security vulnerabilities can compromise user data and system integrity. RLS-first approach ensures data access is controlled at the database level, preventing authorization bypass vulnerabilities.

### IV. Testing Discipline

Tests MUST be written for all new server-side business logic. Tests MUST be located in `server/**/*.test.ts` and use Vitest. Tests MUST focus on behavior, not implementation. Tests MUST be run before commits affecting tested code.

**Rationale**: Comprehensive testing catches regressions early, documents expected behavior, and enables confident refactoring. Behavior-focused tests remain valid through implementation changes.

### V. Architecture Separation

Frontend and backend MUST maintain clear separation with defined interfaces. Frontend uses React 19 with functional components and hooks. Backend uses Express with tRPC v11 for type-safe APIs. Shared code MUST reside in `shared/` directory and use `@shared/*` imports.

**Rationale**: Clear architectural boundaries enable independent evolution of client and server, support parallel development, and enforce proper concern separation. Type-safe APIs via tRPC eliminate entire classes of integration bugs.

### VI. Accessibility & User Experience

UI MUST be accessible using semantic HTML, ARIA attributes, and keyboard navigation. UI MUST use shadcn/ui components for accessible primitives. Design MUST be responsive (mobile, tablet, desktop). Error states, loading indicators, and optimistic UI MUST be implemented.

**Rationale**: Accessibility is a fundamental user right, not a feature. Responsive design ensures usability across devices. Clear feedback (errors, loading) improves user experience and reduces confusion.

### VII. Performance & Efficiency

Design MUST target minimal latency using streaming and pagination for large datasets. Asynchronous flows MUST use async/await (avoid raw promises in business logic). Non-blocking I/O MUST be used in request paths. Frontend MUST avoid unnecessary re-renders using React optimization patterns.

**Rationale**: Performance directly impacts user satisfaction and system scalability. Async/await improves code readability while maintaining non-blocking behavior. React optimizations prevent performance degradation as the application grows.

## Security Requirements

### Authentication & Authorization

- Client authentication via Supabase with access tokens
- Access tokens sent via `Authorization: Bearer <token>` header
- Server extracts and verifies tokens in `context.ts`
- User context includes `{ id, email, accessToken }`
- Authorization checks at procedure level (users can only modify their own data)
- Profile mutations MUST enforce `input.supabaseId === ctx.user.id`

### Infrastructure Security

- Rate limiting on all API routes (configured in `rateLimiting.ts`)
- CORS, Helmet, HTTPS enforcement (configured in `security.ts`)
- 10MB body size limit
- Environment variables MUST be validated on startup (`validateEnv.ts`)
- Supabase RLS policies for all data access control

### Prohibited Patterns

- Using service role keys in application code
- Bypassing RLS policies
- Handling raw JWTs in UI components
- Suppressing type errors without documentation
- Inline styles (use Tailwind utilities)
- Synchronous operations in request paths

## Development Workflow

### Before Starting Work

1. MUST use plan mode to create detailed implementation plan
2. MUST research external dependencies if needed
3. MUST think MVP - avoid over-planning
4. MUST ask for approval before starting implementation

### While Implementing

1. MUST update plans with detailed descriptions of changes
2. MUST investigate thoroughly using available tools - never assume
3. MUST keep code files focused and single-purpose
4. MUST comment all code efficiently using JSDoc style, focusing on "why" and "how"
5. MUST follow SOLID, DRY, and KISS principles
6. MUST remove dead code and unused dependencies

### Code Standards

- **File naming**: kebab-case for files, PascalCase for components, camelCase for variables/functions
- **Imports**: Use path aliases (`@/*` for client, `@shared/*` for shared code)
- **Components**: Function components with hooks (React)
- **Styling**: Tailwind utility classes (avoid inline styles)
- **Data fetching**: TanStack Query for all remote data
- **Validation**: Zod schemas for all tRPC input validation
- **Logging**: Winston logger for server-side logging

### Testing Requirements

- Tests in `server/**/*.test.ts`
- Node test environment (not jsdom)
- Import shared types from `@shared/*`
- Use Vitest built-in assertions and mocking
- Keep tests focused on behavior
- Run tests: `pnpm test` or `pnpm vitest run server/path/to/file.test.ts`

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines. When conflicts arise between this constitution and other documentation, the constitution takes precedence.

### Amendment Process

1. Amendments MUST be proposed with clear rationale
2. Amendments MUST document impact on existing code
3. Amendments MUST include migration plan if breaking changes introduced
4. Version MUST be incremented according to semantic versioning:
   - **MAJOR**: Backward incompatible governance/principle removals or redefinitions
   - **MINOR**: New principle/section added or materially expanded guidance
   - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review

1. All PRs and code reviews MUST verify compliance with constitutional principles
2. Complexity MUST be justified against Principle VII (Performance & Efficiency) and Principle II (Single Responsibility)
3. Security violations (Principle III) MUST block merging
4. Type safety violations (Principle I) MUST block merging
5. Use `CLAUDE.md` for runtime development guidance and command reference

### Version Control

All constitution changes MUST be:

- Tracked in this file's Sync Impact Report (HTML comment at top)
- Propagated to dependent templates (`plan-template.md`, `spec-template.md`, `tasks-template.md`)
- Communicated to all team members
- Committed with descriptive message (e.g., `docs: amend constitution to vX.Y.Z (description)`)

**Version**: 1.0.0 | **Ratified**: 2025-11-25 | **Last Amended**: 2025-11-25
