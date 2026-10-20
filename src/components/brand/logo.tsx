import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-mint/15 ring-1 ring-mint/30">
        <svg viewBox="0 0 24 24" width="20" height="20" className="h-5 w-5 text-mint" fill="none">
          <path
            d="M12 3.2 4.8 7.4v9.2L12 20.8l7.2-4.2V7.4L12 3.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
          <path
            d="M12 9.9V7.6M12 16.4v-2.3M9.9 12H7.6M16.4 12h-2.3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {compact ? null : (
        <span className="font-display text-[17px] font-semibold tracking-tight">
          Airdrop<span className="text-mint">Hub</span>
        </span>
      )}
    </Link>
  );
}
