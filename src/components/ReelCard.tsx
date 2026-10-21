"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { LABELS, TINTS, VIDEOS, type Category } from "@/lib/data";
import { useT } from "./LangProvider";

type ReelCardProps = {
  cat: Category;
  fixed?: boolean;
  /** tailwind width class used when `fixed` */
  w?: string;
  hover?: boolean;
  wide?: boolean;
  /** Recent Work: minimal custom player WITH sound. Hero: muted, click-to-toggle. */
  controls?: boolean;
  /** Hero side reels: silent auto-looping ambient video — no play button, no click. */
  ambient?: boolean;
};

export default function ReelCard({
  cat,
  fixed = false,
  w = "w-[150px] sm:w-[182px]",
  hover = false,
  wide = false,
  controls = false,
  ambient = false,
}: ReelCardProps) {
  const { cur } = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [c1, c2] = TINTS[cat] ?? ["#E3ECFA", "#F4F8FE"];
  const media = VIDEOS[cat];
  // Recent Work ("controls") gets a custom bar + sound; Hero is a muted click-to-play tile.
  const isPlayer = controls;
  const heroInteractive = !!media && !controls && !ambient;
  const labelPos = media && controls ? "left-3 top-3" : "left-3 bottom-3";

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(!isPlayer); // hero: muted; recent work: sound on
  const [progress, setProgress] = useState(0);

  const label = LABELS[cat][cur];
  const videoLabel = cur === "ja" ? `${label}の動画` : `${label} video`;
  const tx = (en: string, ja: string) => (cur === "ja" ? ja : en);

  const widthClass = fixed ? `${w} shrink-0` : "w-full";
  const hoverClass = hover ? "hover:-translate-y-1.5 hover:shadow-lift" : "";
  const wideClass = wide ? "reel--wide" : "";

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = muted;
      void v.play();
    } else {
      v.pause();
    }
  }, [muted]);

  const toggleMute = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const v = videoRef.current;
      if (!v) return;
      const next = !muted;
      setMuted(next);
      v.muted = next;
    },
    [muted]
  );

  const seek = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v || !isFinite(v.duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = frac * v.duration;
    setProgress(frac);
  }, []);

  const onCardKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    },
    [togglePlay]
  );

  // wiring: state sync, single-active-video globally, pause on scroll-out
  useEffect(() => {
    const v = videoRef.current;
    const el = rootRef.current;
    if (!v || !el) return;

    v.muted = ambient ? true : muted; // hero/ambient stay muted; work starts with sound

    const onPlay = () => {
      setPlaying(true);
      // single active video — but ambient hero cards all loop together
      if (!ambient) {
        document.querySelectorAll<HTMLVideoElement>("video.reel-video").forEach((o) => {
          if (o !== v) o.pause();
        });
      }
    };
    const onPause = () => setPlaying(false);
    const onTime = () => {
      if (isFinite(v.duration) && v.duration > 0) setProgress(v.currentTime / v.duration);
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);

    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (ents) =>
          ents.forEach((e) => {
            if (ambient) {
              // pause when scrolled away, resume when back — keeps the loop cheap
              if (e.isIntersecting) {
                v.muted = true;
                void v.play().catch(() => {});
              } else {
                v.pause();
              }
            } else if (!e.isIntersecting && !v.paused) {
              v.pause();
            }
          }),
        { threshold: ambient ? 0.1 : 0.4 }
      );
      io.observe(el);
    }

    if (ambient) {
      v.muted = true;
      void v.play().catch(() => {});
    }

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      io?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      data-cat={cat}
      className={`reel ${wideClass} group relative ${widthClass} rounded-3xl overflow-hidden shadow-soft transition duration-300 ${hoverClass} ${
        media && !ambient ? "cursor-pointer" : ""
      } ${
        heroInteractive
          ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          : ""
      }`}
      {...(heroInteractive
        ? {
            role: "button",
            tabIndex: 0,
            "aria-label": cur === "ja" ? `${videoLabel}を再生` : `Play ${videoLabel}`,
            onClick: togglePlay,
            onKeyDown: onCardKeyDown,
          }
        : media && !ambient
        ? { onClick: togglePlay }
        : {})}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg,${c1},${c2})` }}
      />
      {media ? (
        <video
          ref={videoRef}
          className="reel-video absolute inset-0 h-full w-full object-cover"
          loop
          playsInline
          muted={ambient ? true : undefined}
          preload={ambient ? "auto" : isPlayer ? "metadata" : "none"}
          poster={media.poster}
          aria-label={videoLabel}
          src={media.src}
        />
      ) : (
        <div
          className="absolute inset-x-0 top-0 h-1/3"
          style={{ background: "linear-gradient(to bottom,rgba(255,255,255,0.35),transparent)" }}
        />
      )}

      {/* center play button (paused) — hidden for ambient auto-looping hero cards */}
      {media && !playing && !ambient && (
        <div className="absolute inset-0 grid place-items-center transition-opacity duration-200 pointer-events-none">
          <span className="grid place-items-center h-11 w-11 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-soft">
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <path d="M3.2 2.4v7.2L9 6 3.2 2.4Z" fill="#14181C" />
            </svg>
          </span>
        </div>
      )}

      {/* custom minimal control bar — Recent Work only (no fullscreen, no overflow menu) */}
      {isPlayer && media && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-x-0 bottom-0 z-10 flex items-center gap-2.5 px-3 pb-2.5 pt-8 group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-200 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) )" }}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            aria-label={playing ? tx("Pause", "一時停止") : tx("Play", "再生")}
            className="grid place-items-center h-7 w-7 shrink-0 rounded-full bg-white/90 text-ink hover:bg-white transition"
          >
            {playing ? (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="#14181C"><rect x="2.5" y="2" width="2.4" height="8" rx="0.6" /><rect x="7.1" y="2" width="2.4" height="8" rx="0.6" /></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3.2 2.4v7.2L9 6 3.2 2.4Z" fill="#14181C" /></svg>
            )}
          </button>

          <div
            role="slider"
            aria-label={tx("Seek", "シーク")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            onClick={seek}
            className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/30"
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
            />
          </div>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? tx("Unmute", "ミュート解除") : tx("Mute", "ミュート")}
            className="grid place-items-center h-7 w-7 shrink-0 rounded-full bg-white/90 text-ink hover:bg-white transition"
          >
            {muted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14181C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z" fill="#14181C" stroke="none"/><path d="M17 9l4 4M21 9l-4 4"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14181C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z" fill="#14181C" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12"/></svg>
            )}
          </button>
        </div>
      )}

      <div className={`absolute ${labelPos} z-10`}>
        <span className="reel-label rounded-full bg-white/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-ink">
          {label}
        </span>
      </div>
    </div>
  );
}
