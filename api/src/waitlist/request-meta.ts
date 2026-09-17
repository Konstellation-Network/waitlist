import type { Request } from 'express';

/** Client IP: first entry of x-forwarded-for, falling back to the socket address. */
export function clientIp(req: Request): string | null {
  const xff = req.headers['x-forwarded-for'];
  const raw = Array.isArray(xff) ? xff[0] : xff;
  const first = raw?.split(',')[0]?.trim();
  if (first) return first;
  return req.socket?.remoteAddress ?? null;
}

/** Country code as set by Cloudflare / Vercel / Fly edge, if any. */
export function clientCountry(req: Request): string | null {
  const candidates = [
    'cf-ipcountry',
    'x-vercel-ip-country',
    'fly-client-country',
  ];
  for (const name of candidates) {
    const v = req.headers[name];
    const s = Array.isArray(v) ? v[0] : v;
    if (s && s.length <= 8) return s.toUpperCase();
  }
  return null;
}

export function clientUserAgent(req: Request): string | null {
  const ua = req.headers['user-agent'];
  if (!ua) return null;
  return ua.slice(0, 512);
}
