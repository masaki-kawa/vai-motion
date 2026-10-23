/**
 * The SVG filters behind the glass refraction. Rendered once, in app/page.tsx. Low-frequency
 * noise displaces what is behind the glass: the old /jp nav's warp.
 * - #lp-refract / #lp-refract-s: backdrop filters, only under html.lg-refract (Chromium,
 *   desktop and Android), because WebKit and Gecko drop a backdrop filter that has a url().
 * - #lp-mirror / #lp-mirror-d: the same warp as a plain CSS filter on the nav's lens, a live
 *   copy of the page (useMirror, html.lg-mirror: Safari, iOS, Firefox). The 2px blur and the
 *   brightness live inside the filter, so nothing outside its region (the rest of the copy)
 *   is ever filtered. Same box, region and noise as #lp-refract, so the bends land in the
 *   same places in every browser.
 * Never display:none this <svg>: that breaks the url() refs.
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
      <MirrorFilter id="lp-mirror" brightness={1.05} />
      <MirrorFilter id="lp-mirror-d" brightness={0.85} />
    </svg>
  );
}

/** #lp-refract's blur(2px) url() brightness() chain, as one filter (sRGB like the CSS functions) */
function MirrorFilter({ id, brightness }: { id: string; brightness: number }) {
  return (
    <filter
      id={id}
      x="-50%"
      y="-50%"
      width="200%"
      height="200%"
      filterUnits="objectBoundingBox"
      primitiveUnits="userSpaceOnUse"
      colorInterpolationFilters="linearRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation={2} colorInterpolationFilters="sRGB" result="blur" />
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves={2} seed={92} stitchTiles="stitch" result="noise" />
      <feGaussianBlur in="noise" stdDeviation={2} result="soft" />
      <feDisplacementMap in="blur" in2="soft" scale={70} xChannelSelector="R" yChannelSelector="G" result="warp" />
      <feComponentTransfer in="warp" colorInterpolationFilters="sRGB">
        <feFuncR type="linear" slope={brightness} />
        <feFuncG type="linear" slope={brightness} />
        <feFuncB type="linear" slope={brightness} />
      </feComponentTransfer>
    </filter>
  );
}
