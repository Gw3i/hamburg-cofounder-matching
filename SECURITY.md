# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported |
| ------- | --------- |
| 1.x.x   | ✅        |
| < 1.0   | ❌        |

## Reporting a Vulnerability

The Hamburg Cofounder Platform team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report

To report a security vulnerability, please follow these steps:

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email your findings to `security@hamburgcofounders.com`
3. Include the following information:
   - Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the vulnerability, including how an attacker might exploit it
   - Any potential mitigations you've identified

### What to Expect

- **Initial Response**: Within 48 hours, we will acknowledge receipt of your report
- **Assessment**: Within 5 business days, we will:
  - Confirm the vulnerability
  - Assess its severity and impact
  - Provide an estimated timeline for a fix
- **Updates**: We will keep you informed about our progress
- **Fix Development**: We will develop and test a fix for the vulnerability
- **Disclosure**: Once the fix is released, we will:
  - Notify you before public disclosure
  - Credit you for the discovery (unless you prefer to remain anonymous)
  - Publish a security advisory

### Disclosure Policy

- We follow a coordinated disclosure model
- We request that you give us reasonable time to address the vulnerability before public disclosure
- We aim to resolve critical vulnerabilities within 30 days
- We will credit reporters who follow responsible disclosure practices

## Security Measures

### Current Security Features

Our platform implements multiple layers of security:

#### Authentication & Authorization

- JWT-based authentication via Supabase
- Row Level Security (RLS) policies for data access control
- Session management with secure token handling
- Protected API endpoints with role-based access

#### Data Protection

- All data transmission over HTTPS
- Environment variables for sensitive configuration
- No storage of sensitive data in code repositories
- Encrypted database connections

#### API Security

- Rate limiting to prevent abuse
- Input validation using Zod schemas
- CORS configuration for controlled access
- Security headers via Helmet.js

#### Code Security

- Regular dependency updates
- Automated security scanning in CI/CD
- Code reviews for all pull requests
- Static code analysis

### Best Practices for Contributors

When contributing to this project, please follow these security guidelines:

1. **Never commit sensitive data**
   - API keys, passwords, tokens must be in environment variables
   - Use `.env.example` for documentation

2. **Validate all inputs**
   - Use Zod schemas for type validation
   - Sanitize user inputs
   - Implement proper error handling

3. **Follow authentication patterns**
   - Use existing auth middleware
   - Never bypass RLS policies
   - Implement proper session management

4. **Review dependencies**
   - Check for known vulnerabilities
   - Keep dependencies up to date
   - Avoid unnecessary dependencies

5. **Write secure code**
   - Follow OWASP guidelines
   - Implement proper error handling
   - Avoid exposing sensitive information in errors

## Security Updates

Security updates will be released as:

- **Patches**: For non-breaking security fixes
- **Minor versions**: For security fixes that may include small breaking changes
- **Major versions**: For significant security overhauls

Subscribe to our security announcements by:

- Watching this repository
- Following our security advisory page
- Joining our mailing list (coming soon)

## Scope

### In Scope

The following are considered in scope for security reports:

- The main application (frontend and backend)
- Authentication and authorization mechanisms
- Data storage and transmission
- API endpoints and integrations
- Configuration and deployment scripts

### Out of Scope

The following are **not** considered security vulnerabilities:

- Clickjacking on pages with no sensitive actions
- Volumetric DDoS attacks
- Social engineering attacks
- Attacks requiring physical access to a user's device
- Outdated browser warnings
- Issues in third-party services we integrate with (report to them directly)

## Recognition

We maintain a hall of fame for security researchers who have responsibly disclosed vulnerabilities:

### Hall of Fame

_No vulnerabilities reported yet - be the first!_

---

## Contact

- Security Email: `security@hamburgcofounders.com`
- PGP Key: [Coming soon]
- Response time: Within 48 hours

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Supabase Security](https://supabase.com/security)

---

_Last updated: November 2025_

Thank you for helping keep the Hamburg Cofounder Platform and our users safe!
