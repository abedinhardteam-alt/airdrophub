import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-mint text-[#06241c] hover:bg-[#6aebc4] shadow-[0_0_0_1px_rgba(62,224,177,0.3),0_8px_24px_rgba(62,224,177,0.18)]",
        gold: "bg-gold text-[#1a1403] hover:bg-[#ffd56a]",
        buy: "bg-buy text-[#042014] hover:bg-[#4ade80]",
        sell: "bg-sell text-[#2a0610] hover:bg-[#fda4af]",
        outline:
          "border border-white/12 bg-white/2 text-foreground hover:bg-white/6 hover:border-white/20",
        ghost: "text-muted hover:text-foreground hover:bg-white/5",
        dark: "bg-white/8 text-foreground hover:bg-white/12",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: Props) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
