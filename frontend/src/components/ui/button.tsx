import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
  {
    variants: {
      variant: {
        default: "bg-primary px-4 py-2.5 text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/90",
        secondary: "bg-secondary px-4 py-2.5 text-secondary-foreground hover:bg-secondary/85",
        ghost: "px-4 py-2.5 text-foreground hover:bg-white/40",
        outline: "border border-border bg-white/70 px-4 py-2.5 text-foreground hover:bg-white",
        destructive:
          "bg-destructive px-4 py-2.5 text-destructive-foreground shadow-lg shadow-destructive/10 hover:bg-destructive/90",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
