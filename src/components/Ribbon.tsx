"use client";

import { useT } from "./LangProvider";
import type { Lang } from "@/lib/i18n";

const WORDS: Record<Lang, string[]> = {
  en: ["café", "hair salon", "izakaya", "clinic", "retail", "bakery", "wellness", "nail studio", "ramen bar", "boutique"],
  ja: ["カフェ", "ヘアサロン", "居酒屋", "クリニック", "小売", "ベーカリー", "整体", "ネイル", "和食店", "レストラン"],
};

export default function Ribbon({ words }: { words?: Record<Lang, string[]> } = {}) {
  const { cur } = useT();
  const list = (words ?? WORDS)[cur];
  const seq = [...list, ...list];

  return (
    <div className="overflow-hidden border-y border-line py-4">
      <div className="ribbon-track flex w-max items-center gap-8 text-[15px] font-medium text-ink-mute whitespace-nowrap">
        {seq.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span>{w}</span>
            <span className="text-accent">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
