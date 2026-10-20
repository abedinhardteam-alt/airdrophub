export type Fiat = "BDT" | "USD";
export type Side = "buy" | "sell";
export type MarketKey = "crypto" | "stars" | "channels" | "goods";

export type TradeStatus =
  | "awaiting_payment"
  | "paid"
  | "released"
  | "cancelled";

export type Merchant = {
  id: string;
  name: string;
  handle: string;
  verified: boolean;
  trades: number;
  completion: number;
  rating: number;
  avgRelease: string;
  joined: string;
  bio: string;
  online: boolean;
};

export type P2POffer = {
  kind: "p2p";
  id: string;
  market: "crypto" | "stars";
  merchantId: string;
  side: Side;
  asset: string;
  unit: string;
  fiat: Fiat;
  price: number;
  available: number;
  min: number;
  max: number;
  methods: string[];
};

export type ChannelListing = {
  kind: "channel";
  id: string;
  sellerId: string;
  title: string;
  username: string;
  niche: string;
  subscribers: number;
  avgReach: number;
  postsPerDay: number;
  language: string;
  priceUsd: number;
  age: string;
  verified: boolean;
  description: string;
  highlights: string[];
};

export type GoodsListing = {
  kind: "goods";
  id: string;
  sellerId: string;
  title: string;
  category: string;
  price: number;
  fiat: Fiat;
  stock: number;
  description: string;
};

export type Listing = P2POffer | ChannelListing | GoodsListing;

export type ChatMsg = {
  from: "me" | "peer" | "system";
  text: string;
  at: number;
};

export type Trade = {
  id: string;
  listingId: string;
  market: MarketKey;
  title: string;
  merchantName: string;
  side: Side;
  amount: number;
  total: number;
  asset: string;
  fiat: Fiat;
  methods: string[];
  status: TradeStatus;
  createdAt: number;
  messages: ChatMsg[];
};

export type User = {
  id: string;
  name: string;
  handle: string;
  joined: string;
};
