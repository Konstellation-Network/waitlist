"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useId, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FORM, SECONDARY_FORM } from "@/constants/copy";
import { ApiError, join } from "@/lib/api";
import { readUtm } from "@/lib/utm";
import { DoneCard } from "./done-card";
import { SurveyCard } from "./survey-card";
import { useWaitlist, type FormSlot } from "./waitlist-context";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * One component, three states, no route changes: form -> survey -> done.
 * After a successful /join the survey card replaces the form immediately.
 */
export function WaitlistForm({ slot }: { slot: FormSlot }) {
  const { stage, joined } = useWaitlist();

  // Another form instance on the page owns the flow: show a quiet note instead.
  if (stage !== "form" && joined && joined.slot !== slot) {
    return (
      <p className="text-sm text-muted" role="status">
        {SECONDARY_FORM.alreadyJoined}
      </p>
    );
  }

  if (stage === "survey" && joined) {
    return <SurveyCard email={joined.email} surveyToken={joined.surveyToken} />;
  }
  if (stage === "done" && joined) {
    return <DoneCard />;
  }
  return <EmailForm slot={slot} />;
}

function EmailForm({ slot }: { slot: FormSlot }) {
  const { onJoined } = useWaitlist();
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const turnstile = useRef<TurnstileInstance | null>(null);

  const canSubmit = !submitting && token !== null && SITE_KEY !== "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      toast.error(FORM.errors.invalidEmail);
      return;
    }
    if (!token) {
      toast.error(FORM.captchaWaiting);
      return;
    }

    setSubmitting(true);
    try {
      const res = await join(trimmed, token, readUtm());
      onJoined({
        email: trimmed,
        surveyToken: res.surveyToken,
        surveyCompleted: res.surveyCompleted,
        slot,
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : FORM.errors.generic;
      toast.error(message);
      // Turnstile tokens are single-use; get a fresh one for the retry.
      setToken(null);
      turnstile.current?.reset();
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <label htmlFor={inputId} className="sr-only">
        {FORM.emailLabel}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          placeholder={FORM.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          className="h-11 w-full sm:flex-1 rounded-md border border-border bg-surface px-3.5 text-[15px] text-fg placeholder:text-faint outline-none transition focus:border-border-strong focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-11 shrink-0 rounded-md bg-fg px-5 text-[15px] font-medium text-bg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? FORM.submitting : FORM.submit}
        </button>
      </div>

      {SITE_KEY ? (
        <Turnstile
          ref={turnstile}
          siteKey={SITE_KEY}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
          options={{ theme: "dark", size: "flexible" }}
          className="min-h-[65px]"
        />
      ) : (
        <p className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger">
          {FORM.captchaMissing}
        </p>
      )}
    </form>
  );
}
