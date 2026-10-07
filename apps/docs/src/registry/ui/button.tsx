"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        outline: "border bg-background hover:bg-muted",
      },
      size: {
        sm: "h-7 px-2.5",
        md: "h-9 px-3.5",
        icon: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<typeof BaseButton> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(buttonVariants({ variant, size }), className as string)}
      {...props}
    />
  );
}
