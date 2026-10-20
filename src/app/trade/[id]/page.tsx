import { TradeRoom } from "@/components/trade/trade-room";

export default async function Page({ params }: PageProps<"/trade/[id]">) {
  const { id } = await params;
  return <TradeRoom id={id} />;
}
