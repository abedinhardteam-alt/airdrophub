"use client";

import { create } from "zustand";
import {
  channelListings,
  goodsListings,
  merchantMap,
  p2pOffers,
} from "@/data/catalog";
import type {
  ChannelListing,
  Fiat,
  GoodsListing,
  Listing,
  MarketKey,
  P2POffer,
  Side,
  Trade,
  User,
} from "@/types";

const SESSION_KEY = "ah_session";
const EXTRA_KEY = "ah_extras";
const TRADE_KEY = "ah_trades";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

type AppState = {
  hydrated: boolean;
  user: User | null;
  extras: Listing[];
  trades: Trade[];
  hydrate: () => void;
  login: (name: string) => void;
  logout: () => void;
  addListing: (listing: Listing) => void;
  createTrade: (input: {
    listing: Listing;
    amount: number;
    total: number;
    side: Side;
    asset: string;
    fiat: Fiat;
    methods: string[];
    title: string;
    merchantName: string;
    market: MarketKey;
  }) => string;
  setTradeStatus: (id: string, status: Trade["status"]) => void;
  addMessage: (id: string, from: Trade["messages"][number]["from"], text: string) => void;
};

export const useApp = create<AppState>((set, get) => ({
  hydrated: false,
  user: null,
  extras: [],
  trades: [],
  hydrate: () => {
    if (get().hydrated) return;
    set({
      hydrated: true,
      user: readJson<User | null>(SESSION_KEY, null),
      extras: readJson<Listing[]>(EXTRA_KEY, []),
      trades: readJson<Trade[]>(TRADE_KEY, []),
    });
  },
  login: (name) => {
    const handle = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) || "trader";
    const user: User = {
      id: `u-${Date.now()}`,
      name: name.trim() || "Trader",
      handle,
      joined: new Date().toISOString().slice(0, 10),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ user: null });
  },
  addListing: (listing) => {
    const extras = [listing, ...get().extras];
    localStorage.setItem(EXTRA_KEY, JSON.stringify(extras));
    set({ extras });
  },
  createTrade: (input) => {
    const id = `TR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const trade: Trade = {
      id,
      listingId: input.listing.id,
      market: input.market,
      title: input.title,
      merchantName: input.merchantName,
      side: input.side,
      amount: input.amount,
      total: input.total,
      asset: input.asset,
      fiat: input.fiat,
      methods: input.methods,
      status: "awaiting_payment",
      createdAt: Date.now(),
      messages: [
        {
          from: "system",
          text: "Escrow opened. Pay the merchant using a listed method, then mark paid. Do not release until the asset arrives.",
          at: Date.now(),
        },
        {
          from: "peer",
          text: `Offer locked. Send ${input.fiat === "BDT" ? "৳" : "$"}${input.total.toLocaleString()} via ${input.methods[0] ?? "listed rails"}. Quote trade ${id}.`,
          at: Date.now() + 1,
        },
      ],
    };
    const trades = [trade, ...get().trades];
    localStorage.setItem(TRADE_KEY, JSON.stringify(trades));
    set({ trades });
    return id;
  },
  setTradeStatus: (id, status) => {
    const trades = get().trades.map((t) => (t.id === id ? { ...t, status } : t));
    localStorage.setItem(TRADE_KEY, JSON.stringify(trades));
    set({ trades });
  },
  addMessage: (id, from, text) => {
    const trades = get().trades.map((t) =>
      t.id === id
        ? { ...t, messages: [...t.messages, { from, text, at: Date.now() }] }
        : t,
    );
    localStorage.setItem(TRADE_KEY, JSON.stringify(trades));
    set({ trades });
  },
}));

export function allListings(extras: Listing[]): Listing[] {
  return [...extras, ...p2pOffers, ...channelListings, ...goodsListings];
}

export function findListing(id: string, extras: Listing[]) {
  return allListings(extras).find((l) => l.id === id);
}

export function listingMerchant(listing: Listing) {
  const id =
    listing.kind === "p2p"
      ? listing.merchantId
      : listing.kind === "channel"
        ? listing.sellerId
        : listing.sellerId;
  return merchantMap[id];
}

export function isP2P(l: Listing): l is P2POffer {
  return l.kind === "p2p";
}
export function isChannel(l: Listing): l is ChannelListing {
  return l.kind === "channel";
}
export function isGoods(l: Listing): l is GoodsListing {
  return l.kind === "goods";
}
