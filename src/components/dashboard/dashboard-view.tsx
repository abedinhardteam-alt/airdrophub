"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatFiat, timeAgo } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

export function DashboardView() {
  const user = useApp((s) => s.user);
  const trades = useApp((s) => s.trades);
  const extras = useApp((s) => s.extras);
  const logout = useApp((s) => s.logout);
  const router = useRouter();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Sign in to your desk</h1>
        <p className="mt-2 text-sm text-muted">Offers and trades stay in this browser session.</p>
        <Link href="/login" className={cn(buttonVariants(), "mt-6")}>
          Sign in
        </Link>
      </div>
    );
  }

  const open = trades.filter((t) => t.status === "awaiting_payment" || t.status === "paid");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" online />
          <div>
            <h1 className="font-display text-3xl font-semibold">{user.name}</h1>
            <div className="text-sm text-muted">@{user.handle} · joined {user.joined}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/sell" className={cn(buttonVariants({ variant: "outline" }))}>
            Post offer
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Sign out
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["Open trades", String(open.length)],
          ["Your listings", String(extras.length)],
          ["Completed", String(trades.filter((t) => t.status === "released").length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-white/8 bg-card p-5">
            <div className="text-xs tracking-wide text-muted uppercase">{k}</div>
            <div className="mt-1 font-mono text-2xl font-semibold">{v}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display mt-10 text-xl font-semibold">Trades</h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/8">
        {trades.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted">No trades yet. Open one from the P2P board.</div>
        ) : (
          trades.map((t) => (
            <Link
              key={t.id}
              href={`/trade/${t.id}`}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-white/6 px-4 py-4 first:border-t-0 hover:bg-white/3"
            >
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-xs text-muted">
                  {t.id} · {t.merchantName} · {timeAgo(t.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm">{formatFiat(t.total, t.fiat)}</span>
                <Badge
                  tone={
                    t.status === "released" ? "buy" : t.status === "cancelled" ? "sell" : "gold"
                  }
                >
                  {t.status.replace("_", " ")}
                </Badge>
              </div>
            </Link>
          ))
        )}
      </div>

      <h2 className="font-display mt-10 text-xl font-semibold">Your listings</h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/8">
        {extras.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted">Nothing posted yet.</div>
        ) : (
          extras.map((l) => (
            <Link
              key={l.id}
              href={l.kind === "channel" ? `/channel/${l.id}` : `/offer/${l.id}`}
              className="flex items-center justify-between border-t border-white/6 px-4 py-4 first:border-t-0 hover:bg-white/3"
            >
              <div>
                <div className="font-semibold">
                  {l.kind === "p2p" ? `${l.side} ${l.asset}` : l.kind === "channel" ? l.title : l.title}
                </div>
                <div className="text-xs text-muted">{l.id}</div>
              </div>
              <Badge>{l.kind}</Badge>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
