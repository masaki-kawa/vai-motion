import type { Config } from "tailwindcss";

/**
 * Ported from the design-handoff prototype's inline `tailwind.config`.
 * The prototype keyed the (blue) accent palette under the legacy name `sage`;
 * per the handoff README it is renamed to `accent` here. Values are unchanged.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#14181C", soft: "#5B636B", mute: "#9AA1A8" },
        line: "rgba(20,24,28,0.08)",
        accent: { DEFAULT: "#4F84D6", deep: "#335FB0", soft: "#EAF1FB" },
      },
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "var(--font-noto-jp)",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      // every transition-* utility runs on the LP's base curve (same as --m-ease in globals.css)
      transitionTimingFunction: { DEFAULT: "cubic-bezier(0.22, 1, 0.36, 1)" },
      boxShadow: {
        nav: "0 8px 40px rgba(20,24,28,0.10)",
        soft: "0 10px 40px rgba(20,24,28,0.06)",
        lift: "0 24px 70px rgba(20,24,28,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
