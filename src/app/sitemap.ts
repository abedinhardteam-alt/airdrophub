import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/p2p",
    "/p2p/crypto",
    "/p2p/stars",
    "/channels",
    "/goods",
    "/sell",
    "/merchants",
    "/how-it-works",
    "/faq",
    "/terms",
    "/privacy",
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
