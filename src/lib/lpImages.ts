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
    // the plate is the dark surface the hero glass needs: until the photo is ready it shows the
    // CSS studio (Plate scene="studio"). Photo brief: LOW-KEY B&W (dark background); keep the
    // subject inside the middle band. The nav covers the top ~13% on desktop / ~21% on phones,
    // and the chip covers the bottom-left.
    fallback: "#0b0c0e",
    tone: "dark",
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
