"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { assets, goodsCategories, methods, niches } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useApp } from "@/store/app-store";
import type { ChannelListing, Fiat, GoodsListing, Listing, P2POffer, Side } from "@/types";

export function SellForm() {
  const user = useApp((s) => s.user);
  const addListing = useApp((s) => s.addListing);
  const router = useRouter();
  const [tab, setTab] = useState<"crypto" | "stars" | "channels" | "goods">("crypto");
  const [msg, setMsg] = useState("");

  function id(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }

  function publish(listing: Listing) {
    if (!user) {
      router.push("/login");
      return;
    }
    addListing(listing);
    setMsg("Offer is live on the board.");
    if (listing.kind === "channel") router.push(`/channel/${listing.id}`);
    else router.push(`/offer/${listing.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">Sell desk</div>
      <h1 className="font-display mt-1 text-3xl font-semibold">Post an offer</h1>
      <p className="mt-2 text-sm text-muted">
        List crypto, Stars, a Telegram channel, or digital goods. Escrow applies the moment a buyer
        locks the trade.
      </p>
      {!user ? (
        <p className="mt-4 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm">
          Sign in first — offers are tied to your merchant handle.
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["crypto", "Crypto"],
            ["stars", "Stars"],
            ["channels", "Channel"],
            ["goods", "Goods"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`h-9 rounded-full px-4 text-sm font-semibold ${
              tab === k ? "bg-mint text-[#06241c]" : "border border-white/10 text-muted"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "crypto" || tab === "stars" ? (
        <P2PFields
          market={tab}
          onSubmit={(data) =>
            publish({
              kind: "p2p",
              id: id(tab === "stars" ? "AH-S" : "AH-C"),
              market: tab,
              merchantId: user?.id ?? "you",
              ...data,
            })
          }
        />
      ) : null}
      {tab === "channels" ? (
        <ChannelFields
          onSubmit={(data) =>
            publish({
              kind: "channel",
              id: id("AH-CH"),
              sellerId: user?.id ?? "you",
              ...data,
            })
          }
        />
      ) : null}
      {tab === "goods" ? (
        <GoodsFields
          onSubmit={(data) =>
            publish({
              kind: "goods",
              id: id("AH-G"),
              sellerId: user?.id ?? "you",
              ...data,
            })
          }
        />
      ) : null}
      {msg ? <p className="mt-4 text-sm text-mint">{msg}</p> : null}
    </div>
  );
}

function P2PFields({
  market,
  onSubmit,
}: {
  market: "crypto" | "stars";
  onSubmit: (d: Omit<P2POffer, "kind" | "id" | "market" | "merchantId">) => void;
}) {
  const [side, setSide] = useState<Side>("sell");
  const [asset, setAsset] = useState(market === "stars" ? "STARS" : "USDT");
  const [fiat, setFiat] = useState<Fiat>("BDT");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [pays, setPays] = useState<string[]>(["bKash", "Nagad"]);

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          side,
          asset,
          unit: market === "stars" ? "Stars" : asset,
          fiat,
          price: Number(price),
          available: Number(available),
          min: Number(min),
          max: Number(max),
          methods: pays,
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Side</Label>
          <Select value={side} onChange={(e) => setSide(e.target.value as Side)}>
            <option value="sell">I sell (others buy)</option>
            <option value="buy">I buy (others sell)</option>
          </Select>
        </div>
        <div>
          <Label>Asset</Label>
          <Select value={asset} onChange={(e) => setAsset(e.target.value)} disabled={market === "stars"}>
            {market === "stars" ? (
              <option>STARS</option>
            ) : (
              assets.map((a) => (
                <option key={a}>{a}</option>
              ))
            )}
          </Select>
        </div>
        <div>
          <Label>Fiat</Label>
          <Select value={fiat} onChange={(e) => setFiat(e.target.value as Fiat)}>
            <option>BDT</option>
            <option>USD</option>
          </Select>
        </div>
        <div>
          <Label>Price per unit</Label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label>Available</Label>
          <Input value={available} onChange={(e) => setAvailable(e.target.value)} required />
        </div>
        <div>
          <Label>Min order ({fiat})</Label>
          <Input value={min} onChange={(e) => setMin(e.target.value)} required />
        </div>
        <div>
          <Label>Max order ({fiat})</Label>
          <Input value={max} onChange={(e) => setMax(e.target.value)} required />
        </div>
      </div>
      <div>
        <Label>Payment methods</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {methods.map((m) => {
            const on = pays.includes(m);
            return (
              <button
                type="button"
                key={m}
                onClick={() => setPays(on ? pays.filter((x) => x !== m) : [...pays, m])}
                className={`h-8 rounded-full px-3 text-xs font-semibold ${
                  on ? "bg-mint/15 text-mint ring-1 ring-mint/30" : "bg-white/5 text-muted"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
      <Button type="submit" className="w-full">
        Publish offer
      </Button>
    </form>
  );
}

function ChannelFields({
  onSubmit,
}: {
  onSubmit: (d: Omit<ChannelListing, "kind" | "id" | "sellerId">) => void;
}) {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [niche, setNiche] = useState(niches[0]);
  const [subs, setSubs] = useState("");
  const [reach, setReach] = useState("");
  const [posts, setPosts] = useState("3");
  const [language, setLanguage] = useState("EN");
  const [price, setPrice] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          username: username.startsWith("@") ? username : `@${username}`,
          niche,
          subscribers: Number(subs),
          avgReach: Number(reach),
          postsPerDay: Number(posts),
          language,
          priceUsd: Number(price),
          age,
          verified: false,
          description,
          highlights: ["Seller listed", "Escrow transfer", "Username included"],
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Channel name</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Username</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@yourchannel" required />
        </div>
        <div>
          <Label>Niche</Label>
          <Select value={niche} onChange={(e) => setNiche(e.target.value)}>
            {niches.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Subscribers</Label>
          <Input value={subs} onChange={(e) => setSubs(e.target.value)} required />
        </div>
        <div>
          <Label>Avg reach</Label>
          <Input value={reach} onChange={(e) => setReach(e.target.value)} required />
        </div>
        <div>
          <Label>Posts / day</Label>
          <Input value={posts} onChange={(e) => setPosts(e.target.value)} />
        </div>
        <div>
          <Label>Age</Label>
          <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="1y 2m" />
        </div>
        <div>
          <Label>Language</Label>
          <Input value={language} onChange={(e) => setLanguage(e.target.value)} />
        </div>
        <div>
          <Label>Price USD</Label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
      </div>
      <Button type="submit" className="w-full">
        List channel
      </Button>
    </form>
  );
}

function GoodsFields({
  onSubmit,
}: {
  onSubmit: (d: Omit<GoodsListing, "kind" | "id" | "sellerId">) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(goodsCategories[0]);
  const [price, setPrice] = useState("");
  const [fiat, setFiat] = useState<Fiat>("BDT");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");
  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          category,
          price: Number(price),
          fiat,
          stock: Number(stock),
          description,
        });
      }}
    >
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Category</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {goodsCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Fiat</Label>
          <Select value={fiat} onChange={(e) => setFiat(e.target.value as Fiat)}>
            <option>BDT</option>
            <option>USD</option>
          </Select>
        </div>
        <div>
          <Label>Price</Label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label>Stock</Label>
          <Input value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        List item
      </Button>
    </form>
  );
}
