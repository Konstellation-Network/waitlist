"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useId, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FORM, TOASTS } from "@/constants/copy";
import { ApiError, join } from "@/lib/api";
import { readUtm } from "@/lib/utm";
import { useWaitlist } from "./waitlist-context";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "hero" sits on the black hero panel; "cta" on the lighter closing card (Figma uses a lighter input there). */
export type FormVariant = "hero" | "cta";

const INPUT_FILL: Record<FormVariant, string> = {
  hero: "bg-panel placeholder:text-grey-mid",
  cta: "bg-panel-3 placeholder:text-fg-soft",
};

/**
 * The page renders this twice. Signup state is shared, so once either instance succeeds
 * both show the joined note instead of a second form.
 */
export function WaitlistForm({ variant }: { variant: FormVariant }) {
  const { joined } = useWaitlist();
  if (joined) {
    return (
      <p
        role="status"
        className={`card-in rounded-[8px] px-[20px] py-[14px] text-[12px] leading-snug tracking-[-0.04em] text-fg-soft lg:px-[38px] lg:py-[22px] lg:text-[15px] ${
          variant === "hero" ? "bg-panel" : "bg-panel-3"
        }`}
      >
        {FORM.alreadyJoined}
      </p>
    );
  }
  return <EmailForm variant={variant} />;
}

type FieldError = { kind: "email" | "captcha"; message: string } | null;

function EmailForm({ variant }: { variant: FormVariant }) {
  const { onJoined } = useWaitlist();
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const turnstile = useRef<TurnstileInstance | null>(null);
  // A ref, not state: two submits in the same tick (double click, Enter + click) both see it.
  const inFlight = useRef(false);

  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FieldError>(null);

  function validateEmail(value: string): boolean {
    return EMAIL_RE.test(value.trim());
  }

  function handleBlur() {
    if (email.trim() && !validateEmail(email)) {
      setError({ kind: "email", message: FORM.errors.invalidEmail });
    }
  }

  function handleChange(value: string) {
    setEmail(value);
    if (error?.kind === "email" && validateEmail(value)) setError(null);
  }

  function resetCaptcha() {
    setToken(null);
    turnstile.current?.reset();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;

    const trimmed = email.trim().toLowerCase();
    if (!validateEmail(trimmed)) {
      setError({ kind: "email", message: FORM.errors.invalidEmail });
      inputRef.current?.focus();
      return;
    }
    if (!token) {
      setError({ kind: "captcha", message: FORM.errors.captchaMissing });
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const res = await join(trimmed, token, readUtm());
      onJoined({ email: trimmed, surveyToken: res.surveyToken });
    } catch (err) {
      const status = err instanceof ApiError ? err.status : -1;
      if (status === 0) toast.error(TOASTS.network);
      else if (status === 429) toast.error(TOASTS.rateLimited);
      else if (status >= 400 && status < 500 && err instanceof ApiError && err.serverMessage) {
        // 4xx from the API (disposable address, failed check): its own message, inline.
        setError({ kind: "email", message: err.serverMessage });
      } else toast.error(TOASTS.server);
      // Turnstile tokens are single-use; get a fresh one for the retry.
      resetCaptcha();
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-[14px] lg:gap-[15px]"
    >
      <div className="flex flex-col gap-[6px] lg:gap-[17px]">
        <div>
          <label htmlFor={inputId} className="sr-only">
            {FORM.emailLabel}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            placeholder={FORM.emailPlaceholder}
            value={email}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            aria-invalid={error?.kind === "email"}
            aria-describedby={error ? errorId : undefined}
            className={`h-[43px] w-full rounded-[8px] px-[20px] text-[12px] tracking-[-0.04em] text-fg outline-none transition placeholder:capitalize focus-visible:ring-1 focus-visible:ring-grey-light aria-invalid:ring-1 aria-invalid:ring-error/60 lg:h-[62px] lg:px-[38px] lg:text-[13px] ${INPUT_FILL[variant]}`}
          />
          {error && (
            <p
              id={errorId}
              role="alert"
              className="mt-[6px] text-[12px] tracking-[-0.02em] text-error lg:mt-[8px] lg:text-[13px]"
            >
              {error.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="h-[43px] w-full rounded-[8px] bg-white text-[12px] font-medium tracking-[-0.04em] text-black transition outline-none hover:bg-grey-bright focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-wait disabled:opacity-60 lg:h-[58px] lg:text-[15px]"
        >
          {submitting ? FORM.submitting : FORM.submit}
        </button>
      </div>

      {SITE_KEY ? (
        <Turnstile
          ref={turnstile}
          siteKey={SITE_KEY}
          onSuccess={(t) => {
            setToken(t);
            setError((prev) => (prev?.kind === "captcha" ? null : prev));
          }}
          onExpire={() => {
            resetCaptcha();
            setError({ kind: "captcha", message: FORM.errors.captchaExpired });
          }}
          onError={() => {
            resetCaptcha();
            setError({ kind: "captcha", message: FORM.errors.captchaExpired });
          }}
          options={{ theme: "dark", size: "normal" }}
          className="min-h-[65px]"
        />
      ) : (
        <p className="rounded-[8px] border border-error/30 px-3 py-2 text-xs text-error">
          {FORM.captchaMissing}
        </p>
      )}
    </form>
  );
}
