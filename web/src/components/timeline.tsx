import { TIMELINE } from "@/constants/copy";
import { SectionHeading } from "./section-heading";

/**
 * "Where Things Stand" — not in Figma. Heading reuses the FAQ treatment; the list sits in
 * a dark 16px-radius panel. Filled dot = shipped, outlined dot = next.
 */
export function Timeline() {
  return (
    <section aria-labelledby="timeline-heading" className="px-[23px] pt-[67px] lg:px-[60px] lg:pt-[126px]">
      <div className="mx-auto flex max-w-[836px] flex-col items-center gap-[13px] lg:gap-[46px]">
        <SectionHeading id="timeline-heading" marker={TIMELINE.marker}>
          {TIMELINE.heading}
        </SectionHeading>
        <ol className="w-full rounded-[16px] border border-panel-2 bg-panel px-[22px] py-[24px] lg:px-[81px] lg:py-[56px]">
          {TIMELINE.items.map((item, i) => {
            const shipped = item.state === "shipped";
            const last = i === TIMELINE.items.length - 1;
            return (
              <li key={item.title} className="flex gap-[14px] lg:gap-[24px]">
                <div aria-hidden className="flex w-[9px] shrink-0 flex-col items-center lg:w-[11px]">
                  <span
                    className={`mt-[2px] size-[9px] shrink-0 rounded-full lg:mt-[4px] lg:size-[11px] ${
                      shipped ? "bg-white" : "border border-grey-light"
                    }`}
                  />
                  {!last && <span className="mt-[6px] w-px flex-1 bg-panel-3" />}
                </div>
                <div className={last ? "" : "pb-[22px] lg:pb-[40px]"}>
                  <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[6px]">
                    <h3 className="font-display text-[14px] leading-none tracking-[-0.04em] text-fg lg:text-[20px]">
                      {item.title}
                    </h3>
                    <span
                      className={`rounded-[4px] border px-[6px] py-[3px] font-mono text-[9px] leading-none tracking-[0.12em] uppercase lg:text-[11px] ${
                        shipped ? "border-white text-white" : "border-panel-3 text-grey-mid"
                      }`}
                    >
                      {shipped ? TIMELINE.shippedLabel : TIMELINE.nextLabel}
                    </span>
                  </div>
                  <p className="mt-[8px] font-display text-[12px] leading-[1.45] tracking-[-0.03em] text-grey lg:mt-[12px] lg:text-[14px] lg:leading-[21px]">
                    {item.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
