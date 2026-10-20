import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="font-mono text-sm text-mint">404</div>
      <h1 className="font-display mt-2 text-3xl font-semibold">Market not listed</h1>
      <p className="mt-2 text-sm text-muted">That route is off the book.</p>
      <Link href="/" className={cn(buttonVariants(), "mt-6")}>
        Back to desk
      </Link>
    </div>
  );
}
