/* =========================================================================
   lpImages.ts — the five still images on the landing page.
   Masaki generates them from the prompts; drop each file into
   public/assets/lp/ and flip `ready` to true. Until then the page shows
   the monochrome gradient fallback (no request, no broken image).
   ========================================================================= */

export type LpImageKey = "hero" | "shoot" | "photos" | "area" | "promo";

export const LP_IMAGES: Record<
  LpImageKey,
  { src: string; ready: boolean; width: number; height: number; fallback: string; tone: "light" | "dark" }
> = {
  hero: {
    src: "/assets/lp/hero.jpg",
    ready: false,
    width: 2400,
    height: 1600,
    fallback: "linear-gradient(160deg,#EEEFF0 0%,#DADCDF 60%,#CBCED2 100%)",
    tone: "light",
  },
  shoot: {
    src: "/assets/lp/shoot.jpg",
    ready: false,
    width: 1600,
    height: 2000,
    fallback: "linear-gradient(180deg,#2B2E32 0%,#141619 100%)",
    tone: "dark",
  },
  photos: {
    src: "/assets/lp/photos.jpg",
    ready: false,
    width: 1600,
    height: 2000,
    fallback: "linear-gradient(170deg,#EDEEEF 0%,#DDDFE2 100%)",
    tone: "light",
  },
  area: {
    src: "/assets/lp/area.jpg",
    ready: false,
    width: 1600,
    height: 2000,
    fallback: "linear-gradient(180deg,#3A3D41 0%,#1A1C1F 100%)",
    tone: "dark",
  },
  promo: {
    src: "/assets/lp/promo.jpg",
    ready: false,
    width: 2400,
    height: 1350,
    fallback: "linear-gradient(180deg,#1C1F23 0%,#0B0D10 100%)",
    tone: "dark",
  },
};
