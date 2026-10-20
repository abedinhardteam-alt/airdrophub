"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { assets, getMerchant, methods } from "@/data/catalog";
import { formatFiat, formatQty } from "@/lib/format";
import { compact } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { allListings, isP2P, useApp } from "@/store/app-store";
import type { Fiat, Side } from "@/types";

export function P2PBoard({
  market,
  title,
  subtitle,
}: {
  market: "crypto" | "stars" | "all";
  title: string;
  subtitle: string;
}) {
  const extras = useApp((s) => s.extras);
  const params = useSearchParams();
  const q0 = params.get("q") ?? "";
  const [side, setSide] = useState<Side>("sell");
  const [asset, setAsset] = useState(market === "stars" ? "STARS" : "USDT");
  const [fiat, setFiat] = useState<Fiat>("BDT");
  const [method, setMethod] = useState("all");
  const [q, setQ] = useState(q0);
  const [amount, setAmount] = useState("");

  const rows = useMemo(() => {
    const amt = Number(amount);
    return allListings(extras)
      .filter(isP2P)
      .filter((o) => (market === "all" ? true : o.market === market))
      .filter((o) => o.side === side)
      .filter((o) => (market === "stars" ? o.asset === "STARS" : asset === "ALL" || o.asset === asset))
      .filter((o) => o.fiat === fiat)
      .filter((o) => method === "all" || o.methods.includes(method))
      .filter((o) => {
        const m = getMerchant(o.merchantId);
        const hay = `${o.id} ${o.asset} ${m.name} ${o.methods.join(" ")}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      })
      .filter((o) => !amt || (amt >= o.min && amt <= o.max))
      .sort((a, b) => (side === "sell" ? a.price - b.price : b.price - a.price));
  }, [extras, market, side, asset, fiat, method, q, amount]);

  const assetOptions = market === "stars" ? ["STARS"] : ["USDT", ...assets.filter((a) => a !== "USDT"), "ALL"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">P2P board</div>
          <h1 className="font-display mt-1 text-3xl font-semibold">{title}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">{subtitle}</p>
        </div>
        <Link href="/sell" className={cn(buttonVariants({ variant: "outline" }))}>
          Post an offer
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <div className="flex rounded-full border border-white/10 p-1">
          {(["sell", "buy"] as Side[]).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-semibold",
                side === s
                  ? s === "sell"
                    ? "bg-buy text-[#042014]"
                    : "bg-sell text-[#2a0610]"
                  : "text-muted",
              )}
            >
              {s === "sell" ? "Buy from merchants" : "Sell to merchants"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl border border-white/8 bg-card p-4 md:grid-cols-5">
        {market !== "stars" ? (
          <Select value={asset} onChange={(e) => setAsset(e.target.value)}>
            {assetOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        ) : (
          <div className="grid h-11 place-items-center rounded-xl border border-white/10 text-sm font-semibold">
            Telegram Stars
          </div>
        )}
        <Select value={fiat} onChange={(e) => setFiat(e.target.value as Fiat)}>
          <option value="BDT">BDT</option>
          <option value="USD">USD</option>
        </Select>
        <Select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="all">All payments</option>
          {methods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <Input
          placeholder={fiat === "BDT" ? "Amount ৳" : "Amount $"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
        />
        <Input placeholder="Search merchant" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
        <div className="hidden grid-cols-12 gap-3 bg-white/4 px-4 py-3 text-[11px] font-semibold tracking-wide text-muted uppercase md:grid">
          <div className="col-span-3">Merchant</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Available</div>
          <div className="col-span-2">Limit</div>
          <div className="col-span-2">Payment</div>
          <div className="col-span-1 text-right">Trade</div>
        </div>
        {rows.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-muted">
            No offers on this filter. Post one from the sell desk.
          </div>
        ) : (
          rows.map((o) => {
            const m = getMerchant(o.merchantId) ?? {
              name: "You",
              verified: false,
              trades: 0,
              completion: 100,
              online: true,
              avgRelease: "—",
            };
            return (
              <div
                key={o.id}
                className="grid gap-3 border-t border-white/6 px-4 py-4 md:grid-cols-12 md:items-center"
              >
                <div className="flex items-center gap-3 md:col-span-3">
                  <Avatar name={m.name} size="sm" online={m.online} />
                  <div>
                    <Link href={`/merchant/${o.merchantId}`} className="flex items-center gap-1 text-sm font-semibold hover:text-mint">
                      {m.name}
                      {m.verified ? <BadgeCheck className="h-3.5 w-3.5 text-mint" /> : null}
                    </Link>
                    <div className="text-[11px] text-muted">
                      {compact(m.trades)} trades · {m.completion}% · {m.avgRelease}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="font-mono text-base font-semibold">
                    {formatFiat(o.price, o.fiat)}
                    <span className="ml-1 text-xs font-normal text-muted">/{o.unit}</span>
                  </div>
                </div>
                <div className="text-sm md:col-span-2">
                  <span className="font-mono">{formatQty(o.available, o.asset === "BTC" ? 4 : 2)}</span>{" "}
                  <span className="text-muted">{o.unit}</span>
                </div>
                <div className="text-sm text-muted md:col-span-2">
                  {formatFiat(o.min, o.fiat)} – {formatFiat(o.max, o.fiat)}
                </div>
                <div className="flex flex-wrap gap-1 md:col-span-2">
                  {o.methods.slice(0, 3).map((p) => (
                    <Badge key={p}>{p}</Badge>
                  ))}
                </div>
                <div className="md:col-span-1 md:text-right">
                  <Link
                    href={`/offer/${o.id}`}
                    className={cn(
                      buttonVariants({
                        variant: side === "sell" ? "buy" : "sell",
                        size: "sm",
                      }),
                    )}
                  >
                    {side === "sell" ? "Buy" : "Sell"}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
