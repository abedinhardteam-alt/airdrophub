import { cn, hueFrom, initials } from "@/lib/utils";

export function Avatar({
  name,
  size = "md",
  online,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}) {
  const h = hueFrom(name);
  const dim =
    size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-xs";
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "grid place-items-center rounded-full font-semibold text-white ring-1 ring-white/10",
          dim,
        )}
        style={{
          background: `linear-gradient(145deg, hsl(${h} 42% 28%), hsl(${(h + 40) % 360} 50% 18%))`,
        }}
      >
        {initials(name)}
      </span>
      {online != null ? (
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0e1218]",
            online ? "bg-buy" : "bg-white/25",
          )}
        />
      ) : null}
    </span>
  );
}
