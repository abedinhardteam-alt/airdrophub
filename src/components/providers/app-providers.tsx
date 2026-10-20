"use client";

import { useEffect, type ReactNode } from "react";
import { useApp } from "@/store/app-store";

export function AppProviders({ children }: { children: ReactNode }) {
  const hydrate = useApp((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return <>{children}</>;
}
