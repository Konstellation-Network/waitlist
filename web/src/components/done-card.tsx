"use client";

import { Check } from "lucide-react";
import { DONE } from "@/constants/copy";
import { useWaitlist } from "./waitlist-context";

export function DoneCard() {
  const { surveyDone } = useWaitlist();
  return (
    <section
      aria-live="polite"
      className="card-in rounded-lg border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-full border border-success/40 text-success">
          <Check size={14} strokeWidth={2.5} aria-hidden />
        </span>
        <h2 className="text-xl font-semibold tracking-tight">{DONE.title}</h2>
      </div>
      <p className="mt-3 text-[15px] text-fg">
        {surveyDone ? DONE.withSurvey : DONE.withoutSurvey}
      </p>
      <p className="mt-2 text-sm text-muted">{DONE.checkEmail}</p>
      <p className="mt-2 text-sm text-muted">{DONE.cadence}</p>
    </section>
  );
}
