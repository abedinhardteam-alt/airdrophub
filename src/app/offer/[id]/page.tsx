import { OfferView } from "@/components/offer/offer-view";

export default async function Page({ params }: PageProps<"/offer/[id]">) {
  const { id } = await params;
  return <OfferView id={id} />;
}
