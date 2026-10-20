"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatFiat, timeAgo } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/store/app-store";
import type { TradeStatus } from "@/types";

const steps: TradeStatus[] = ["awaiting_payment", "paid", "released"];

function tone(status: TradeStatus) {
  if (status === "released") return "buy" as const;
  if (status === "cancelled") return "sell" as const;
  if (status === "paid") return "gold" as const;
  return "mint" as const;
}

function label(status: TradeStatus) {
  return status.replace("_", " ");
}

export function TradeRoom({ id }: { id: string }) {
  const trades = useApp((s) => s.trades);
  const setStatus = useApp((s) => s.setTradeStatus);
  const addMessage = useApp((s) => s.addMessage);
  const trade = trades.find((t) => t.id === id);
  const [text, setText] = useState("");

  const idx = useMemo(
    () => (trade ? Math.max(0, steps.indexOf(trade.status === "cancelled" ? "awaiting_payment" : trade.status)) : 0),
    [trade],
  );

  if (!trade) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Trade not found</h1>
        <p className="mt-2 text-sm text-muted">Trades live in this browser. Open one from an offer.</p>
        <Link href="/p2p" className="mt-4 inline-block text-sm text-mint">
          P2P board
        </Link>
      </div>
    );
  }

  const ticket = trade;

  function send() {
    const body = text.trim();
    if (!body) return;
    addMessage(ticket.id, "me", body);
    setText("");
    window.setTimeout(() => {
      addMessage(ticket.id, "peer", "Noted. Processing on this desk now.");
    }, 700);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-3xl border border-white/8 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
          <div>
            <div className="text-xs text-muted">Trade {trade.id}</div>
            <h1 className="font-display text-2xl font-semibold">{trade.title}</h1>
          </div>
          <Badge tone={tone(trade.status)}>{label(trade.status)}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 px-5 py-4">
          {["Pay", "Confirm paid", "Release"].map((s, i) => (
            <div
              key={s}
              className={`rounded-xl px-3 py-2 text-center text-xs font-semibold ${
                i <= idx ? "bg-mint/15 text-mint" : "bg-white/4 text-muted"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="max-h-[420px] space-y-3 overflow-y-auto px-5 py-4">
          {trade.messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                m.from === "me"
                  ? "ml-auto bg-mint/15 text-foreground"
                  : m.from === "system"
                    ? "mx-auto bg-white/4 text-muted"
                    : "bg-white/6"
              }`}
            >
              <div>{m.text}</div>
              <div className="mt-1 text-[10px] text-muted">{timeAgo(m.at)}</div>
            </div>
          ))}
        </div>
        <form
          className="flex gap-2 border-t border-white/8 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message the desk…"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
      <aside className="h-fit space-y-4 rounded-3xl border border-white/8 bg-card p-5">
        <div className="text-xs tracking-wide text-muted uppercase">Ticket</div>
        <dl className="space-y-2 text-sm">
          <Row k="Counterparty" v={trade.merchantName} />
          <Row k="Side" v={trade.side} />
          <Row k="Amount" v={`${trade.amount} ${trade.asset}`} />
          <Row k="Total" v={formatFiat(trade.total, trade.fiat)} />
          <Row k="Rails" v={trade.methods.join(", ")} />
        </dl>
        <div className="space-y-2 pt-2">
          {trade.status === "awaiting_payment" ? (
            <Button className="w-full" variant="gold" onClick={() => setStatus(trade.id, "paid")}>
              I have paid
            </Button>
          ) : null}
          {trade.status === "paid" ? (
            <Button className="w-full" variant="buy" onClick={() => setStatus(trade.id, "released")}>
              Asset received · release
            </Button>
          ) : null}
          {trade.status !== "released" && trade.status !== "cancelled" ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setStatus(trade.id, "cancelled")}
            >
              Cancel trade
            </Button>
          ) : null}
          {trade.status === "released" ? (
            <p className="text-sm text-buy">Escrow closed. Trade complete.</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
