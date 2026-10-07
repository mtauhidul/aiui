import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StreamingMarkdown } from "@/registry/ui/streaming-markdown";
import { CodeBlock } from "@/registry/ui/code-block";
import { CitationMarker, Sources, type Source } from "@/registry/ui/citations";
import { Feedback } from "@/registry/ui/feedback";
import { checkA11y } from "./axe";

const SOURCES: Source[] = [
  { title: "Base UI docs", url: "https://base-ui.com/docs", snippet: "Unstyled components." },
  { title: "Tailwind", url: "https://www.tailwindcss.com/" },
];

describe("StreamingMarkdown", () => {
  it("renders headings, emphasis, lists, tables and inline code", () => {
    render(
      <StreamingMarkdown>{`## Title\n\n**bold** and \`code\`\n\n- one\n- two\n\n| a | b |\n| - | - |\n| 1 | 2 |\n`}</StreamingMarkdown>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.getByText("code").tagName).toBe("CODE");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("opens external links in a new tab safely", () => {
    render(<StreamingMarkdown>{"[site](https://example.com)"}</StreamingMarkdown>);
    const link = screen.getByRole("link", { name: "site" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });

  it("renders fenced code through CodeBlock", async () => {
    render(<StreamingMarkdown>{"```ts\nconst a = 1;\n```"}</StreamingMarkdown>);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("const a = 1;")).toBeInTheDocument());
  });

  it("turns [n] into citation links only when sources are given", () => {
    const { rerender } = render(<StreamingMarkdown>{"Claim [1] and [2]."}</StreamingMarkdown>);
    expect(screen.getByText("Claim [1] and [2].")).toBeInTheDocument();
    rerender(<StreamingMarkdown sources={SOURCES}>{"Claim [1] and [2]."}</StreamingMarkdown>);
    expect(screen.getByRole("link", { name: "Source 1: Base UI docs" })).toHaveTextContent("1");
    expect(screen.getByRole("link", { name: "Source 2: Tailwind" })).toBeInTheDocument();
  });

  it("leaves out-of-range markers as plain text", () => {
    render(<StreamingMarkdown sources={SOURCES}>{"See [9]."}</StreamingMarkdown>);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(/\[9\]/)).toBeInTheDocument();
  });

  it("does not rewrite [n] inside link text", () => {
    render(<StreamingMarkdown sources={SOURCES}>{"[ref [1]](https://example.com)"}</StreamingMarkdown>);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("handles unfinished markdown mid-stream without throwing", () => {
    const { rerender } = render(<StreamingMarkdown>{"Here is **bold"}</StreamingMarkdown>);
    rerender(<StreamingMarkdown>{"Here is **bold** text\n\n```ts\nconst x"}</StreamingMarkdown>);
    expect(screen.getByText("bold").tagName).toBe("STRONG");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <StreamingMarkdown sources={SOURCES}>{"# Hi\n\nText [1]\n\n- a\n- b\n\n```ts\nx\n```"}</StreamingMarkdown>,
    );
    await waitFor(() => expect(screen.getByText("x")).toBeInTheDocument());
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("CodeBlock", () => {
  it("shows the language and copies the code", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CodeBlock code="npm i" lang="bash" />);
    expect(screen.getByText("bash")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("npm i");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("renders the code before highlighting finishes", () => {
    render(<CodeBlock code="plain" />);
    expect(screen.getByText("plain")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<CodeBlock code="const a = 1;" lang="ts" />);
    await waitFor(() => expect(container.querySelector(".shiki")).not.toBeNull());
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("Citations", () => {
  it("marker links to the source with a descriptive label", () => {
    render(<CitationMarker index={3} source={SOURCES[0]} />);
    const link = screen.getByRole("link", { name: "Source 3: Base UI docs" });
    expect(link).toHaveAttribute("href", "https://base-ui.com/docs");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("Sources lists numbered hostnames without www", () => {
    render(<Sources sources={SOURCES} />);
    const list = screen.getByRole("list", { name: "Sources" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("1base-ui.com");
    expect(items[1]).toHaveTextContent("2tailwindcss.com");
  });

  it("Sources renders nothing when empty", () => {
    const { container } = render(<Sources sources={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <p>
        Text <CitationMarker index={1} source={SOURCES[0]} />
        <Sources sources={SOURCES} />
      </p>,
    );
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("Feedback", () => {
  it("toggles rating, reports changes, and exposes aria-pressed", async () => {
    const onValueChange = vi.fn();
    render(<Feedback onValueChange={onValueChange} />);
    const up = screen.getByRole("button", { name: "Good response" });
    await userEvent.click(up);
    expect(up).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).toHaveBeenLastCalledWith("up");
    await userEvent.click(up);
    expect(up).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("thumbs up does not open the follow-up by default; thumbs down does and focuses it", async () => {
    render(<Feedback />);
    await userEvent.click(screen.getByRole("button", { name: "Good response" }));
    expect(screen.queryByLabelText("Additional feedback")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    expect(screen.getByText("What went wrong?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inaccurate" })).toHaveFocus();
  });

  it("submits selected reasons and trimmed comment, then confirms via status", async () => {
    const onSubmit = vi.fn();
    render(<Feedback onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    await userEvent.click(screen.getByRole("button", { name: "Too long" }));
    await userEvent.click(screen.getByRole("button", { name: "Other" }));
    await userEvent.click(screen.getByRole("button", { name: "Other" })); // toggle off
    await userEvent.type(screen.getByLabelText("Additional feedback"), "  wordy  ");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith({ value: "down", reasons: ["Too long"], comment: "wordy" });
    expect(screen.getByRole("status")).toHaveTextContent("Thanks for the feedback");
    expect(screen.queryByLabelText("Additional feedback")).toBeNull();
  });

  it("submits with Ctrl+Enter and closes with Escape", async () => {
    const onSubmit = vi.fn();
    render(<Feedback onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    await userEvent.type(screen.getByLabelText("Additional feedback"), "x{Control>}{Enter}{/Control}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Good response" }));
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    await userEvent.keyboard("{Escape}");
    // Escape only works from the textarea
    await userEvent.click(screen.getByLabelText("Additional feedback"));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByLabelText("Additional feedback")).toBeNull();
  });

  it("Skip keeps the rating but closes the form without submitting", async () => {
    const onSubmit = vi.fn();
    render(<Feedback onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    await userEvent.click(screen.getByRole("button", { name: "Skip" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Bad response" })).toHaveAttribute("aria-pressed", "true");
  });

  it("supports details='both' with up reasons, and details='never'", async () => {
    const { unmount } = render(<Feedback details="both" />);
    await userEvent.click(screen.getByRole("button", { name: "Good response" }));
    expect(screen.getByText("What did you like?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accurate" })).toBeInTheDocument();
    unmount();
    render(<Feedback details="never" />);
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    expect(screen.queryByLabelText("Additional feedback")).toBeNull();
  });

  it("is controllable", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Feedback value="up" onValueChange={onValueChange} />);
    expect(screen.getByRole("button", { name: "Good response" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    expect(onValueChange).toHaveBeenCalledWith("down");
    // Still "up" because the parent hasn't updated the value.
    expect(screen.getByRole("button", { name: "Good response" })).toHaveAttribute("aria-pressed", "true");
    rerender(<Feedback value="down" onValueChange={onValueChange} />);
    expect(screen.getByRole("button", { name: "Bad response" })).toHaveAttribute("aria-pressed", "true");
  });

  it("has no a11y violations in idle and form states", async () => {
    const { container } = render(<Feedback />);
    expect(await checkA11y(container)).toHaveNoViolations();
    await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
