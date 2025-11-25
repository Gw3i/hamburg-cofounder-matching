# Hamburg Cofounder Platform

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Development](#development)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## About

The Hamburg Cofounder Platform helps entrepreneurs and startup founders in Hamburg find potential co-founders, collaborate on projects, and build successful ventures together. This platform provides a space for networking, skill matching, and community building within Hamburg's startup ecosystem.

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI framework
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Radix UI** - Accessible UI primitives
- **Tailwind CSS v4** - Utility-first styling
- **Vite** - Build tool and dev server

### Backend

- **Express** - Node.js web framework
- **tRPC v11** - End-to-end typesafe APIs
- **Supabase** - Authentication and database
- **TypeScript** - Type safety across the stack

### Infrastructure

- **pnpm** - Fast, disk space efficient package manager
- **Vitest** - Unit testing framework
- **esbuild** - JavaScript bundler for backend
- **Winston** - Logging
- **Sentry** - Error tracking

## 🚀 Quick Start

### Prerequisites

> [!NOTE]
> Ensure you have these tools installed before proceeding with the setup.

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm 8+** - Install with `npm install -g pnpm`
- **Supabase Account** - Free tier available at [supabase.com](https://supabase.com)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/[your-username]/hamburg-cofounder-platform.git
cd hamburg-cofounder-platform
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

5. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000` (or the next available port).

> [!TIP]
> The development server includes hot module replacement for instant feedback on changes.

## 💻 Development

### Available Scripts

```bash
# Start development server with hot reload
pnpm dev

# Run type checking
pnpm check

# Run tests
pnpm test

# Format code with Prettier
pnpm format

# Build for production
pnpm build

# Start production server
pnpm start
```

### Project Structure

```
├── client/           # React frontend
│   └── src/
│       ├── pages/    # Route components
│       ├── components/ # Reusable UI components
│       ├── contexts/ # React contexts (Theme, Auth)
│       ├── lib/      # Client utilities
│       ├── hooks/    # Custom React hooks
│       └── _core/    # Core client functionality
│
├── server/           # Express backend
│   ├── _core/        # Core server infrastructure
│   ├── routers.ts    # tRPC router definitions
│   └── supabaseServer.ts # Database operations
│
├── shared/           # Shared code between client and server
│   ├── types.ts      # TypeScript types
│   └── const.ts      # Constants
│
└── attached_assets/  # Static assets
```

## 🤝 Contributing

We welcome contributions from the community! Please read our contribution guidelines before submitting pull requests.

> [!TIP]
> New to contributing? Check out issues labeled `good first issue` for a great starting point!

### How to Contribute

#### 1. Fork and Clone

Fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/[your-username]/hamburg-cofounder-platform.git
cd hamburg-cofounder-platform
git remote add upstream https://github.com/[original-owner]/hamburg-cofounder-platform.git
```

#### 2. Create a Branch

Create a feature branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:

- `feature/add-user-search` - New features
- `fix/profile-update-bug` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/improve-auth-flow` - Code refactoring

#### 3. Make Your Changes

Follow these guidelines while developing:

##### Code Standards

- **TypeScript**: Use strict mode, no `any` types
- **Components**: Keep them small and focused
- **Files**: Single-purpose, well-organized
- **Naming**:
  - Files: `kebab-case.ts`
  - Components: `PascalCase.tsx`
  - Functions/variables: `camelCase`
- **Comments**: Use JSDoc style, explain "why" and "how"

##### Before Committing

1. **Type Check**: Ensure no TypeScript errors

   ```bash
   pnpm check
   ```

2. **Format Code**: Run Prettier

   ```bash
   pnpm format
   ```

3. **Test**: Run existing tests

   ```bash
   pnpm test
   ```

4. **Test Locally**: Start dev server and test your changes
   ```bash
   pnpm dev
   ```

##### Security Considerations

> [!WARNING]
> Never commit sensitive data like API keys, passwords, or tokens. These should only be in environment variables.

- Validate and sanitize all user inputs
- Use Supabase RLS policies for data access
- Never use `SUPABASE_SERVICE_KEY` in client code
- Follow OWASP security best practices

#### 4. Write Tests

For new features or bug fixes, include tests:

- Place tests in `server/**/*.test.ts`
- Use Vitest for testing
- Focus on behavior, not implementation
- See existing tests for examples

#### 5. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add user search functionality

- Implement search API endpoint
- Add search UI component
- Include pagination support"
```

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

#### 6. Push and Create Pull Request

Push your branch and create a pull request:

```bash
git push origin feature/your-feature-name
```

In your pull request:

- Provide a clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- List any breaking changes
- Ensure all CI checks pass

### Development Workflow

1. **Plan First**: For complex features, create an issue to discuss the approach
2. **MVP Mindset**: Start with the simplest working solution
3. **Iterate**: Improve based on feedback
4. **Document**: Update documentation if needed
5. **Test**: Ensure your changes don't break existing functionality

### Code Review Process

All contributions go through code review:

1. **Automated Checks**: TypeScript, tests, and formatting must pass
2. **Manual Review**: Maintainers review for:
   - Code quality and standards compliance
   - Security considerations
   - Performance implications
   - Architecture consistency
3. **Feedback**: Address any requested changes
4. **Merge**: Once approved, your PR will be merged

### Reporting Issues

Found a bug or have a feature request?

1. **Search First**: Check if the issue already exists
2. **Create Issue**: Use our issue templates
3. **Be Specific**: Include:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

### Getting Help

- **Documentation**: Check [CLAUDE.md](CLAUDE.md) for detailed architecture info
- **Issues**: Browse existing issues for solutions
- **Discussions**: Start a discussion for questions

### Areas for Contribution

Looking for ways to help? Consider:

- **Features**: Check issues labeled `good first issue` or `help wanted`
- **Documentation**: Improve README, add JSDoc comments, create guides
- **Tests**: Increase test coverage
- **Bug Fixes**: Help squash bugs
- **UI/UX**: Improve accessibility, responsive design
- **Performance**: Optimize slow operations
- **Internationalization**: Help translate the platform

## 🔧 Environment Variables

Required environment variables:

| Variable                 | Description                          | Required |
| ------------------------ | ------------------------------------ | -------- |
| `VITE_SUPABASE_URL`      | Supabase project URL                 | Yes      |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key               | Yes      |
| `NODE_ENV`               | Environment (development/production) | Yes      |
| `PORT`                   | Server port (default: 3000)          | No       |
| `FRONTEND_URL`           | Frontend URL for CORS                | No       |

## 🔒 Security

> [!IMPORTANT]
> Security is our top priority. Please report vulnerabilities responsibly.

### Security Features

- **Authentication**: Supabase JWT tokens with secure session management
- **Authorization**: Row Level Security (RLS) policies for fine-grained data access
- **Rate Limiting**: Configurable limits on API endpoints to prevent abuse
- **Headers Security**: CORS, Helmet, and HTTPS enforcement
- **Input Validation**: Zod schemas for all API inputs
- **Access Control**: Authorization checks at the tRPC procedure level

### Reporting Security Issues

Found a security vulnerability? Please report it responsibly:

1. **DO NOT** open a public issue
2. Email security concerns to the owner
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We'll respond within 48 hours and work with you to resolve the issue.

See our [SECURITY.md](SECURITY.md) for full details.

## 🧪 Testing

Run tests with:

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage report
```

Tests are located in `server/**/*.test.ts` using Vitest.

## 📦 Building for Production

```bash
# Build both frontend and backend
pnpm build

# Start production server
pnpm start
```

The production build:

- Optimizes React bundle with Vite
- Compiles TypeScript with esbuild
- Serves static files from `dist/public`
- Runs Express server for API routes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

Thanks to all our amazing contributors!
