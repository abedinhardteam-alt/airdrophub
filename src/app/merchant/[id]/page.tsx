import { MerchantDetail } from "@/components/merchants/merchant-detail";

export default async function Page({ params }: PageProps<"/merchant/[id]">) {
  const { id } = await params;
  return <MerchantDetail id={id} />;
}
