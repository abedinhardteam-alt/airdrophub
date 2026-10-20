"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { compact, formatFiat } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { findListing, listingMerchant, useApp } from "@/store/app-store";

export function ChannelDetail({ id }: { id: string }) {
  const extras = useApp((s) => s.extras);
  const user = useApp((s) => s.user);
  const createTrade = useApp((s) => s.createTrade);
  const listing = findListing(id, extras);
  const router = useRouter();

  if (!listing || listing.kind !== "channel") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Channel not found</h1>
        <Link href="/channels" className="mt-4 inline-block text-sm text-mint">
          Back to channels
        </Link>
      </div>
    );
  }

  const channel = listing;
  const seller = listingMerchant(channel);

  function buy() {
    if (!user) {
      router.push("/login");
      return;
    }
    const tradeId = createTrade({
      listing: channel,
      amount: 1,
      total: channel.priceUsd,
      side: "buy",
      asset: channel.username,
      fiat: "USD",
      methods: ["Wise", "USDT TRC20", "Bank Transfer"],
      title: channel.title,
      merchantName: seller?.name ?? "Seller",
      market: "channels",
    });
    router.push(`/trade/${tradeId}`);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
      <div>
        <Link href="/channels" className="text-xs text-muted hover:text-mint">
          Channels
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge>{listing.niche}</Badge>
          {listing.verified ? <Badge tone="mint">Verified listing</Badge> : null}
          <Badge tone="muted">{listing.language}</Badge>
        </div>
        <h1 className="font-display mt-3 text-4xl font-semibold">{listing.title}</h1>
        <div className="mt-1 text-lg text-mint">{listing.username}</div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{listing.description}</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [compact(listing.subscribers), "Subscribers"],
            [compact(listing.avgReach), "Avg reach"],
            [`${listing.postsPerDay}/day`, "Posts"],
            [listing.age, "Age"],
          ].map(([v, k]) => (
            <div key={k} className="rounded-2xl border border-white/8 bg-card p-4">
              <div className="font-mono text-lg font-semibold">{v}</div>
              <div className="text-[11px] tracking-wide text-muted uppercase">{k}</div>
            </div>
          ))}
        </div>
        <ul className="mt-8 space-y-2">
          {listing.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              {h}
            </li>
          ))}
        </ul>
        {seller ? (
          <Link
            href={`/merchant/${seller.id}`}
            className="mt-8 flex items-center gap-3 rounded-2xl border border-white/8 bg-card p-4"
          >
            <Avatar name={seller.name} online={seller.online} />
            <div>
              <div className="flex items-center gap-1 font-semibold">
                {seller.name}
                {seller.verified ? <BadgeCheck className="h-4 w-4 text-mint" /> : null}
              </div>
              <div className="text-xs text-muted">{seller.bio}</div>
            </div>
          </Link>
        ) : null}
      </div>
      <aside className="h-fit rounded-3xl border border-white/10 bg-card p-5">
        <div className="text-xs tracking-wide text-muted uppercase">Asking price</div>
        <div className="font-display mt-1 text-4xl font-semibold">
          {formatFiat(listing.priceUsd, "USD")}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          Ownership transfer via Telegram (creator / owners). Escrow releases after you confirm admin.
        </p>
        <Button className="mt-5 w-full" variant="buy" onClick={buy}>
          {user ? "Buy this channel" : "Sign in to buy"}
        </Button>
        <div className="mt-4 flex gap-2 text-xs leading-5 text-muted">
          <ShieldCheck className="h-4 w-4 shrink-0 text-mint" />
          Do not accept off-platform transfers. Username is part of the listing.
        </div>
      </aside>
    </div>
  );
}
