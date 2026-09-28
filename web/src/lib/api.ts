const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export type Utm = Record<string, string>;

export interface JoinResponse {
  ok: true;
  /** Always false by design (anti-enumeration). Never branch on it. */
  surveyCompleted: boolean;
  surveyToken: string;
}

export interface SurveyPayload {
  intent: "building" | "using" | "node" | "curious";
  chainsUsed: string[];
  firstThing?: string;
}

/** status 0 = the request never got a response (offline, DNS, CORS, server down). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    /** The API's own message, when it sent one. */
    public readonly serverMessage: string | null,
  ) {
    super(serverMessage ?? `HTTP ${status}`);
  }
}

interface NestErrorBody {
  message?: string | string[];
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { "content-type": "application/json", ...(init.headers ?? {}) },
    });
  } catch (err) {
    // Browsers report CORS rejections, DNS failures and a stopped server identically
    // ("TypeError: Failed to fetch"); the Network tab shows which one it was.
    console.error(`[api] ${init.method ?? "GET"} ${url} failed before a response:`, err);
    throw new ApiError(0, null);
  }

  if (!res.ok) {
    let message: string | null = null;
    try {
      const body = (await res.json()) as NestErrorBody;
      if (typeof body.message === "string") message = body.message;
      else if (Array.isArray(body.message) && body.message[0]) message = body.message[0];
    } catch {
      // non-JSON error body
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
  });
}
