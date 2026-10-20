export const metadata = { title: "Privacy" };

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-sm leading-7 text-muted sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-foreground">Privacy</h1>
      <p className="mt-6">
        This deployment stores your display name, posted offers and trade tickets in local browser
        storage. No password is collected. If you connect a production backend later, merchant KYC
        and payout details would be held only to operate escrow and support.
      </p>
    </article>
  );
}
