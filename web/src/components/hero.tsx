import { HERO } from "@/constants/copy";
import { ArtImage, ArtSvg } from "./art-image";
import { JoinHeading } from "./join-heading";
import { SectionMarker } from "./section-marker";
import { WaitlistForm } from "./waitlist-form";
import { Wordmark } from "./wordmark";

/**
 * Below 375px the 31px gutter drops to 16px so the 300px Turnstile widget still fits.
 *
 * Figma 549:684 (desktop, 1440) / 672:1468 (mobile, 430).
 * Mobile: wordmark, a 430:158 doorway band, then the form. Desktop: doorway panel left
 * (644/1440), form panel right.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative lg:grid lg:h-[966px] lg:grid-cols-[644fr_796fr]"
    >
      <div className="px-[31px] pt-[22px] max-[374px]:px-4 lg:hidden">
        <Wordmark />
      </div>

      <div className="relative mt-[25px] aspect-[430/158] overflow-hidden bg-linear-to-b from-[rgba(21,21,21,0.2)] to-[#0c0c0c] lg:mt-0 lg:aspect-auto lg:h-full">
        <Doorway />
        <div className="absolute top-[55px] left-[60px] hidden lg:block">
          <Wordmark />
        </div>
      </div>

      <div className="relative overflow-hidden px-[31px] max-[374px]:px-4 pt-[35px] pb-[23px] lg:bg-linear-to-b lg:from-[#181818] lg:to-black lg:px-[60px] lg:pt-[567px] lg:pb-0">
        <Stars />
        <div className="relative w-full max-w-[295px] lg:max-w-[676px]">
          <JoinHeading id="hero-heading" as="h1" />
          <div className="mt-[17px] lg:mt-[40px]">
            <WaitlistForm variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The doorway art plus its two light-glow overlays and the "01" marker. Overlay
 * positions are the same fractions of the image box on both frames, so they are
 * expressed in % / cqw of that box.
 */
function Doorway() {
  return (
    <div className="@container absolute top-[-61.39%] left-0 aspect-[3/2] w-[101.93%] lg:top-[-31px] lg:left-[calc(54.23%-746.25px)] lg:w-[1542.25px]">
      <ArtImage name="hero-doorway" hero sizes="(min-width: 1024px) 1543px, 102vw" />
      {(["/svg/door-glow-1.svg", "/svg/door-glow-2.svg"] as const).map((src) => (
        <div
          key={src}
          aria-hidden
          className="absolute top-[37.3%] left-[42.21%] h-[39.78%] w-[12.35%] mix-blend-plus-lighter"
        >
          <div className="absolute inset-[-17.85%_-38.32%]">
            <ArtSvg src={src} />
          </div>
        </div>
      ))}
      <SectionMarker
        n={HERO.marker}
        className="absolute top-[67.3%] left-[42.93%] text-[1.621cqw] text-marker"
      />
    </div>
  );
}

/** Faint star field behind the desktop form panel (two vector groups, clipped to one rect). */
function Stars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[-75px] left-[-259.5px] hidden h-[926px] w-[1423.58px] overflow-hidden lg:block"
    >
      <div className="absolute top-[-264.95px] left-[-214.44px] h-[790.91px] w-[1846.69px] opacity-60">
        <ArtSvg src="/svg/hero-stars-1.svg" />
      </div>
      <div className="absolute top-[289.01px] left-[-234.49px] h-[790.91px] w-[1846.69px] opacity-60">
        <ArtSvg src="/svg/hero-stars-2.svg" />
      </div>
    </div>
  );
}
