import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Feedback } from "@/registry/ui/feedback";
import { ApprovalPrompt } from "@/registry/ui/approval-prompt";
import { AttachmentList } from "@/registry/ui/attachment";
import { PromptComposer } from "@/registry/ui/prompt-composer";
import { CodeBlock } from "@/registry/ui/code-block";

// Regression tests: a focused control that unmounts must hand focus to a sensible target,
// otherwise keyboard and screen-reader users are dropped back at the top of the page.

describe("focus is never lost to <body>", () => {
  describe("Feedback follow-up form", () => {
    const open = async () => {
      render(<Feedback />);
      await userEvent.click(screen.getByRole("button", { name: "Bad response" }));
    };
    const rating = () => screen.getByRole("button", { name: "Bad response" });

    it("returns focus to the rating on Escape", async () => {
      await open();
      await userEvent.click(screen.getByLabelText("Additional feedback"));
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(rating()).toHaveFocus());
    });

    it("returns focus to the rating on Skip", async () => {
      await open();
      await userEvent.click(screen.getByRole("button", { name: "Skip" }));
      await waitFor(() => expect(rating()).toHaveFocus());
    });

    it("returns focus to the rating on Submit", async () => {
      await open();
      await userEvent.click(screen.getByRole("button", { name: "Submit" }));
      await waitFor(() => expect(rating()).toHaveFocus());
    });
  });

  it("ApprovalPrompt keeps focus in the prompt after a decision removes the buttons", async () => {
    function Harness() {
      const [status, setStatus] = React.useState<"pending" | "approved" | "denied">("pending");
      return <ApprovalPrompt title="Run it?" status={status} onApprove={() => setStatus("approved")} onDeny={() => setStatus("denied")} />;
    }
    render(<Harness />);
    screen.getByRole("button", { name: "Approve" }).focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("alertdialog")).toHaveFocus());
  });

  describe("AttachmentList removal", () => {
    const item = (n: number) => ({ id: String(n), name: `f${n}.txt`, size: 1, progress: 100, status: "done" as const });

    function Harness({ initial }: { initial: number[] }) {
      const [ids, setIds] = React.useState(initial);
      return (
        <form>
          <AttachmentList items={ids.map(item)} onRemove={(id) => setIds((x) => x.filter((n) => String(n) !== id))} />
          <textarea aria-label="Message" />
        </form>
      );
    }

    it("moves focus to the item that takes the removed one's place", async () => {
      render(<Harness initial={[1, 2, 3]} />);
      screen.getByRole("button", { name: "Remove f2.txt" }).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(screen.getByRole("button", { name: "Remove f3.txt" })).toHaveFocus());
    });

    it("moves focus to the previous item when the last one is removed", async () => {
      render(<Harness initial={[1, 2]} />);
      screen.getByRole("button", { name: "Remove f2.txt" }).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(screen.getByRole("button", { name: "Remove f1.txt" })).toHaveFocus());
    });

    it("moves focus to the message input when the list becomes empty", async () => {
      render(<Harness initial={[1]} />);
      screen.getByRole("button", { name: "Remove f1.txt" }).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(screen.getByRole("textbox", { name: "Message" })).toHaveFocus());
    });
  });

  it("PromptComposer keeps focus on the same button when send turns into stop", () => {
    const { rerender } = render(<PromptComposer onSubmit={() => {}} allowEmpty />);
    const send = screen.getByRole("button", { name: "Send message" });
    send.focus();
    rerender(<PromptComposer onSubmit={() => {}} allowEmpty isStreaming onStop={() => {}} />);
    const stop = screen.getByRole("button", { name: "Stop generating" });
    expect(stop).toBe(send); // same element, so focus survives
    expect(stop).toHaveFocus();
  });
});

describe("CodeBlock copy announcement", () => {
  it("announces via a status region instead of mutating the button's live region", async () => {
    const user = userEvent.setup(); // installs the clipboard stub
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CodeBlock code="x" lang="ts" />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard"));
  });
});
