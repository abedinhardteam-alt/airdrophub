import { Suspense } from "react";
import { P2PBoard } from "@/components/p2p/p2p-board";

export const metadata = { title: "Telegram Stars" };

export default function Page() {
  return (
    <Suspense fallback={<div className="px-4 py-24 text-center text-sm text-muted">Loading…</div>}>
      <P2PBoard
        market="stars"
        title="Telegram Stars"
        subtitle="Peer-to-peer Stars. Gift delivered in the trade room after you mark paid."
      />
    </Suspense>
  );
}
