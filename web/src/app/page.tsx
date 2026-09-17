import { About } from "@/components/about";
import { Faq } from "@/components/faq";
import { Timeline } from "@/components/timeline";
import { VerifyNotice } from "@/components/verify-notice";
import { WaitlistProvider } from "@/components/waitlist-context";
import { WaitlistForm } from "@/components/waitlist-form";
import { Wordmark } from "@/components/wordmark";
import { FOOTER, FORM, HERO, SECONDARY_FORM, STATS } from "@/constants/copy";
import { fetchStats } from "@/lib/api";

// Only show the count once it is large enough to be a signal, not a deterrent.
const STATS_MIN = 50;

export default async function Home() {
  const stats = await fetchStats();
  const showStats = stats !== null && stats.verified >= STATS_MIN;

  return (
    <WaitlistProvider>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 sm:px-6">
        {/* 1. Hero — fits above the fold at 375px */}
        <header className="relative pt-6 pb-10 sm:pt-10 sm:pb-14">
          <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 -z-10" />
          <Wordmark />
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-faint sm:mt-12">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-2 text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {HERO.headline}
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base">
            {HERO.subhead}
          </p>

          <div className="mt-6">
            <VerifyNotice />
            <WaitlistForm slot="hero" />
          </div>

          {/* 2. Trust line */}
          <p className="mt-3 text-xs text-faint">
            {FORM.trustLine}
            {showStats && (
              <>
                {" "}
                <span className="font-mono text-muted">{stats.verified.toLocaleString()}</span>{" "}
                {STATS.label}.
              </>
            )}
          </p>
        </header>

        <div className="flex flex-col gap-14 pb-16 sm:gap-20">
          {/* 3. What it is */}
          <About />

          {/* 4. Timeline */}
          <Timeline />

          {/* 5. FAQ */}
          <Faq />

          {/* 6. Form repeated */}
          <section
            aria-labelledby="secondary-form-heading"
            className="rounded-lg border border-border bg-surface p-5 sm:p-6"
          >
            <h2 id="secondary-form-heading" className="text-xl font-semibold tracking-tight">
              {SECONDARY_FORM.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{SECONDARY_FORM.subhead}</p>
            <div className="mt-5">
              <WaitlistForm slot="footer" />
            </div>
          </section>
        </div>

        <footer className="border-t border-border py-6">
          <p className="font-mono text-[11px] text-faint">{FOOTER.line}</p>
        </footer>
      </main>
    </WaitlistProvider>
  );
}
