import * as React from "react";
import { cn } from "@/lib/utils";

/** A quiet bordered panel with an optional small caption. */
export function Panel({
  children,
  caption,
  className,
  bodyClassName,
}: {
  children: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-surface", className)}>
      {caption && (
        <div className="flex items-center justify-between border-b px-4 py-2.5 text-[13px] text-muted-foreground">{caption}</div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

/** A two-tone statement: the claim in off-white, the continuation in gray. */
export function Statement({
  claim,
  rest,
  as: Tag = "h2",
  size = "display",
  className,
  id,
}: {
  claim: React.ReactNode;
  rest?: React.ReactNode;
  as?: "h1" | "h2";
  size?: "display" | "display-lg";
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn(size, "text-foreground", className)}>
      {claim}
      {rest && (
        <>
          <br />
          <span className="text-faint">{rest}</span>
        </>
      )}
    </Tag>
  );
}
