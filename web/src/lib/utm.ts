import type { Utm } from "./api";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

/** Reads utm_* params from the current URL. Client-side only. */
export function readUtm(): Utm | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const out: Utm = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) out[key] = v.slice(0, 200);
  }
  return Object.keys(out).length ? out : undefined;
}
