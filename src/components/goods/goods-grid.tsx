"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { goodsCategories } from "@/data/catalog";
import { formatFiat } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { allListings, isGoods, listingMerchant, useApp } from "@/store/app-store";

export function GoodsGrid() {
  const extras = useApp((s) => s.extras);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      allListings(extras)
        .filter(isGoods)
        .filter((g) => cat === "all" || g.category === cat)
        .filter((g) => `${g.title} ${g.category} ${g.description}`.toLowerCase().includes(q.toLowerCase())),
    [extras, cat, q],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">
            Marketplace
          </div>
          <h1 className="font-display mt-1 text-3xl font-semibold">Digital goods</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Gift cards, Telegram Premium, bots and tools. Same escrow room as crypto and Stars.
          </p>
        </div>
        <Link href="/sell" className={cn(buttonVariants({ variant: "outline" }))}>
          List an item
        </Link>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Input placeholder="Search goods" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">All categories</option>
          {goodsCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((g) => {
          const m = listingMerchant(g);
          return (
            <Link
              key={g.id}
              href={`/offer/${g.id}`}
              className="rounded-3xl border border-white/8 bg-card p-5 hover:border-mint/30"
            >
              <Badge>{g.category}</Badge>
              <div className="font-display mt-3 text-lg font-semibold">{g.title}</div>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{g.description}</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="font-mono text-xl font-semibold">{formatFiat(g.price, g.fiat)}</div>
                  <div className="text-xs text-muted">{g.stock} in stock · {m?.name ?? "Seller"}</div>
                </div>
                <span className={cn(buttonVariants({ size: "sm", variant: "buy" }))}>Buy</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
