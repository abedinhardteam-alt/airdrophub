import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { merchants } from "@/data/catalog";
import { compact } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MerchantList() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">Desks</div>
      <h1 className="font-display mt-1 text-3xl font-semibold">Merchants</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Verified OTC and Stars desks. Completion, release time and online status on every card.
      </p>
      <div className="mt-8 space-y-3">
        {merchants.map((m) => (
          <Link
            key={m.id}
            href={`/merchant/${m.id}`}
            className="flex items-center gap-4 rounded-2xl border border-white/8 bg-card px-4 py-4 hover:border-mint/25"
          >
            <Avatar name={m.name} online={m.online} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-semibold">
                {m.name}
                {m.verified ? <BadgeCheck className="h-4 w-4 text-mint" /> : null}
                <Badge tone={m.online ? "live" : "muted"}>{m.online ? "Online" : "Away"}</Badge>
              </div>
              <div className="truncate text-sm text-muted">{m.bio}</div>
            </div>
            <div className="hidden text-right sm:block">
              <div className="font-mono text-sm">{m.completion}%</div>
              <div className="text-xs text-muted">{compact(m.trades)} trades</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
