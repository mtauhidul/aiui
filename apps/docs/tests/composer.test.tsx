import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PromptComposer } from "@/registry/ui/prompt-composer";
import { filterCommands, type SlashCommand } from "@/registry/ui/command-menu";
import { checkA11y } from "./axe";

const box = () => screen.getByRole("textbox", { name: "Message" });

describe("PromptComposer", () => {
  it("submits trimmed text on Enter and clears the input", async () => {
    const onSubmit = vi.fn();
    render(<PromptComposer onSubmit={onSubmit} />);
    await userEvent.type(box(), "  hello  {Enter}");
    expect(onSubmit).toHaveBeenCalledWith("hello");
    expect(box()).toHaveValue("");
  });

  it("inserts a newline on Shift+Enter instead of submitting", async () => {
    const onSubmit = vi.fn();
    render(<PromptComposer onSubmit={onSubmit} />);
    await userEvent.type(box(), "a{Shift>}{Enter}{/Shift}b");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(box()).toHaveValue("a\nb");
  });

  it("does not submit empty text, and disables send", async () => {
    const onSubmit = vi.fn();
    render(<PromptComposer onSubmit={onSubmit} />);
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    await userEvent.type(box(), "   {Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("allows empty sends with allowEmpty, but not when submitDisabled", async () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<PromptComposer onSubmit={onSubmit} allowEmpty />);
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSubmit).toHaveBeenCalledWith("");
    rerender(<PromptComposer onSubmit={onSubmit} allowEmpty submitDisabled />);
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("swaps send for stop while streaming and blocks submit", async () => {
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    render(<PromptComposer onSubmit={onSubmit} onStop={onStop} isStreaming />);
    expect(screen.queryByRole("button", { name: "Send message" })).toBeNull();
    await userEvent.type(box(), "x{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Stop generating" }));
    expect(onStop).toHaveBeenCalled();
  });

  it("does not submit while an IME composition is active", () => {
    const onSubmit = vi.fn();
    render(<PromptComposer onSubmit={onSubmit} />);
    fireEvent.change(box(), { target: { value: "こん" } });
    fireEvent.keyDown(box(), { key: "Enter", isComposing: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders attachments and toolbar slots", () => {
    render(<PromptComposer onSubmit={() => {}} attachments={<p>files</p>} toolbar={<p>tools</p>} />);
    expect(screen.getByText("files")).toBeInTheDocument();
    expect(screen.getByText("tools")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<PromptComposer onSubmit={() => {}} onFiles={() => {}} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("PromptComposer files", () => {
  it("passes picked files to onFiles and resets the input", async () => {
    const onFiles = vi.fn();
    const { container } = render(<PromptComposer onSubmit={() => {}} onFiles={onFiles} />);
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    const file = new File(["x"], "a.txt", { type: "text/plain" });
    await userEvent.upload(input, file);
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it("handles pasted files without inserting text", () => {
    const onFiles = vi.fn();
    render(<PromptComposer onSubmit={() => {}} onFiles={onFiles} />);
    const file = new File(["x"], "pic.png", { type: "image/png" });
    fireEvent.paste(box(), { clipboardData: { files: [file], types: ["Files"] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it("accepts dropped files and ignores non-file drags", () => {
    const onFiles = vi.fn();
    const { container } = render(<PromptComposer onSubmit={() => {}} onFiles={onFiles} />);
    const form = container.querySelector("form")!;
    const file = new File(["x"], "a.pdf", { type: "application/pdf" });
    fireEvent.drop(form, { dataTransfer: { types: ["text/plain"], files: [] } });
    expect(onFiles).not.toHaveBeenCalled();
    fireEvent.drop(form, { dataTransfer: { types: ["Files"], files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it("has no attach button without onFiles", () => {
    render(<PromptComposer onSubmit={() => {}} />);
    expect(screen.queryByRole("button", { name: "Attach files" })).toBeNull();
  });
});

const COMMANDS: SlashCommand[] = [
  { id: "summarize", name: "summarize", description: "Summarize text", insert: "Summarize:\n\n" },
  { id: "translate", name: "translate", description: "Translate text" },
  { id: "clear", name: "clear", description: "Clear the conversation" },
];

describe("PromptComposer slash commands", () => {
  it("opens on '/', filters, and links the input to the listbox", async () => {
    render(<PromptComposer onSubmit={() => {}} commands={COMMANDS} />);
    const input = box();
    expect(input).not.toHaveAttribute("aria-controls");
    await userEvent.type(input, "/tr");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("/translate");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);
  });

  it("runs an action command with Enter and clears the text", async () => {
    const onCommand = vi.fn();
    const onSubmit = vi.fn();
    render(<PromptComposer onSubmit={onSubmit} commands={COMMANDS} onCommand={onCommand} />);
    const input = box();
    await userEvent.type(input, "/cl{Enter}");
    expect(onCommand).toHaveBeenCalledWith(COMMANDS[2]);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input).toHaveValue("");
  });

  it("inserts a template for commands with insert and closes the menu", async () => {
    render(<PromptComposer onSubmit={() => {}} commands={COMMANDS} />);
    const input = box();
    await userEvent.type(input, "/sum{Tab}");
    expect(input).toHaveValue("Summarize:\n\n");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("navigates with arrows (wrapping) and selects the active option", async () => {
    const onCommand = vi.fn();
    render(<PromptComposer onSubmit={() => {}} commands={COMMANDS} onCommand={onCommand} />);
    const input = box();
    await userEvent.type(input, "/");
    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getAllByRole("option")[2]).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    expect(onCommand).toHaveBeenCalledWith(COMMANDS[2]);
  });

  it("dismisses with Escape and then sends the text as a plain message", async () => {
    const onSubmit = vi.fn();
    render(<PromptComposer onSubmit={onSubmit} commands={COMMANDS} />);
    const input = box();
    await userEvent.type(input, "/cl{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    await userEvent.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("/cl");
  });

  it("selects with the mouse and keeps focus in the input", async () => {
    const onCommand = vi.fn();
    render(<PromptComposer onSubmit={() => {}} commands={COMMANDS} onCommand={onCommand} />);
    const input = box();
    await userEvent.type(input, "/");
    await userEvent.click(screen.getByRole("option", { name: /translate/ }));
    expect(onCommand).toHaveBeenCalledWith(COMMANDS[1]);
    await waitFor(() => expect(input).toHaveFocus());
  });

  it("does not open mid-sentence", async () => {
    render(<PromptComposer onSubmit={() => {}} commands={COMMANDS} />);
    await userEvent.type(box(), "hello /tr");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("has no a11y violations with the menu open", async () => {
    const { container } = render(<PromptComposer onSubmit={() => {}} commands={COMMANDS} />);
    await userEvent.type(box(), "/");
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("filterCommands", () => {
  const cmds: SlashCommand[] = [
    { id: "a", name: "model", description: "Switch model" },
    { id: "b", name: "summarize", description: "Make it short", keywords: ["tldr"] },
    { id: "c", name: "help", description: "Show commands" },
  ];

  it("returns everything for an empty query", () => {
    expect(filterCommands(cmds, "")).toHaveLength(3);
  });

  it("ranks name prefix before name substring before description words", () => {
    const out = filterCommands(
      [
        { id: "1", name: "x", description: "model things" },
        { id: "2", name: "remodel" },
        { id: "3", name: "model" },
      ],
      "model",
    );
    expect(out.map((c) => c.id)).toEqual(["3", "2", "1"]);
  });

  it("matches keywords and description words by prefix only", () => {
    expect(filterCommands(cmds, "tld").map((c) => c.id)).toEqual(["b"]);
    // 'hort' is inside 'short' but not a word prefix.
    expect(filterCommands(cmds, "hort")).toHaveLength(0);
  });

  it("does not substring-match a single character in names", () => {
    expect(filterCommands(cmds, "o").map((c) => c.id)).toEqual([]);
  });
});
