"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  /** The ad slot ID from your AdSense dashboard (e.g. "1234567890") */
  slot: string;
  /** Ad format. "auto" is most flexible. */
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  /** Whether the ad should be full-width responsive */
  responsive?: boolean;
  /** Ad layout for in-article/in-feed ads */
  layout?: string;
  /** Ad layout key for in-feed ads */
  layoutKey?: string;
  /** Visual style for the surrounding card */
  variant?: "vintage" | "minimal";
  /** Optional label shown above the ad */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  layout,
  layoutKey,
  variant = "vintage",
  label = "Publicidad",
  className,
  style,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Don't render ads if AdSense isn't configured (dev/preview)
    if (!ADSENSE_ID || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.warn("[AdSlot] AdSense push failed:", err);
    }
  }, []);

  // Show a placeholder when not configured (so editors can see ad placement)
  if (!ADSENSE_ID) {
    return (
      <div
        className={cn(
          "relative w-full bg-[#FDF6E3]/40 border-2 border-dashed border-[#8B7355]/50 rounded-sm py-10 text-center",
          className
        )}
      >
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[#8B7355]">
          Espacio publicitario
        </p>
        <p className="font-mono text-[10px] text-[#8B7355]/60 mt-1">
          slot: {slot}
        </p>
      </div>
    );
  }

  const wrapperClass =
    variant === "vintage"
      ? "relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-3"
      : "";

  return (
    <div className={cn(wrapperClass, className)}>
      {label && variant === "vintage" && (
        <p className="font-display text-[9px] uppercase tracking-[0.2em] text-[#8B7355] text-center mb-2">
          ━━ {label} ━━
        </p>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
