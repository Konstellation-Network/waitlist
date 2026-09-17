import { SITE } from "@/constants/copy";

/** Plain text wordmark — intentionally not a link. */
export function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="size-2 rounded-full bg-fg" />
      <span className="text-sm font-semibold tracking-tight">{SITE.name}</span>
      <span className="font-mono text-[11px] text-faint">/ {SITE.chainId}</span>
    </div>
  );
}
