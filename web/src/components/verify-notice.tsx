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
 * Shows an inline notice when the API redirects back with ?verify=expired|invalid.
 * Reads window.location via useSyncExternalStore (server snapshot: null) so the
 * page stays statically prerendered and hydrates without a mismatch.
 */
export function VerifyNotice() {
  const kind = useSyncExternalStore(noopSubscribe, readKind, () => null);
  const [dismissed, setDismissed] = useState(false);

  if (!kind || dismissed) return null;
  const copy = VERIFY_NOTICE[kind];

  return (
    <div
      role="alert"
      className="card-in mb-6 flex items-start gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-fg">{copy.title}</p>
        <p className="mt-0.5 text-sm text-muted">{copy.body}</p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={VERIFY_NOTICE.dismiss}
        className="-m-1 rounded p-1 text-muted transition hover:text-fg"
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
}
