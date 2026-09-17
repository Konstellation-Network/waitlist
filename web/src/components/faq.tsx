import { ChevronDown } from "lucide-react";
import { FAQ } from "@/constants/copy";

/** Native <details> accordion — accessible and needs no client JS. */
export function Faq() {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-lg font-semibold tracking-tight">
        {FAQ.heading}
      </h2>
      <div className="mt-4 divide-y divide-border border-y border-border">
        {FAQ.items.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-medium text-fg outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-accent/40">
              {item.q}
              <ChevronDown
                size={16}
                aria-hidden
                className="faq-chevron shrink-0 text-muted transition-transform"
              />
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
