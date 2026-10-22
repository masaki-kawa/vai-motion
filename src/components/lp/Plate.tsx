"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LP_IMAGES, type LpImageKey } from "@/lib/lpImages";
import { useReveal } from "./useReveal";

type PlateProps = {
  img: LpImageKey;
  alt: string;
  /** caption chip: line 1 (bold) and line 2 */
  l1?: string;
  l2?: string;
  /** CSS aspect-ratio, e.g. "3 / 2" */
  ratio: string;
  /** aspect ratio below 900px (plates crop to 4:3 on phones) */
  mobileRatio?: string;
  objectPosition?: string;
  sizes: string;
  priority?: boolean;
  /** gentle scroll drift on desktop (px, negative = up) */
  drift?: number;
  className?: string;
};

/**
 * An editorial image plate: outer wrapper drifts with scroll (desktop), the figure
 * opens with a clip-path reveal, the image settles from scale 1.06. One transform
 * per element so they never fight. Shows the gradient fallback until the image is ready.
 */
export default function Plate({
  img,
  alt,
  l1,
  l2,
  ratio,
  mobileRatio,
  objectPosition = "50% 50%",
  sizes,
  priority = false,
  drift = 0,
  className = "",
}: PlateProps) {
  const meta = LP_IMAGES[img];
  const { ref, cls } = useReveal<HTMLElement>(0.15);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !drift) return;
    const desktop = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!desktop.matches || reduced.matches) {
        el.style.transform = "";
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the plate's centre is at the bottom of the viewport → +1 at the top
      const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)));
      el.style.transform = `translate3d(0, ${(p * drift).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [drift]);

  const chipTone = meta.tone === "dark" ? "m-chip--dark" : "m-chip--light";
  const style = {
    "--r": ratio,
    "--rm": mobileRatio ?? ratio,
    background: meta.fallback,
  } as React.CSSProperties;

  return (
    <div ref={wrapRef} className={`will-change-transform ${className}`}>
      <figure
        ref={ref}
        className={`m-plate m-plate-reveal ${meta.tone === "dark" ? "m-rim-dark" : "m-rim"} m-plate-ratio ${cls}`}
        style={style}
      >
        {meta.ready ? (
          <Image
            src={meta.src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            onLoad={() => setLoaded(true)}
            className={`m-plate-media object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ objectPosition }}
          />
        ) : (
          <div className="m-plate-media absolute inset-0" style={{ background: meta.fallback }} role="img" aria-label={alt} />
        )}
        {(l1 || l2) && (
          <figcaption className={`m-chip ${chipTone}`}>
            {l1 && <span className="m-jp-break block text-[13px] sm:text-[15px] font-bold leading-snug">{l1}</span>}
            {l2 && (
              <span
                className={`block mt-0.5 text-[12px] sm:text-[13px] leading-snug ${
                  meta.tone === "dark" ? "text-white/75" : "text-[color:var(--m-soft)]"
                }`}
              >
                {l2}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
