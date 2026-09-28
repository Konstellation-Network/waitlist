import Image from "next/image";
import { WORDMARK } from "@/constants/copy";

/** Logo mark + name. Intentionally not a link — the page has no navigation. */
export function Wordmark() {
  return (
    <div className="flex items-center gap-[4px] lg:gap-[5.95px]">
      <Image src="/svg/logo-mark-sm.svg" alt="" width={16} height={16} unoptimized className="lg:hidden" />
      <Image src="/svg/logo-mark.svg" alt="" width={32} height={32} unoptimized className="hidden lg:block" />
      <span className="trim-cap text-[12px] font-semibold uppercase tracking-[-0.04em] lg:text-[19.206px]">
        {WORDMARK.label}
      </span>
    </div>
  );
}
