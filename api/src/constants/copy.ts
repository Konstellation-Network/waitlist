/**
 * Every user-facing string the API emits lives here.
 * Emails are plain text — edit freely, keep the {{placeholders}}.
 */

export const ERRORS = {
  invalidEmail: 'Please enter a valid email address.',
  disposableEmail:
    'Disposable email addresses are not accepted. Please use a permanent address.',
  captchaFailed: 'Verification failed. Please refresh the page and try again.',
  rateLimited:
    'Too many signups from your network. Please try again in an hour.',
  surveyUnauthorized:
    'This survey link has expired. You are still on the list.',
  surveyAlreadyDone: 'Survey already completed.',
  adminUnauthorized: 'Unauthorized.',
} as const;

export const VERIFICATION_EMAIL = {
  subject: 'Confirm your spot on the Konstellation waitlist',
  body: `Hi,

Thanks for joining the Konstellation waitlist. Confirm your email to lock in your spot:

{{verifyUrl}}

This link expires in 48 hours. If it has already expired, just sign up again at {{appUrl}} and we will send a fresh one.

If you did not request this, you can ignore this email — nothing else will be sent.

— The Konstellation team`,
} as const;

export const WELCOME_EMAIL = {
  subject: "You're on the Konstellation waitlist",
  body: `Hi,

Your email is confirmed and you're on the Konstellation waitlist.

Konstellation is an EVM-compatible Layer 1 built on the Cosmos SDK (chain ID 5667, native token KASH) — Ethereum tooling on a fast-finality, interoperable base.

What to expect: a short progress update every two weeks, and an access email when your wave opens. Nothing else.

— The Konstellation team`,
} as const;
