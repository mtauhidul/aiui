"use client";

import { CommandMenu } from "@/registry/ui/command-menu";

const noop = () => {};

/** A static command menu for the homepage. Lives in a client file because CommandMenu takes callbacks. */
export function CommandMenuStill() {
  return (
    <CommandMenu
      id="home-commands"
      activeIndex={0}
      onActiveChange={noop}
      onSelect={noop}
      className="shadow-none"
      commands={[
        { id: "s", name: "summarize", description: "Summarize text" },
        { id: "t", name: "translate", description: "Translate to another language" },
        { id: "c", name: "clear", description: "Clear the conversation" },
      ]}
    />
  );
}
