"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Stage = "form" | "survey" | "done";
export type FormSlot = "hero" | "footer";

interface Joined {
  email: string;
  surveyToken: string;
  surveyCompleted: boolean;
  /** Which form instance the user submitted from; only that one shows the survey/done card. */
  slot: FormSlot;
}

interface WaitlistState {
  stage: Stage;
  joined: Joined | null;
  surveyDone: boolean;
  onJoined: (j: Joined) => void;
  onSurveyFinished: (completed: boolean) => void;
}

const Ctx = createContext<WaitlistState | null>(null);

/**
 * Holds the form -> survey -> done state for the whole page so the hero form and the
 * repeated bottom form stay in sync. Nothing here touches the URL or storage: the
 * survey token lives in memory only.
 */
export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>("form");
  const [joined, setJoined] = useState<Joined | null>(null);
  const [surveyDone, setSurveyDone] = useState(false);

  const onJoined = useCallback((j: Joined) => {
    setJoined(j);
    if (j.surveyCompleted) {
      setSurveyDone(true);
      setStage("done");
    } else {
      setStage("survey");
    }
  }, []);

  const onSurveyFinished = useCallback((completed: boolean) => {
    setSurveyDone(completed);
    setStage("done");
  }, []);

  const value = useMemo(
    () => ({ stage, joined, surveyDone, onJoined, onSurveyFinished }),
    [stage, joined, surveyDone, onJoined, onSurveyFinished],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaitlist(): WaitlistState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWaitlist must be used inside <WaitlistProvider>");
  return ctx;
}
