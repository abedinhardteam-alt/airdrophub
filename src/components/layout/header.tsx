"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

const markets = [
  { href: "/p2p/crypto", label: "Crypto P2P", hint: "USDT, BTC, TON" },
  { href: "/p2p/stars", label: "Telegram Stars", hint: "Stars for BDT / USD" },
  { href: "/channels", label: "Telegram channels", hint: "Buy & sell ownership" },
  { href: "/goods", label: "Digital goods", hint: "Premium, cards, bots" },
];

const links = [
  { href: "/p2p", label: "P2P board" },
  { href: "/channels", label: "Channels" },
  { href: "/merchants", label: "Merchants" },
  { href: "/how-it-works", label: "Escrow" },
];

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const user = useApp((s) => s.user);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [marketsOpen, setMarketsOpen] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/p2p?q=${encodeURIComponent(query)}` : "/p2p");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setMarketsOpen(true)}
            onMouseLeave={() => setMarketsOpen(false)}
          >
            <button
              className={cn(
                "flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-muted hover:bg-white/5 hover:text-foreground",
                marketsOpen && "bg-white/5 text-foreground",
              )}
            >
              Markets <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {marketsOpen ? (
              <div className="absolute left-0 top-full w-72 pt-2">
                <div className="rounded-2xl border border-white/10 bg-[#0e1218] p-2 shadow-2xl">
                  {markets.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      className="block rounded-xl px-3 py-2.5 hover:bg-white/5"
                    >
                      <div className="text-sm font-semibold">{m.label}</div>
                      <div className="text-xs text-muted">{m.hint}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "h-9 rounded-full px-3 text-sm font-medium leading-9 text-muted hover:bg-white/5 hover:text-foreground",
                path === l.href && "bg-white/6 text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={submit} className="ml-auto hidden max-w-sm flex-1 md:flex">
          <label className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search USDT, Stars, channels…"
              className="h-10 w-full rounded-full border border-white/10 bg-white/4 pl-9 pr-4 text-sm outline-none placeholder:text-muted/70 focus:border-mint/40"
            />
          </label>
        </form>
        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <Link
            href="/sell"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}
          >
            Post offer
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            >
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/login" className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
              Sign in
            </Link>
          )}
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-white/8 px-4 py-4 lg:hidden">
          <form onSubmit={submit} className="mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search markets"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/4 px-3 text-sm outline-none"
            />
          </form>
          <div className="grid gap-1">
            {[...markets, ...links, { href: "/sell", label: "Post offer", hint: "" }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
