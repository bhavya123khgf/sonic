# Sonic Blue-Green Deployment Architecture & Security Manual

## 1. Overview
Sonic uses an enterprise-grade **Blue-Green Deployment** strategy to deliver continuous updates with zero downtime and instant rollback capabilities.

### Cluster Topology
- **Blue Environment**: Active cluster listening on `http://127.0.0.1:3001`
- **Green Environment**: Standby cluster listening on `http://127.0.0.1:3002`
- **Reverse Proxy**: Nginx or Cloud Load Balancer directing production traffic (`https://sonic.audio`) to the active slot upstream.

---

## 2. Zero-Downtime Deployment Lifecycle

```
[ Git Push / Release Tag ]
           │
           ▼
[ Build Next.js Production Bundle on Standby Slot ]
           │
           ▼
[ Start Standby Target (e.g. Green on Port 3002) ]
           │
           ▼
[ Health Check Probe: GET /api/health (15 retries) ]
    ├── Fails ──> Rollback: Target killed. Blue remains 100% active.
    └── Passes ─> Continue
           │
           ▼
[ Verify 20 Security Checks: GET /api/security-audit ]
           │
           ▼
[ Atomic Nginx Upstream Reload (nginx -s reload) ]
           │
           ▼
[ Connection Drain on Previous Slot (5s wait) ]
           │
           ▼
[ Old Slot transitioned to Standby / Suspended ]
```

---

## 3. 20 Essential Website Security Checks Validation

Sonic implements comprehensive defenses matching the industry-standard 20 security checks:

| # | Check | Sonic Implementation | Status |
|---|-------|----------------------|--------|
| **1** | **Hide API Keys** | Kept in server-only `lib/env.ts`, zero client leaks. | Verified |
| **2** | **Check Env Variables** | Runtime schema validation in `lib/env.ts` with dev fallbacks. | Verified |
| **3** | **Check Keys in Git** | `.gitignore` covers `.env*`, `*.pem`, keys, build outputs. | Verified |
| **4** | **Protect Admin Routes** | Role-Based Access Control on `/admin` and `/api/admin`. | Verified |
| **5** | **Add Auth** | Session verification, sign-in/up endpoints, secure passwords. | Verified |
| **6** | **Check User Perms (IDOR/BOLA)** | Object-level authorization checks: users only modify own playlists. | Verified |
| **7** | **Sanitize User Inputs** | `sanitizeInput()` strips HTML tags, escapes strings, constrains bounds. | Verified |
| **8** | **Protect Against XSS** | React contextual JSX escaping + CSP `script-src` policies. | Verified |
| **9** | **SQL Injection Protect** | Parameterized query abstractions & regex payload protection. | Verified |
| **10** | **Check DB Rules** | Strict TypeScript interfaces & schema integrity validators. | Verified |
| **11** | **Add Rate Limiting** | Sliding-window limiter on search, audio convert, and auth routes. | Verified |
| **12** | **Set Spend Cap** | `MAX_AUDIO_CONVERSION_SECONDS=600` prevents denial-of-wallet. | Verified |
| **13** | **Secure File Uploads** | 2MB size cap, MIME-type whitelist (JPEG, PNG, WebP). | Verified |
| **14** | **CSRF Protection** | `SameSite=Strict` cookies, `X-Requested-With` header verification. | Verified |
| **15** | **Check CORS Settings** | Strict origin validation, restricted HTTP verbs (GET, POST, PUT, DELETE). | Verified |
| **16** | **Enable HTTPS (HSTS)** | `Strict-Transport-Security: max-age=63072000; preload`. | Verified |
| **17** | **Add Security Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`. | Verified |
| **18** | **Secure Cookies** | Cookies flagged `HttpOnly; Secure; SameSite=Strict`. | Verified |
| **19** | **Disable Debug Mode** | Production stack traces suppressed via `sanitizeError()`. | Verified |
| **20** | **Check Prod Settings** | Zero-downtime Blue-Green script, Turbopack optimizations verified. | Verified |

---

## 4. Execution Commands
```bash
# Test health check locally
curl http://localhost:3000/api/health

# Run Blue-Green update script
bash deploy/blue-green.sh
```
