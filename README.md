# Konstellation waitlist

Pre-launch waitlist for Konstellation (EVM-compatible L1 on the Cosmos SDK, chain ID 5667, token KASH).

- `api/` — NestJS 11 + Prisma 7 (Postgres) + Mailgun + Cloudflare Turnstile
- `web/` — Next.js 16 App Router + Tailwind v4

The mechanic: sign up with an email, and the same screen immediately shows an optional 3-question survey. Completing it puts the signup in the priority pool. Skipping keeps the spot.

Priority tiers: `0` unverified · `1` email verified · `2` verified + survey · `3` manually flagged.
Access waves draw `ORDER BY priority_tier DESC, created_at ASC`.

---

## Environment variables

### `api/.env`

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (`postgresql://user:pass@host:5432/db`) |
| `JWT_SECRET` | Signs the 30-minute survey tokens and keys the IP hash. 32+ random bytes, hex. |
| `ADMIN_KEY` | Value of the `x-admin-key` header for `GET /admin/queue`. 32+ random bytes, hex. |
| `MAILGUN_API_KEY` | Mailgun private API key |
| `MAILGUN_DOMAIN` | Verified Mailgun sending domain, e.g. `mg.example.com` |
| `MAILGUN_API_URL` | `https://api.mailgun.net` (US) or `https://api.eu.mailgun.net` (EU) |
| `EMAIL_FROM` | Sender on that domain, e.g. `Konstellation <noreply@mg.example.com>` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |
| `APP_URL` | Public URL of the web app, no trailing slash. Used in verify redirects. |
| `API_URL` | Public URL of this API, no trailing slash. Used in the verification email link. |
| `CORS_ORIGINS` | Comma-separated allowed origins, e.g. `http://localhost:3000,https://waitlist.example.com` |
| `PORT` | Port to listen on (default 4000) |

Generate secrets: `openssl rand -hex 32`

### `web/.env.local`

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Public URL of the API, no trailing slash |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |

**Turnstile test keys** (always pass, for local dev only):
site key `1x00000000000000000000AA`, secret key `1x0000000000000000000000000000000AA`.

---

## Running locally

You need Postgres reachable at `DATABASE_URL`.

### 1. Push the schema (once, and after any schema change)

```
cd api
npx drizzle-kit push
```

### 2. Start the API

```
cd api
npm run start:dev
```

Listens on `http://localhost:4000` (from `PORT`).

### 3. Start the web app

```
cd web
npm run dev
```

Open `http://localhost:3000`.

---

## API

All responses are JSON unless noted.

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `POST` | `/waitlist/join` | Turnstile token in body | `{ email, turnstileToken, utm? }` → `{ ok, surveyCompleted, surveyToken }`. Same shape for new and existing emails. 5 signups / IP / hour. |
| `POST` | `/waitlist/survey` | `Authorization: Bearer <surveyToken>` | `{ intent, chainsUsed, firstThing? }` → `{ ok: true }`. 401 if the token is bad or older than 30 min. |
| `GET` | `/waitlist/verify?token=` | — | 302 to `APP_URL/welcome`, `APP_URL/?verify=expired` or `APP_URL/?verify=invalid` |
| `GET` | `/waitlist/stats` | — | `{ verified: number }` |
| `GET` | `/admin/queue?limit=200&offset=0` | `x-admin-key` header | Queue in wave order plus per-tier counts and intent breakdown |

### curl walkthrough

```
# join (Turnstile test secret must be in api/.env for the dummy token to pass)
curl -s -X POST http://localhost:4000/waitlist/join \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","turnstileToken":"XXXX.DUMMY.TOKEN.XXXX","utm":{"utm_source":"curl"}}'

# survey — paste surveyToken from the previous response
curl -s -X POST http://localhost:4000/waitlist/survey \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer <surveyToken>' \
  -d '{"intent":"building","chainsUsed":["Ethereum","Base"],"firstThing":"Deploy a contract"}'

# verify — copy the link out of the email (or the verify_token column)
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  'http://localhost:4000/waitlist/verify?token=<verifyToken>'

# stats
curl -s http://localhost:4000/waitlist/stats

# admin queue
curl -s http://localhost:4000/admin/queue -H "x-admin-key: $ADMIN_KEY"
```

To flag someone manually: `UPDATE signups SET priority_tier = 3 WHERE email = '...';` — tier 3 is never downgraded by the verify or survey handlers.

---

## Editing copy

- Web: `web/src/constants/copy.ts` — every string on the site, including the FAQ. The token FAQ answer is `TODO_TOKEN_POLICY`.
- API: `api/src/constants/copy.ts` — error messages and both plain-text emails.
- Disposable domain blocklist: `api/src/constants/disposable-domains.ts`.

---

## Deploying

### Database
Any Postgres (Neon, Supabase, RDS, Fly Postgres). Set `DATABASE_URL`, then from `api/` run `npx drizzle-kit push` against it.

### API (Railway / Fly / Render / any Node host)
1. Build command: `npm ci && npm run build` (in `api/`)
2. Start command: `npm run start:prod` (runs `node dist/main`)
3. Set every var from the `api/.env` table. `APP_URL` = the web app's public URL, `API_URL` = this service's public URL, `CORS_ORIGINS` = the web app's origin.
4. The API reads the client IP from the first `x-forwarded-for` entry, so it must sit behind a proxy that sets it (all the hosts above do). Country comes from `cf-ipcountry`, `x-vercel-ip-country` or `fly-client-country` if present.

### Web (Vercel or any Next host)
1. Root directory: `web`
2. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
3. Deploy. The home page is static and revalidates the stats count every 60 s.

### Third-party setup
- **Mailgun**: add and verify a sending domain, set `MAILGUN_DOMAIN` to it and `EMAIL_FROM` to an address on it. Pick `MAILGUN_API_URL` by the domain's region.
- **Turnstile**: create a widget for the production hostname (and `localhost` for dev). Site key → web, secret key → API.

---

## Notes

- Survey tokens are held in React state only; nothing is written to cookies or storage.
- `POST /waitlist/join` returns the same shape for new and existing addresses. The only value that differs is `surveyCompleted`, which the client needs to skip the survey for a returning user.
- `api/prisma/`, `api/prisma7.config.ts`, `api/skills-lock.json` and `api/.agents|.claude|.windsurf/skills` are leftovers from an earlier Prisma scaffold. They are excluded from the build and safe to delete.
