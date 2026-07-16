"use client";

import type { CSSProperties } from "react";
import { FROM, HERO_SCATTER } from "@/lib/data";
import ReelCard from "./ReelCard";

export default function ScatterField() {
  return (
    <div className="relative w-full mt-4 lg:mt-0">
      <div className="scatter-stage" id="heroScatter">
        {HERO_SCATTER.map((s, i) => {
          const [fx, fy] = FROM[s.from] ?? FROM.R;
          const cellStyle: CSSProperties = {
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `clamp(${Math.round(s.w * 0.72)}px, ${(s.w / 11).toFixed(1)}vw, ${s.w}px)`,
          };
          const flyStyle = {
            "--rot": `${s.rot}deg`,
            "--spin": `${s.spin}deg`,
            "--fx": fx,
            "--fy": fy,
            "--delay": `${s.d}s`,
          } as CSSProperties;
          const bobStyle = {
            "--bdur": `${s.bdur}s`,
            "--bdelay": `${s.d + 1}s`,
          } as CSSProperties;

          return (
            <div key={i} className="scatter-cell" style={cellStyle}>
              <div className="scatter-fly" style={flyStyle}>
                <div className="scatter-bob" style={bobStyle}>
                  <ReelCard cat={s.cat} fixed w="w-full" wide={s.wide} ambient />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
