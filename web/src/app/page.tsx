import { ClosingCta } from "@/components/closing-cta";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Timeline } from "@/components/timeline";
import { VerifyNotice } from "@/components/verify-notice";
import { WaitlistProvider } from "@/components/waitlist-context";
import { WorldChain } from "@/components/world-chain";
import { FOOTER } from "@/constants/copy";

export default function Home() {
  return (
    <WaitlistProvider>
      <VerifyNotice />
      <main className="flex-1">
        <Hero />
        <WorldChain />
        <Timeline />
        <Faq />
        <ClosingCta />
      </main>
      <footer className="px-[31px] py-[24px] lg:px-[60px]">
        <p className="font-mono text-[11px] text-marker">{FOOTER.line}</p>
      </footer>
    </WaitlistProvider>
  );
}
