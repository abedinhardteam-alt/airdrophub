"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Lock,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Timer,
  Zap,
} from "lucide-react";
import { channelListings, merchants, p2pOffers, tickerPrints } from "@/data/catalog";
import { compact, formatFiat, formatQty } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getMerchant } from "@/data/catalog";

const markets = [
  {
    href: "/p2p/crypto",
    kicker: "P2P",
    title: "Crypto",
    copy: "USDT, BTC, ETH, TON and SOL against BDT and USD. Local rails.",
    stat: "$4.2M / 24h",
    icon: Radio,
  },
  {
    href: "/p2p/stars",
    kicker: "P2P",
    title: "Telegram Stars",
    copy: "Buy or sell Stars in bulk. Gift delivery inside the trade room.",
    stat: "1.8M Stars",
    icon: Star,
  },
  {
    href: "/channels",
    kicker: "Marketplace",
    title: "Telegram channels",
    copy: "Ownership transfer with escrow. Subs, reach and niche, listed.",
    stat: "48 live listings",
    icon: Sparkles,
  },
  {
    href: "/goods",
    kicker: "Marketplace",
    title: "Digital goods",
    copy: "Premium, gift cards, bots and aged accounts — same desk.",
    stat: "Escrow included",
    icon: Store,
  },
];

export function HomePage() {
  const usdt = p2pOffers.filter((o) => o.asset === "USDT" && o.fiat === "BDT" && o.side === "sell");
  const featured = channelListings.slice(0, 3);
  const desks = merchants.filter((m) => m.verified).slice(0, 4);

  return (
    <div>
      <div className="overflow-hidden border-b border-white/8">
        <div className="flex ticker whitespace-nowrap py-2 text-xs text-muted">
          {[...tickerPrints, ...tickerPrints].map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2">
              <span className={t.side === "buy" ? "text-buy" : "text-sell"}>
                {t.side.toUpperCase()}
              </span>
              <span className="text-foreground/80">{t.pair}</span>
              <span>{t.amount}</span>
              <span className="font-mono text-foreground">{t.price}</span>
            </span>
          ))}
        </div>
      </div>

      <section className="relative overflow-hidden bg-radial">
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <Badge tone="live">Live P2P desk · escrow on every trade</Badge>
            <h1 className="font-display mt-5 max-w-xl text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-[56px]">
              Buy and sell crypto, Stars, and Telegram channels.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg">
              AirdropHub is the professional marketplace for OTC crypto, Telegram Stars,
              channel ownership and digital goods. Peer to peer. BDT rails. Release on confirmation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/p2p" className={cn(buttonVariants({ size: "lg" }))}>
                Browse P2P <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sell" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Post an offer
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/8 pt-8">
              {[
                ["24h volume", "$4.28M"],
                ["Completion", "99.1%"],
                ["Avg release", "2m 14s"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs tracking-wide text-muted uppercase">{k}</div>
                  <div className="mt-1 font-mono text-lg font-semibold">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs tracking-wide text-muted uppercase">Best USDT / BDT</div>
                <div className="font-display text-xl font-semibold">Sell board</div>
              </div>
              <Link href="/p2p/crypto" className="text-sm font-semibold text-mint">
                Full book
              </Link>
            </div>
            <div className="space-y-2">
              {usdt.slice(0, 4).map((o) => {
                const m = getMerchant(o.merchantId);
                return (
                  <Link
                    key={o.id}
                    href={`/offer/${o.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/3 px-3 py-3 hover:border-mint/25 hover:bg-white/5"
                  >
                    <Avatar name={m.name} size="sm" online={m.online} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        {m.name}
                        {m.verified ? <BadgeCheck className="h-3.5 w-3.5 text-mint" /> : null}
                      </div>
                      <div className="truncate text-[11px] text-muted">
                        {compact(m.trades)} trades · {m.completion}% · {o.methods[0]}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-mint">
                        {formatFiat(o.price, o.fiat)}
                      </div>
                      <div className="text-[11px] text-muted">{formatQty(o.available, 0)} USDT</div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/p2p/crypto"
              className={cn(buttonVariants({ variant: "buy", size: "md" }), "mt-4 w-full")}
            >
              Buy USDT
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">
              Markets
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold">Everything the desk trades.</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {markets.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="group rounded-3xl border border-white/8 bg-card p-5 transition hover:border-mint/30 hover:bg-card-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5 text-[11px] tracking-wide text-muted uppercase">{m.kicker}</div>
                <div className="font-display mt-1 text-xl font-semibold">{m.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{m.copy}</p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="font-mono text-mint">{m.stat}</span>
                  <ArrowRight className="h-4 w-4 text-muted transition group-hover:text-mint group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#0a0e14]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              Escrow
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold">Three steps. Asset moves, then money releases.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              AirdropHub holds the trade until both sides confirm. Crypto, Stars gifts, and
              channel ownership all follow the same room.
            </p>
          </div>
          <ol className="space-y-4">
            {[
              {
                icon: Zap,
                t: "Lock the offer",
                d: "Amount and price freeze. Counterparty details and payment rails appear in the trade room.",
              },
              {
                icon: Lock,
                t: "Pay inside the window",
                d: "Buyer pays via bKash, Nagad, bank, Wise or on-chain. Mark paid. Chat stays on the ticket.",
              },
              {
                icon: ShieldCheck,
                t: "Release on delivery",
                d: "Seller sends USDT, Stars or channel admin. Buyer confirms. Escrow closes.",
              },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-4 rounded-2xl border border-white/8 bg-card p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-mint">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    0{i + 1} · {s.t}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">
              Channels
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold">Telegram inventory on the book.</h2>
          </div>
          <Link href="/channels" className="hidden text-sm font-semibold text-mint sm:block">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((c) => (
            <Link
              key={c.id}
              href={`/channel/${c.id}`}
              className="rounded-3xl border border-white/8 bg-card p-5 hover:border-mint/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-semibold">{c.title}</div>
                  <div className="text-sm text-mint">{c.username}</div>
                </div>
                {c.verified ? <Badge tone="mint">Verified</Badge> : <Badge>Listed</Badge>}
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted">{c.description}</p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  [compact(c.subscribers), "subs"],
                  [compact(c.avgReach), "reach"],
                  [c.age, "age"],
                ].map(([v, k]) => (
                  <div key={k} className="rounded-xl bg-white/4 py-2">
                    <div className="font-mono text-sm font-semibold">{v}</div>
                    <div className="text-[10px] tracking-wide text-muted uppercase">{k}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-muted">{c.niche}</span>
                <span className="font-mono text-lg font-semibold">{formatFiat(c.priceUsd, "USD")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/8 bg-[#0a0e14]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                Desks
              </div>
              <h2 className="font-display mt-2 text-3xl font-semibold">Verified merchants.</h2>
            </div>
            <Link href="/merchants" className="text-sm font-semibold text-mint">
              All merchants
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {desks.map((m) => (
              <Link
                key={m.id}
                href={`/merchant/${m.id}`}
                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-card px-4 py-4 hover:border-mint/25"
              >
                <Avatar name={m.name} online={m.online} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    {m.name}
                    <BadgeCheck className="h-4 w-4 text-mint" />
                  </div>
                  <div className="truncate text-xs text-muted">{m.bio}</div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="font-mono text-sm">{m.completion}%</div>
                  <div className="flex items-center justify-end gap-1 text-xs text-muted">
                    <Timer className="h-3 w-3" /> {m.avgRelease}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
