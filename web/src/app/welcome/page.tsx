import { Check } from "lucide-react";
import type { Metadata } from "next";
import { Wordmark } from "@/components/wordmark";
import { FOOTER, SITE, WELCOME } from "@/constants/copy";

export const metadata: Metadata = {
  title: `${WELCOME.title} — ${SITE.name}`,
  robots: { index: false, follow: false },
};

/** Landing page after the email verification link. Reached only via the API redirect. */
export default function Welcome() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 sm:px-6">
      <header className="pt-6 sm:pt-10">
        <Wordmark />
      </header>

      <section className="card-in my-auto py-16 sm:py-24">
        <span className="flex size-9 items-center justify-center rounded-full border border-success/40 text-success">
          <Check size={18} strokeWidth={2.5} aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          {WELCOME.title}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg">{WELCOME.body}</p>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{WELCOME.next}</p>
      </section>

      <footer className="border-t border-border py-6">
        <p className="font-mono text-[11px] text-faint">{FOOTER.line}</p>
      </footer>
    </main>
  );
}
