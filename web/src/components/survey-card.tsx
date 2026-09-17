"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SURVEY } from "@/constants/copy";
import { ApiError, submitSurvey, type SurveyPayload } from "@/lib/api";
import { useWaitlist } from "./waitlist-context";

type Intent = SurveyPayload["intent"];

const MAX_CHAINS = 8;

export function SurveyCard({ email, surveyToken }: { email: string; surveyToken: string }) {
  const { onSurveyFinished } = useWaitlist();
  const [intent, setIntent] = useState<Intent | null>(null);
  const [chains, setChains] = useState<string[]>([]);
  const [firstThing, setFirstThing] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleChain(chain: string) {
    setChains((prev) => {
      if (prev.includes(chain)) return prev.filter((c) => c !== chain);
      if (prev.length >= MAX_CHAINS) return prev;
      return [...prev, chain];
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!intent || submitting) return;
    setSubmitting(true);
    try {
      const trimmed = firstThing.trim();
      await submitSurvey(surveyToken, {
        intent,
        chainsUsed: chains,
        ...(trimmed ? { firstThing: trimmed.slice(0, SURVEY.q3.maxLength) } : {}),
      });
      onSurveyFinished(true);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : SURVEY.errors.generic;
      toast.error(message);
      // The signup itself succeeded; an expired token means we just move on.
      if (err instanceof ApiError && err.status === 401) {
        onSurveyFinished(false);
      } else {
        setSubmitting(false);
      }
    }
  }

  return (
    <section
      aria-live="polite"
      className="card-in rounded-lg border border-border bg-surface p-5 sm:p-6"
    >
      <h2 className="text-xl font-semibold tracking-tight">{SURVEY.title}</h2>
      <p className="mt-1 text-sm text-muted">
        {SURVEY.sentTo} <span className="font-mono text-fg">{email}</span>
      </p>

      <div className="mt-5 rounded-md border border-accent/30 bg-accent-tint px-4 py-3">
        <p className="text-[15px] font-medium text-accent">{SURVEY.pitch}</p>
        <p className="mt-1 text-xs text-muted">{SURVEY.optionalNote}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {/* Q1 — single select */}
        <fieldset>
          <legend className="text-sm font-medium">{SURVEY.q1.label}</legend>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SURVEY.q1.options.map((opt) => {
              const selected = intent === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setIntent(opt.value)}
                  className={`h-11 rounded-md border px-3 text-left text-sm transition ${
                    selected
                      ? "border-fg bg-surface-2 text-fg"
                      : "border-border text-muted hover:border-border-strong hover:text-fg"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Q2 — multi select pills */}
        <fieldset>
          <legend className="text-sm font-medium">
            {SURVEY.q2.label}{" "}
            <span className="font-normal text-faint">· {SURVEY.q2.hint}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SURVEY.q2.options.map((chain) => {
              const selected = chains.includes(chain);
              return (
                <button
                  key={chain}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleChain(chain)}
                  className={`h-9 rounded-full border px-3.5 text-sm transition ${
                    selected
                      ? "border-fg bg-surface-2 text-fg"
                      : "border-border text-muted hover:border-border-strong hover:text-fg"
                  }`}
                >
                  {chain}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Q3 — optional textarea */}
        <div>
          <label htmlFor="first-thing" className="text-sm font-medium">
            {SURVEY.q3.label}{" "}
            <span className="font-normal text-faint">· {SURVEY.q3.hint}</span>
          </label>
          <textarea
            id="first-thing"
            rows={3}
            maxLength={SURVEY.q3.maxLength}
            value={firstThing}
            onChange={(e) => setFirstThing(e.target.value)}
            placeholder={SURVEY.q3.placeholder}
            className="mt-3 w-full resize-none rounded-md border border-border bg-bg px-3.5 py-2.5 text-sm text-fg placeholder:text-faint outline-none transition focus:border-border-strong focus:ring-2 focus:ring-accent/30"
          />
          <p className="mt-1 text-right font-mono text-[11px] text-faint">
            {firstThing.length}/{SURVEY.q3.maxLength}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!intent || submitting}
            className="h-11 w-full rounded-md bg-fg px-5 text-[15px] font-medium text-bg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {submitting ? SURVEY.submitting : SURVEY.submit}
          </button>
          <button
            type="button"
            onClick={() => onSurveyFinished(false)}
            disabled={submitting}
            className="text-sm text-muted underline underline-offset-4 transition hover:text-fg disabled:opacity-60"
          >
            {SURVEY.skip}
          </button>
        </div>
      </form>
    </section>
  );
}
