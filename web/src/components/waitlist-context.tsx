"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/** How the survey step ended; decides which Done copy is shown. */
export type DoneReason = "completed" | "skipped" | "timedOut";

interface Joined {
  email: string;
  /** Short-lived JWT for POST /waitlist/survey. Held in memory only — never stored. */
  surveyToken: string;
}

type Overlay = { step: "survey" } | { step: "done"; reason: DoneReason } | null;

interface WaitlistState {
  joined: Joined | null;
  overlay: Overlay;
  onJoined: (j: Joined) => void;
  finishSurvey: (reason: DoneReason) => void;
  closeOverlay: () => void;
}

const Ctx = createContext<WaitlistState | null>(null);

/**
 * Page-wide signup state so the hero form and the closing form stay in sync, and so the
 * survey overlay can be opened from either. Nothing here touches the URL or storage.
 */
export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [joined, setJoined] = useState<Joined | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);

  const onJoined = useCallback((j: Joined) => {
    setJoined(j);
    setOverlay({ step: "survey" });
  }, []);

  const finishSurvey = useCallback((reason: DoneReason) => {
    setOverlay({ step: "done", reason });
  }, []);

  // Only the Done step may close the overlay; the survey step always resolves to Done first.
  const closeOverlay = useCallback(() => {
    setOverlay((o) => (o?.step === "done" ? null : o));
  }, []);

  const value = useMemo(
    () => ({ joined, overlay, onJoined, finishSurvey, closeOverlay }),
    [joined, overlay, onJoined, finishSurvey, closeOverlay],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaitlist(): WaitlistState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWaitlist must be used inside <WaitlistProvider>");
  return ctx;
}
