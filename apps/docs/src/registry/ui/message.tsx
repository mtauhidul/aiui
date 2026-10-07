import * as React from "react";
import { cn } from "@/lib/utils";

export type MessageRole = "user" | "assistant";

export function Message({
  role = "assistant",
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  role?: MessageRole;
  /** Spoken before the message so screen readers know the speaker. Pass false to omit. */
  label?: string | false;
}) {
  const speaker = label ?? (role === "user" ? "You said:" : "Assistant said:");
  return (
    <div
      data-role={role}
      className={cn(
        "group flex w-full gap-3",
        role === "user" && "justify-end",
        className,
      )}
      {...props}
    >
      {speaker && <span className="sr-only">{speaker}</span>}
      {children}
    </div>
  );
}

export function MessageContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "min-w-0 text-[15px] leading-relaxed",
        "group-data-[role=user]:max-w-[85%] group-data-[role=user]:rounded-2xl group-data-[role=user]:bg-muted group-data-[role=user]:px-4 group-data-[role=user]:py-2.5",
        className,
      )}
      {...props}
    />
  );
}

export function MessageActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100",
        className,
      )}
      {...props}
    />
  );
}
