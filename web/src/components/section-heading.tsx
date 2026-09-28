import { SectionMarker } from "./section-marker";

/**
 * Centered gradient heading with its numeral top-left, as on "Need To Know!" (Figma 554:1904).
 * The Timeline reuses it so the added section reads as part of the same sequence.
 */
export function SectionHeading({ id, marker, children }: { id: string; marker: string; children: string }) {
  return (
    <div className="relative">
      <SectionMarker
        n={marker}
        className="absolute top-[-7.1px] left-[-10.7px] text-[8.07px] text-grey-light lg:top-[-22px] lg:left-[-33px] lg:text-[25px]"
      />
      <h2
        id={id}
        className="trim-cap text-grad font-display text-[19.374px] font-normal capitalize tracking-[-0.04em] lg:text-[60px]"
      >
        {children}
      </h2>
    </div>
  );
}
