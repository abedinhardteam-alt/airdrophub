import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "mint" | "gold" | "buy" | "sell" | "live";
  className?: string;
}) {
  const tones = {
    muted: "bg-white/6 text-muted ring-white/8",
    mint: "bg-mint/12 text-mint ring-mint/20",
    gold: "bg-gold/12 text-gold ring-gold/20",
    buy: "bg-buy/12 text-buy ring-buy/20",
    sell: "bg-sell/12 text-sell ring-sell/20",
    live: "bg-buy/12 text-buy ring-buy/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
        tones[tone],
        className,
      )}
    >
      {tone === "live" ? (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-buy" />
      ) : null}
      {children}
    </span>
  );
}
