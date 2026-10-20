import { ChannelDetail } from "@/components/channel/channel-detail";

export default async function Page({ params }: PageProps<"/channel/[id]">) {
  const { id } = await params;
  return <ChannelDetail id={id} />;
}
