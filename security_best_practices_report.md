# Security Best Practices Report

## Executive Summary

This Express/Sequelize API needs production hardening before being exposed to untrusted users. The most important issues are missing authentication/authorization on write routes, direct request-body-to-ORM mutations, outdated runtime dependencies, and missing explicit parser/security middleware configuration.

## High Severity

### BP-1: State-Changing Routes Have No Authentication Or Authorization

Impact: Any reachable caller can alter or delete catalog records.

- Locations:
  - `routes/api/product-routes.js:64`, `routes/api/product-routes.js:96`, `routes/api/product-routes.js:137`
  - `routes/api/category-routes.js:53`, `routes/api/category-routes.js:65`, `routes/api/category-routes.js:85`
  - `routes/api/tag-routes.js:53`, `routes/api/tag-routes.js:65`, `routes/api/tag-routes.js:85`
- Guidance: Production write APIs should authenticate users and authorize privileged actions.
- Fix: Add auth middleware before POST/PUT/DELETE routes and restrict writes to trusted roles.

## Medium Severity

### BP-2: Request Bodies Are Passed Directly To ORM Mutations

- Locations:
  - `routes/api/product-routes.js:73`, `routes/api/product-routes.js:98`
  - `routes/api/category-routes.js:67`
  - `routes/api/tag-routes.js:67`
- Guidance: Validate and allowlist request fields before using untrusted input in database operations.
- Fix: Add request schemas, normalize IDs/numbers, and build explicit mutation objects.

### BP-3: Runtime Dependencies Are Outdated And Have Current Advisories

- Locations: `package.json:13-15`
- Evidence: `npm audit --omit=dev --json` reported production advisories for Express/transitive parser packages, MySQL2, and Sequelize.
- Fix: Upgrade dependencies in a tested branch. Expect semver-major work for Sequelize and MySQL2.

### BP-4: Global Body Parsers Need Explicit Limits

- Locations: `server.js:9-10`
- Guidance: Express parsers should have explicit size and complexity limits.
- Fix: Configure conservative `limit` and `parameterLimit` values and only enable parsers needed by the API.

## Low Severity

### BP-5: Missing Express Production Security Baseline

- Locations: `server.js:6-12`
- Guidance: Disable fingerprinting, add production-safe error handling, and use Helmet/security headers where appropriate.
- Fix: Add `app.disable('x-powered-by')`, centralized error middleware, and `helmet()`.

### BP-6: Local `.env` Contains Database Credentials

- Locations: `.env:1-3`, `.gitignore:4`
- Evidence: `.env` is ignored and not tracked, so this is not a committed-secret finding.
- Fix: Keep `.env` local-only, rotate the database password if this workspace was shared, and use a secret manager for production.

## Notes

No first-party raw SQL string building, command execution, file-serving, upload, SSRF, redirect, or template sink was found.
