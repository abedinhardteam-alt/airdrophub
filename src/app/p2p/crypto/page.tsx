import { Suspense } from "react";
import { P2PBoard } from "@/components/p2p/p2p-board";

export const metadata = { title: "Crypto P2P" };

export default function Page() {
  return (
    <Suspense fallback={<div className="px-4 py-24 text-center text-sm text-muted">Loading…</div>}>
      <P2PBoard
        market="crypto"
        title="Crypto P2P"
        subtitle="Buy and sell USDT, BTC, ETH, TON and SOL against BDT and USD. bKash, Nagad, bank and Wise."
      />
    </Suspense>
  );
}
