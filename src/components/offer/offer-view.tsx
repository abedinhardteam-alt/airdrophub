"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { formatFiat, formatQty } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { findListing, listingMerchant, useApp } from "@/store/app-store";

export function OfferView({ id }: { id: string }) {
  const extras = useApp((s) => s.extras);
  const user = useApp((s) => s.user);
  const createTrade = useApp((s) => s.createTrade);
  const listing = findListing(id, extras);
  const merchant = listing ? listingMerchant(listing) : undefined;
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (listing?.kind === "channel") router.replace(`/channel/${listing.id}`);
  }, [listing, router]);

  const computed = useMemo(() => {
    if (!listing) return null;
    if (listing.kind === "p2p") {
      const qty = Number(amount);
      if (!qty) return { total: 0, qty: 0 };
      return { qty, total: qty * listing.price };
    }
    if (listing.kind === "goods") {
      const qty = Math.max(1, Number(amount) || 1);
      return { qty, total: qty * listing.price };
    }
    return { qty: 1, total: listing.kind === "channel" ? listing.priceUsd : 0 };
  }, [listing, amount]);

  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Offer not found</h1>
        <Link href="/p2p" className="mt-4 inline-block text-sm text-mint">
          Back to P2P
        </Link>
      </div>
    );
  }

  if (listing.kind === "channel") {
    return (
      <div className="px-4 py-20 text-center text-sm text-muted">Opening channel listing…</div>
    );
  }

  function startTrade() {
    if (!listing) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (listing.kind === "p2p") {
      const qty = Number(amount);
      if (!qty || qty <= 0) {
        setErr("Enter an amount.");
        return;
      }
      const total = qty * listing.price;
      if (total < listing.min || total > listing.max) {
        setErr(`Limit is ${formatFiat(listing.min, listing.fiat)} – ${formatFiat(listing.max, listing.fiat)}.`);
        return;
      }
      const tradeId = createTrade({
        listing,
        amount: qty,
        total,
        side: listing.side === "sell" ? "buy" : "sell",
        asset: listing.asset,
        fiat: listing.fiat,
        methods: listing.methods,
        title: `${listing.asset} P2P`,
        merchantName: merchant?.name ?? "Merchant",
        market: listing.market,
      });
      router.push(`/trade/${tradeId}`);
      return;
    }
    if (listing.kind === "goods") {
      const qty = Math.max(1, Number(amount) || 1);
      const tradeId = createTrade({
        listing,
        amount: qty,
        total: qty * listing.price,
        side: "buy",
        asset: listing.title,
        fiat: listing.fiat,
        methods: ["bKash", "Nagad", "Wise"],
        title: listing.title,
        merchantName: merchant?.name ?? "Seller",
        market: "goods",
      });
      router.push(`/trade/${tradeId}`);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="text-xs text-muted">
          <Link href="/p2p" className="hover:text-mint">
            P2P
          </Link>{" "}
          / {listing.id}
        </div>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          {listing.kind === "p2p"
            ? `${listing.side === "sell" ? "Buy" : "Sell"} ${listing.asset}`
            : listing.title}
        </h1>
        {listing.kind === "p2p" ? (
          <p className="mt-2 text-muted">
            {listing.side === "sell"
              ? `Merchant sells ${listing.asset} for ${listing.fiat}.`
              : `Merchant buys ${listing.asset} for ${listing.fiat}.`}
          </p>
        ) : listing.kind === "goods" ? (
          <p className="mt-2 text-muted">{listing.description}</p>
        ) : null}

        {merchant ? (
          <Link
            href={`/merchant/${merchant.id}`}
            className="mt-6 flex items-center gap-4 rounded-2xl border border-white/8 bg-card p-4 hover:border-mint/25"
          >
            <Avatar name={merchant.name} online={merchant.online} size="lg" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-lg font-semibold">
                {merchant.name}
                {merchant.verified ? <BadgeCheck className="h-4 w-4 text-mint" /> : null}
              </div>
              <div className="text-sm text-muted">
                {merchant.trades.toLocaleString()} trades · {merchant.completion}% completion · avg release{" "}
                {merchant.avgRelease}
              </div>
            </div>
            <Badge tone={merchant.online ? "live" : "muted"}>
              {merchant.online ? "Online" : "Offline"}
            </Badge>
          </Link>
        ) : null}

        {listing.kind === "p2p" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Price", `${formatFiat(listing.price, listing.fiat)} / ${listing.unit}`],
              ["Available", `${formatQty(listing.available)} ${listing.unit}`],
              [
                "Limit",
                `${formatFiat(listing.min, listing.fiat)} – ${formatFiat(listing.max, listing.fiat)}`,
              ],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-white/8 bg-card p-4">
                <div className="text-xs tracking-wide text-muted uppercase">{k}</div>
                <div className="mt-1 font-mono text-sm font-semibold">{v}</div>
              </div>
            ))}
          </div>
        ) : listing.kind === "goods" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-card p-4">
              <div className="text-xs tracking-wide text-muted uppercase">Price</div>
              <div className="mt-1 font-mono text-xl font-semibold">
                {formatFiat(listing.price, listing.fiat)}
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-card p-4">
              <div className="text-xs tracking-wide text-muted uppercase">Stock</div>
              <div className="mt-1 font-mono text-xl font-semibold">{listing.stock}</div>
            </div>
          </div>
        ) : null}

        {listing.kind === "p2p" ? (
          <div className="mt-6">
            <div className="text-xs tracking-wide text-muted uppercase">Payment methods</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {listing.methods.map((m) => (
                <Badge key={m} tone="mint">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-mint/20 bg-mint/5 p-4 text-sm leading-6 text-muted">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
          Escrow opens when you confirm. Do not pay outside the trade room. Release only after the
          asset (crypto, Stars gift, or goods) is in your hands.
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-white/10 bg-card p-5">
        <div className="font-display text-lg font-semibold">
          {listing.kind === "p2p"
            ? listing.side === "sell"
              ? "Buy now"
              : "Sell now"
            : "Checkout"}
        </div>
        {listing.kind === "p2p" ? (
          <>
            <Label className="mt-4">Amount ({listing.unit})</Label>
            <Input
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErr("");
              }}
              placeholder="0.00"
              inputMode="decimal"
            />
            <div className="mt-3 flex justify-between text-sm text-muted">
              <span>You {listing.side === "sell" ? "pay" : "receive"}</span>
              <span className="font-mono text-foreground">
                {computed ? formatFiat(computed.total, listing.fiat) : "—"}
              </span>
            </div>
          </>
        ) : listing.kind === "goods" ? (
          <>
            <Label className="mt-4">Quantity</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1"
              inputMode="numeric"
            />
            <div className="mt-3 flex justify-between text-sm text-muted">
              <span>Total</span>
              <span className="font-mono text-foreground">
                {computed ? formatFiat(computed.total, listing.fiat) : "—"}
              </span>
            </div>
          </>
        ) : null}
        {err ? <p className="mt-2 text-sm text-sell">{err}</p> : null}
        <Button
          className="mt-5 w-full"
          variant={listing.kind === "p2p" && listing.side === "buy" ? "sell" : "buy"}
          onClick={startTrade}
        >
          {user ? "Open escrow trade" : "Sign in to trade"}
        </Button>
      </aside>
    </div>
  );
}
