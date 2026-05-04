# Security

## Reporting a vulnerability

If you find a security issue in this repository, please email the maintainer at the address listed on the GitHub profile rather than opening a public issue. Include:

- A description of the issue
- Steps to reproduce
- The version / commit you tested against

You can expect an acknowledgement within a few days.

## Threat model and current posture

This is a small portfolio CRUD API. It is not designed for multi-tenant production traffic.

Hardening already in place (see [`docs/SECURITY_AUDIT.md`](./docs/SECURITY_AUDIT.md)):

- Parameterized ORM (Sequelize) — no raw SQL string building
- Allowlist input validation on every write
- Write-key auth (`x-api-key`) with constant-time compare
- JSON body size and parameter limits
- `x-powered-by` disabled, baseline security headers, generic error responses

## Known limitations

- Single shared write API key — not per-user authentication
- No rate limiting yet (see "Future Improvements" in README)
- `npm audit` flags `uuid <14` transitively via Sequelize 6; the vulnerable code path is not exercised by Sequelize. Tracking upstream Sequelize 7.

## Operational guidance

- Generate `WRITE_API_KEY` with high entropy (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Never reuse local DB credentials in production
- Rotate the write key on any suspected exposure
- Use a least-privilege MySQL user — do not run the app as `root`
