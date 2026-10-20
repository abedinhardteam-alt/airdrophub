import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const cols = [
  {
    title: "Markets",
    links: [
      { href: "/p2p/crypto", label: "Crypto P2P" },
      { href: "/p2p/stars", label: "Telegram Stars" },
      { href: "/channels", label: "Telegram channels" },
      { href: "/goods", label: "Digital goods" },
    ],
  },
  {
    title: "Trade",
    links: [
      { href: "/sell", label: "Post an offer" },
      { href: "/p2p", label: "P2P board" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/wallet", label: "Wallet" },
    ],
  },
  {
    title: "Desk",
    links: [
      { href: "/how-it-works", label: "How escrow works" },
      { href: "/merchants", label: "Merchants" },
      { href: "/faq", label: "FAQ" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-[#080b10] pb-24 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            Peer-to-peer marketplace for crypto, Telegram Stars, channels and digital goods.
            Escrow on every trade.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
              {c.title}
            </div>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground/85 hover:text-mint">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} AirdropHub. All rights reserved.</span>
          <span>P2P · Escrow · BDT rails · Telegram native</span>
        </div>
      </div>
    </footer>
  );
}
