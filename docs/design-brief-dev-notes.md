# Design brief — engineering appendix

Companion to `design-brief.md`. Maps the designer-facing language to the code so mockups can be wired up 1:1. Not for the designer.

## Copy keys (`web/src/constants/copy.ts`)

| Brief section | Constant |
| --- | --- |
| 6.1 Top of page | `SITE`, `HERO` |
| 6.2 The form | `FORM`, `STATS` |
| 6.3 Three questions | `SURVEY` (`q1`, `q2`, `q3`, `submit`, `skip`, `errors`) |
| 6.4 Done | `DONE` (`withSurvey` / `withoutSurvey`) |
| 6.5 Bottom form | `SECONDARY_FORM` |
| 6.6 Bad-link notice | `VERIFY_NOTICE` (`expired` / `invalid`) |
| 6.7 What it is | `ABOUT` |
| 6.8 Timeline | `TIMELINE` |
| 6.9 Questions | `FAQ` |
| 6.10 Thank-you page | `WELCOME` |
| 6.11 Footer | `FOOTER` |

## "Moments" → component state

`web/src/components/waitlist-context.tsx` holds `stage: "form" | "survey" | "done"` and which slot (`hero` / `footer`) submitted. `waitlist-form.tsx` renders `EmailForm`, `SurveyCard` or `DoneCard`; the non-owning slot renders `SECONDARY_FORM.alreadyJoined`.

## Error message → source

| Brief wording | Origin |
| --- | --- |
| Enter a valid email address. | client pre-check, `FORM.errors.invalidEmail` |
| Please enter a valid email address. | API 400, `ERRORS.invalidEmail` (class-validator) |
| Disposable email addresses… | API 400, `ERRORS.disposableEmail` |
| Verification failed… | API 400, `ERRORS.captchaFailed` (Turnstile siteverify) |
| Too many signups… | API 429, `ERRORS.rateLimited` (5 / ipHash / hour) |
| Couldn't reach the server… | client, `FORM.errors.network` (fetch threw) |
| Something went wrong… | client, `FORM.errors.generic` (non-JSON / 5xx) |
| That took a while… | API 401 on `/waitlist/survey` (JWT > 30 min) → `SURVEY.errors.expired`, then `onSurveyFinished(false)` |
| Couldn't save your answers… | any other `/waitlist/survey` failure, stays in `survey` |

## Endpoints behind each moment

| Moment | Call | Response |
| --- | --- | --- |
| Form submit | `POST /waitlist/join` `{ email, turnstileToken, utm? }` | `{ ok, surveyCompleted: false, surveyToken }` |
| Questions submit | `POST /waitlist/survey` (Bearer surveyToken) `{ intent, chainsUsed, firstThing? }` | `{ ok: true }` |
| Skip | none | — |
| Email link | `GET /waitlist/verify?token=` | 302 → `/welcome`, `/?verify=expired`, `/?verify=invalid` |
| Trust-line count | `GET /waitlist/stats` (server-side, revalidate 60 s) | `{ verified }`; shown when ≥ `STATS_MIN` (50) in `page.tsx` |

## Turnstile

`@marsidev/react-turnstile`, `options.size`: `normal` 300×65, `flexible` 100%×65, `compact` 150×140. `theme` light/dark. Reset on every failed join.

## Tokens

Tailwind v4 `@theme` in `web/src/app/globals.css`: `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-border-strong`, `--color-fg`, `--color-muted`, `--color-faint`, `--color-accent`, `--color-accent-tint`, `--color-success`, `--color-danger`. The designer's palette list maps onto these names.
