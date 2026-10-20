"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { niches } from "@/data/catalog";
import { compact, formatFiat } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { allListings, isChannel, useApp } from "@/store/app-store";

export function ChannelGrid() {
  const extras = useApp((s) => s.extras);
  const [niche, setNiche] = useState("all");
  const [q, setQ] = useState("");
  const [minSubs, setMinSubs] = useState("");

  const rows = useMemo(() => {
    const min = Number(minSubs) || 0;
    return allListings(extras)
      .filter(isChannel)
      .filter((c) => niche === "all" || c.niche === niche)
      .filter((c) => c.subscribers >= min)
      .filter((c) =>
        `${c.title} ${c.username} ${c.niche} ${c.description}`.toLowerCase().includes(q.toLowerCase()),
      );
  }, [extras, niche, q, minSubs]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">
            Marketplace
          </div>
          <h1 className="font-display mt-1 text-3xl font-semibold">Telegram channels</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Buy and sell channel ownership. Escrow holds funds until admin / creator transfer is confirmed.
          </p>
        </div>
        <Link href="/sell" className={cn(buttonVariants({ variant: "outline" }))}>
          List a channel
        </Link>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Input placeholder="Search @username or niche" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={niche} onChange={(e) => setNiche(e.target.value)}>
          <option value="all">All niches</option>
          {niches.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Min subscribers"
          value={minSubs}
          onChange={(e) => setMinSubs(e.target.value)}
          inputMode="numeric"
        />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((c) => (
          <Link
            key={c.id}
            href={`/channel/${c.id}`}
            className="flex flex-col rounded-3xl border border-white/8 bg-card p-5 hover:border-mint/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg font-semibold">{c.title}</div>
                <div className="text-sm text-mint">{c.username}</div>
              </div>
              {c.verified ? <Badge tone="mint">Verified</Badge> : <Badge>{c.language}</Badge>}
            </div>
            <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-muted">{c.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                [compact(c.subscribers), "subs"],
                [compact(c.avgReach), "reach"],
                [`${c.postsPerDay}/d`, "posts"],
              ].map(([v, k]) => (
                <div key={k} className="rounded-xl bg-white/4 py-2">
                  <div className="font-mono text-sm font-semibold">{v}</div>
                  <div className="text-[10px] tracking-wide text-muted uppercase">{k}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <Badge>{c.niche}</Badge>
              <span className="font-mono text-lg font-semibold">{formatFiat(c.priceUsd, "USD")}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
