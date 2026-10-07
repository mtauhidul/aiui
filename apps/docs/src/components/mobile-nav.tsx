"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/registry/ui/button";
import { DocsNav } from "./docs-nav";
import { Wordmark } from "./brand";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger render={<Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden" />}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" /></svg>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity motion-reduce:transition-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r bg-black p-5 transition-transform duration-200 motion-reduce:transition-none data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full">
          <Dialog.Title className="mb-8"><Wordmark /></Dialog.Title>
          <DocsNav onNavigate={() => setOpen(false)} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
