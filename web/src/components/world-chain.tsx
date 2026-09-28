import Image from "next/image";
import { WORLD_CHAIN } from "@/constants/copy";
import { ArtImage } from "./art-image";
import { SectionMarker } from "./section-marker";

/**
 * "The New World Chain". Mobile is an art-directed 430:322 composite (sized in cqw so it
 * scales as one piece); desktop is 817px tall with the copy right-aligned over the sky.
 */
export function WorldChain() {
  return (
    <section
      aria-labelledby="world-heading"
      className="@container relative mt-[8px] aspect-[430/322] overflow-hidden lg:mt-0 lg:aspect-auto lg:h-[max(817px,56.74vw)]"
    >
      {/* On mobile the art stops 16px short of the section bottom, as drawn. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[95.03%] overflow-hidden lg:h-full">
        <div className="absolute top-[-17.65%] left-[-20.7%] h-[139.43%] w-[148.84%] lg:top-[-32px] lg:right-0 lg:left-auto lg:aspect-[1490/993.33] lg:h-auto lg:w-[max(1490px,103.47%)]">
          <ArtImage name="world-landscape" sizes="(min-width: 1024px) max(1879px, 130vw), 188vw" />
        </div>
      </div>

      <div className="relative h-full lg:flex lg:flex-col lg:items-end lg:pt-[138px] lg:pr-[64px]">
        <div className="absolute top-[19.25%] left-[13.49%] flex items-center lg:static">
          <SectionMarker
            n={WORLD_CHAIN.marker}
            className="absolute right-full mr-[1.2cqw] text-[1.94cqw] text-marker lg:static lg:mr-[7px] lg:text-[25px]"
          />
          <span aria-hidden className="relative hidden size-[53px] shrink-0 lg:block">
            <span className="absolute inset-[12.5%_8.33%]">
              <span className="absolute inset-[-4.17%_-5.36%_-4.17%_-7.14%]">
                <Image src="/svg/marker-code.svg" alt="" fill unoptimized />
              </span>
            </span>
          </span>
          <h2
            id="world-heading"
            className="trim-cap text-grad-dim font-display text-[9.302cqw] font-normal whitespace-nowrap capitalize tracking-[-0.07em] lg:text-[min(120px,8.333vw)]"
          >
            {WORLD_CHAIN.heading}
          </h2>
        </div>
        <p className="trim-cap absolute top-[31.99%] left-[9.53%] w-[82.33%] text-center text-[2.791cqw] leading-[1.577] capitalize tracking-[-0.05em] text-grey-dim lg:static lg:mt-[37px] lg:w-auto lg:max-w-[799px] lg:text-right lg:text-[25px] lg:leading-[40px]">
          {WORLD_CHAIN.body}
        </p>
      </div>
    </section>
  );
}
