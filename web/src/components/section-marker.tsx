/**
 * The small "01"–"05" numerals that sit beside each section heading in the design.
 * Decorative (the heading carries the meaning), so hidden from assistive tech.
 * Callers set size, colour and position — the design places each one by hand.
 */
export function SectionMarker({ n, className }: { n: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`trim-cap font-display leading-none font-normal tracking-[-0.07em] whitespace-nowrap ${className ?? ""}`}
    >
      {n}
    </span>
  );
}
