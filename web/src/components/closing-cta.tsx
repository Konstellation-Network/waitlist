import { CLOSING } from "@/constants/copy";
import { ArtImage } from "./art-image";
import { JoinHeading } from "./join-heading";
import { SectionMarker } from "./section-marker";
import { WaitlistForm } from "./waitlist-form";

/**
 * Closing form over the coin art (Figma 554:1964 / 672:1521). The art is positioned from
 * the frame geometry: px on desktop, cqw/% on mobile so the composite scales as one.
 */
export function ClosingCta() {
  return (
    <section
      aria-labelledby="closing-heading"
      className="@container relative mt-[54px] overflow-hidden pt-[24px] pb-[23px] lg:mt-[139px] lg:h-[836px] lg:p-0"
    >
      <div
        aria-hidden
        className="absolute top-[-17.25cqw] left-[-16.05%] aspect-[568.11/403.99] w-[132.12%] lg:top-[-188px] lg:left-0 lg:aspect-auto lg:h-[1024px] lg:w-full"
      >
        <ArtImage name="cta-field" sizes="(min-width: 1024px) 1820px, 167vw" />
      </div>
      <div
        aria-hidden
        className="absolute top-[-42.57cqw] left-[-53.39%] aspect-square w-[209.1%] lg:top-[-464px] lg:left-[calc(50.87%-1139.5px)] lg:w-[2279px]"
      >
        <ArtImage name="cta-coins" sizes="(min-width: 1024px) 2279px, 210vw" />
      </div>

      <div className="relative mx-auto w-[351px] max-w-[calc(100%-32px)] bg-linear-to-b from-[#111] to-[#3d3d3d] px-[28px] max-[374px]:max-w-full max-[374px]:px-[10px] pt-[44px] pb-[43px] lg:absolute lg:top-[188px] lg:right-[57px] lg:left-[60px] lg:flex lg:h-[380px] lg:w-auto lg:max-w-none lg:items-start lg:justify-center lg:gap-[43px] lg:px-[40px] lg:pt-[122px] lg:pb-0">
        <div className="relative w-full max-w-[295px] lg:mt-[35.8px] lg:w-[359px] lg:max-w-none lg:shrink-0">
          <SectionMarker
            n={CLOSING.marker}
            className="absolute top-[-10.7px] left-[-8.1px] text-[15px] text-grey-light lg:top-[-17.8px] lg:left-[-13.5px] lg:text-[25px]"
          />
          <JoinHeading id="closing-heading" as="h2" />
        </div>
        <div className="mt-[17px] w-full max-w-[295px] lg:mt-0 lg:w-[676px] lg:max-w-none lg:min-w-0 lg:shrink">
          <WaitlistForm variant="cta" />
        </div>
      </div>
    </section>
  );
}
