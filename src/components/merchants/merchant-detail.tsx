import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { channelListings, getMerchant, goodsListings, p2pOffers } from "@/data/catalog";
import { compact, formatFiat } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MerchantDetail({ id }: { id: string }) {
  const m = getMerchant(id);
  if (!m) notFound();
  const offers = p2pOffers.filter((o) => o.merchantId === id);
  const channels = channelListings.filter((c) => c.sellerId === id);
  const goods = goodsListings.filter((g) => g.sellerId === id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start gap-5">
        <Avatar name={m.name} size="lg" online={m.online} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-semibold">{m.name}</h1>
            {m.verified ? <BadgeCheck className="h-5 w-5 text-mint" /> : null}
            <Badge tone={m.online ? "live" : "muted"}>{m.online ? "Online" : "Away"}</Badge>
          </div>
          <div className="mt-1 text-sm text-muted">@{m.handle} · on AirdropHub since {m.joined}</div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{m.bio}</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [compact(m.trades), "Trades"],
          [`${m.completion}%`, "Completion"],
          [String(m.rating), "Rating"],
          [m.avgRelease, "Avg release"],
        ].map(([v, k]) => (
          <div key={k} className="rounded-2xl border border-white/8 bg-card p-4">
            <div className="font-mono text-lg font-semibold">{v}</div>
            <div className="text-[11px] tracking-wide text-muted uppercase">{k}</div>
          </div>
        ))}
      </div>
      <h2 className="font-display mt-10 text-xl font-semibold">Live offers</h2>
      <div className="mt-3 divide-y divide-white/6 overflow-hidden rounded-2xl border border-white/8">
        {offers.length === 0 ? (
          <div className="px-4 py-8 text-sm text-muted">No P2P ads right now.</div>
        ) : (
          offers.map((o) => (
            <Link
              key={o.id}
              href={`/offer/${o.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/3"
            >
              <span className="text-sm">
                {o.side} {o.asset} · {o.methods[0]}
              </span>
              <span className="font-mono text-sm">{formatFiat(o.price, o.fiat)}</span>
            </Link>
          ))
        )}
      </div>
      {channels.length ? (
        <>
          <h2 className="font-display mt-10 text-xl font-semibold">Channels</h2>
          <div className="mt-3 space-y-2">
            {channels.map((c) => (
              <Link
                key={c.id}
                href={`/channel/${c.id}`}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-card px-4 py-3"
              >
                <span>
                  {c.title}{" "}
                  <span className="text-mint">{c.username}</span>
                </span>
                <span className="font-mono">{formatFiat(c.priceUsd, "USD")}</span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
      {goods.length ? (
        <>
          <h2 className="font-display mt-10 text-xl font-semibold">Goods</h2>
          <div className="mt-3 space-y-2">
            {goods.map((g) => (
              <Link
                key={g.id}
                href={`/offer/${g.id}`}
                className={cn(
                  "flex items-center justify-between rounded-2xl border border-white/8 bg-card px-4 py-3",
                )}
              >
                <span>{g.title}</span>
                <span className="font-mono">{formatFiat(g.price, g.fiat)}</span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
      <Link href="/p2p" className={cn(buttonVariants({ variant: "outline" }), "mt-10")}>
        Back to board
      </Link>
    </div>
  );
}
