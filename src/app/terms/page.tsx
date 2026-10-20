export const metadata = { title: "Terms" };

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-sm leading-7 text-muted sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-foreground">Terms of use</h1>
      <p className="mt-6">
        AirdropHub is a peer-to-peer marketplace. You trade with other users. Listings, chat and
        escrow tickets in this demo persist in your browser. Do not send funds to anyone who asks
        you to leave the trade room. Channel and Stars transfers follow Telegram’s own product
        rules. You are responsible for the legality of assets you list in your jurisdiction.
      </p>
      <p className="mt-4">
        Offers may be removed for fraud, misrepresentation of subscriber counts, or payment-rail
        abuse. Completed trades are final once both parties confirm release.
      </p>
    </article>
  );
}
