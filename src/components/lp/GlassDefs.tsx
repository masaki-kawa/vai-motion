/**
 * The SVG filters behind the Chromium-only refraction (backdrop-filter: url(#lp-refract)).
 * Rendered once, in app/page.tsx. Low-frequency noise displaces the live backdrop: the old
 * /jp nav's warp. Only rules under html.lg-refract (Chromium, desktop and Android) reference
 * these, so WebKit never does. Never display:none this <svg>: that breaks the url() refs.
 */
export default function GlassDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <filter
        id="lp-refract"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        colorInterpolationFilters="linearRGB"
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves={2} seed={92} stitchTiles="stitch" result="noise" />
        <feGaussianBlur in="noise" stdDeviation={2} result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale={70} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter
        id="lp-refract-s"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        colorInterpolationFilters="linearRGB"
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.014 0.014" numOctaves={2} seed={7} stitchTiles="stitch" result="noise" />
        <feGaussianBlur in="noise" stdDeviation={2} result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale={30} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
