import { Suspense } from "react";
import { P2PBoard } from "@/components/p2p/p2p-board";

export const metadata = { title: "P2P board" };

export default function Page() {
  return (
    <Suspense fallback={<BoardFallback />}>
      <P2PBoard
        market="all"
        title="All P2P markets"
        subtitle="Crypto and Telegram Stars on one board. Filter by asset, fiat and payment rail."
      />
    </Suspense>
  );
}

function BoardFallback() {
  return <div className="px-4 py-24 text-center text-sm text-muted">Loading board…</div>;
}
