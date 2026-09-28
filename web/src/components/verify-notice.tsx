"use client";

import { X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { VERIFY_NOTICE } from "@/constants/copy";

type Kind = "expired" | "invalid";

const noopSubscribe = () => () => {};

function readKind(): Kind | null {
  const v = new URLSearchParams(window.location.search).get("verify");
  return v === "expired" || v === "invalid" ? v : null;
}

/**
 * Dismissible banner for the API's redirect back with ?verify=expired|invalid.
 * Reads window.location via useSyncExternalStore (server snapshot: null) so the page
 * stays statically prerendered and hydrates without a mismatch.
 */
export function VerifyNotice() {
  const kind = useSyncExternalStore(noopSubscribe, readKind, () => null);
  const [dismissed, setDismissed] = useState(false);

  if (!kind || dismissed) return null;

  return (
    <div role="alert" className="card-in border-b border-panel-2 bg-panel">
      <div className="flex items-start gap-[12px] px-[31px] py-[12px] lg:items-center lg:px-[60px] lg:py-[14px]">
        <span aria-hidden className="mt-[5px] size-[6px] shrink-0 rounded-full bg-error lg:mt-0" />
        <p className="flex-1 text-[12px] leading-[1.45] tracking-[-0.02em] text-fg-soft lg:text-[14px]">
          {VERIFY_NOTICE[kind]}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={VERIFY_NOTICE.dismiss}
          className="-m-[6px] rounded-[6px] p-[6px] text-grey transition outline-none hover:text-fg focus-visible:ring-1 focus-visible:ring-grey-light"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
