"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

const balances = [
  { asset: "USDT", amount: "1,250.00", fiat: "≈ ৳152,937" },
  { asset: "BDT", amount: "84,200", fiat: "local rails" },
  { asset: "Stars", amount: "12,400", fiat: "Telegram" },
  { asset: "TON", amount: "86.4", fiat: "≈ ৳72,748" },
];

export default function Page() {
  const user = useApp((s) => s.user);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Wallet</h1>
      <p className="mt-2 text-sm text-muted">
        Desk balances for the signed-in merchant. P2P still settles peer-to-peer — this is your
        working inventory view.
      </p>
      {!user ? (
        <Link href="/login" className={cn(buttonVariants(), "mt-6")}>
          Sign in
        </Link>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {balances.map((b) => (
            <div key={b.asset} className="rounded-2xl border border-white/8 bg-card p-5">
              <div className="text-xs tracking-wide text-muted uppercase">{b.asset}</div>
              <div className="mt-1 font-mono text-2xl font-semibold">{b.amount}</div>
              <div className="text-xs text-muted">{b.fiat}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
