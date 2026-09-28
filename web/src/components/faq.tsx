import { FAQ } from "@/constants/copy";
import { ArtSvg } from "./art-image";
import { SectionHeading } from "./section-heading";

/**
 * "Need To Know!" — native <details> so it works without JS and is keyboard operable.
 * Open item: white panel with the "+" mark; closed items: #212121. `name` makes it an
 * exclusive accordion (one open at a time), matching the single open panel in the design.
 */
export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="px-[23px] pt-[67px] lg:px-[60px] lg:pt-[126px]">
      <div className="mx-auto flex max-w-[836px] flex-col items-center gap-[13px] lg:gap-[46px]">
        <SectionHeading id="faq-heading" marker={FAQ.marker}>
          {FAQ.heading}
        </SectionHeading>
        <div className="flex w-full flex-col gap-[6.874px] lg:gap-[15px]">
          {FAQ.items.map((item, i) => (
            <details
              key={item.q}
              name="faq"
              open={i === 0}
              className="group rounded-[4.583px] bg-panel-2 transition-colors open:bg-white lg:rounded-[10px]"
            >
              <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 rounded-[inherit] pr-[28px] pl-[37px] outline-none focus-visible:ring-2 focus-visible:ring-grey-light group-open:min-h-0 group-open:items-end group-open:pt-[21.5px] lg:min-h-[96px] lg:pr-[61px] lg:pl-[81px] lg:group-open:pt-[47px]">
                <span className="trim-cap font-display text-[12px] tracking-[-0.04em] text-grey group-open:text-grey-mid lg:text-[20px]">
                  {item.q}
                </span>
                <span aria-hidden className="relative hidden size-[9.166px] shrink-0 group-open:block lg:size-[20px]">
                  <span className="absolute inset-[-10.71%]">
                    <ArtSvg src="/svg/faq-plus.svg" />
                  </span>
                </span>
              </summary>
              <p className="trim-cap mt-[13px] max-w-[260px] pr-[28px] pb-[10px] pl-[37px] font-display text-[12px] leading-[14.6px] tracking-[-0.04em] text-grey-mid box-content lg:mt-[29px] lg:max-w-[545px] lg:pr-[61px] lg:pb-[43px] lg:pl-[81px] lg:text-[14px] lg:leading-[21px] lg:tracking-[-0.03em]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
