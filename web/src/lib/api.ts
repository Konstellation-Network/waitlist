import { FORM, SURVEY } from "@/constants/copy";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export type Utm = Record<string, string>;

export interface JoinResponse {
  ok: true;
  surveyCompleted: boolean;
  surveyToken: string;
}

export interface SurveyPayload {
  intent: "building" | "using" | "node" | "curious";
  chainsUsed: string[];
  firstThing?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

interface NestErrorBody {
  message?: string | string[];
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...(init.headers ?? {}) },
    });
  } catch {
    throw new ApiError(0, FORM.errors.network);
  }

  if (!res.ok) {
    let message: string = FORM.errors.generic;
    try {
      const body = (await res.json()) as NestErrorBody;
      if (typeof body.message === "string") message = body.message;
      else if (Array.isArray(body.message) && body.message[0]) message = body.message[0];
    } catch {
      // non-JSON error body — keep the generic message
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

export function join(email: string, turnstileToken: string, utm: Utm | undefined) {
  return request<JoinResponse>("/waitlist/join", {
    method: "POST",
    body: JSON.stringify(utm ? { email, turnstileToken, utm } : { email, turnstileToken }),
  });
}

export function submitSurvey(surveyToken: string, payload: SurveyPayload) {
  return request<{ ok: true }>("/waitlist/survey", {
    method: "POST",
    headers: { authorization: `Bearer ${surveyToken}` },
    body: JSON.stringify(payload),
  }).catch((err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      throw new ApiError(401, SURVEY.errors.expired);
    }
    throw err;
  });
}

export async function fetchStats(): Promise<{ verified: number } | null> {
  try {
    const res = await fetch(`${API_URL}/waitlist/stats`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as { verified: number };
  } catch {
    return null;
  }
}
