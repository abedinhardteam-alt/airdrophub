export const metadata = { title: "How escrow works" };

const lanes = [
  {
    title: "Crypto P2P",
    steps: [
      "Lock a USDT / BTC / TON offer at the listed price.",
      "Pay the merchant via bKash, Nagad, bank, Wise or on-chain.",
      "Merchant releases the crypto. You confirm. Escrow closes.",
    ],
  },
  {
    title: "Telegram Stars",
    steps: [
      "Lock Stars at the per-star rate.",
      "Pay the listed rail and mark paid in the room.",
      "Merchant gifts Stars to your Telegram username. You confirm delivery.",
    ],
  },
  {
    title: "Telegram channels",
    steps: [
      "Lock the listing. Funds sit in escrow.",
      "Seller transfers creator / owner rights to the buyer.",
      "Buyer confirms admin. Escrow releases to the seller.",
    ],
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">Protocol</div>
      <h1 className="font-display mt-2 text-4xl font-semibold">How AirdropHub escrow works</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Every trade opens a ticket. Price and quantity freeze. Chat, payment proof and release live
        on that ticket — crypto, Stars and channel ownership use the same room.
      </p>
      <div className="mt-10 space-y-6">
        {lanes.map((l) => (
          <section key={l.title} className="rounded-3xl border border-white/8 bg-card p-6">
            <h2 className="font-display text-xl font-semibold">{l.title}</h2>
            <ol className="mt-4 space-y-3">
              {l.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm leading-6">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint/15 text-xs font-bold text-mint">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
