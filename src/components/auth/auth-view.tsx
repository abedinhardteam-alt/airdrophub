"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useApp } from "@/store/app-store";

export function AuthView() {
  const login = useApp((s) => s.login);
  const user = useApp((s) => s.user);
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-white/10 bg-card p-6">
        <div className="text-xs font-semibold tracking-[0.18em] text-mint uppercase">AirdropHub</div>
        <h1 className="font-display mt-2 text-3xl font-semibold">Enter the desk</h1>
        <p className="mt-2 text-sm text-muted">
          Local session for posting offers and opening escrow trades. No password stored on a server.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login(name || "Trader");
            router.push("/dashboard");
          }}
        >
          <div>
            <Label>Display name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nova Desk"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
