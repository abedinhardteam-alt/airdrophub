export const metadata = { title: "FAQ" };

const faqs = [
  {
    q: "What can I buy and sell?",
    a: "Crypto (USDT, BTC, ETH, TON, SOL), Telegram Stars, Telegram channel ownership, and digital goods such as Premium, gift cards and bots.",
  },
  {
    q: "Which payment rails are supported?",
    a: "bKash, Nagad, Rocket, local bank transfer, Wise, Binance Pay and USDT TRC20 — depending on the merchant’s offer.",
  },
  {
    q: "How are Telegram Stars delivered?",
    a: "The merchant gifts Stars to the Telegram username you confirm in the trade room after payment is marked.",
  },
  {
    q: "How does a channel sale transfer?",
    a: "Seller assigns owner / creator rights inside Telegram while the ticket is open. You confirm admin before escrow releases.",
  },
  {
    q: "Is this a custodial exchange?",
    a: "No. AirdropHub is a P2P marketplace. Crypto stays on the merchant’s wallet until they send it in-trade.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">FAQ</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="rounded-2xl border border-white/8 bg-card px-5 py-4"
            open
          >
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-sm leading-6 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
