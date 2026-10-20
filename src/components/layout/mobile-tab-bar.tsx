"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle, Radio, Store, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

const tabs = [
  { href: "/", label: "Home", icon: Store },
  { href: "/p2p", label: "P2P", icon: Radio },
  { href: "/sell", label: "Sell", icon: PlusCircle },
  { href: "/channels", label: "Channels", icon: LayoutGrid },
];

export function MobileTabBar() {
  const path = usePathname();
  const user = useApp((s) => s.user);
  const account = user ? "/dashboard" : "/login";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#07090d]/92 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                on ? "text-mint" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              {t.label}
            </Link>
          );
        })}
        <Link
          href={account}
          className={cn(
            "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
            path.startsWith("/dashboard") || path.startsWith("/login")
              ? "text-mint"
              : "text-muted",
          )}
        >
          <UserRound className="h-5 w-5" />
          Account
        </Link>
      </div>
    </nav>
  );
}
