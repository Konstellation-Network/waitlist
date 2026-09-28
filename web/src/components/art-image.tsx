"use client";

import Image, { type ImageLoader } from "next/image";

/**
 * Pre-built lossless WebP pairs in /public/images (halftone art compresses far better
 * lossless than lossy). `w1x` is the pixel width of the @1x file; anything wider is
 * served the @2x file.
 */
const ART = {
  "hero-doorway": { w1x: 768 },
  "world-landscape": { w1x: 696 },
  "cta-field": { w1x: 1440 },
  "cta-coins": { w1x: 1000 },
} as const;

export type ArtName = keyof typeof ART;

function loaderFor(name: ArtName): ImageLoader {
  return ({ width }) => `/images/${name}@${width <= ART[name].w1x ? "1x" : "2x"}.webp`;
}

interface ArtImageProps {
  name: ArtName;
  sizes: string;
  /** Above-the-fold art: fetched eagerly with high priority. Everything else lazy-loads. */
  hero?: boolean;
  className?: string;
}

/** Decorative art; always fills its positioned parent. */
export function ArtImage({ name, sizes, hero = false, className }: ArtImageProps) {
  return (
    <Image
      src={`/images/${name}`}
      loader={loaderFor(name)}
      alt=""
      fill
      sizes={sizes}
      preload={hero}
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : "auto"}
      className={`pointer-events-none object-cover ${className ?? ""}`}
    />
  );
}

/** Figma SVG exports; served as-is. */
export function ArtSvg({ src, className }: { src: string; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      unoptimized
      loading="lazy"
      className={`pointer-events-none ${className ?? ""}`}
    />
  );
}
