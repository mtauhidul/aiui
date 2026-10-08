import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ScrollToBottom } from "@/registry/ui/scroll-to-bottom";
import { Suggestions } from "@/registry/ui/suggestions";
import { Thinking } from "@/registry/ui/thinking";
import { ErrorNotice } from "@/registry/ui/error-notice";
import { CopyButton } from "@/registry/ui/copy-button";
import { checkA11y } from "./axe";

/** jsdom has no layout, so give a scroller fixed metrics. */
function metrics(el: HTMLElement, { scrollHeight, clientHeight, scrollTop }: { scrollHeight: number; clientHeight: number; scrollTop: number }) {
  Object.defineProperty(el, "scrollHeight", { configurable: true, value: scrollHeight });
  Object.defineProperty(el, "clientHeight", { configurable: true, value: clientHeight });
  // jsdom does not implement Element.scrollTo.
  el.scrollTo = ((options: ScrollToOptions) => {
    el.scrollTop = options.top ?? 0;
  }) as typeof el.scrollTo;
  el.scrollTop = scrollTop;
}

function Harness({ top }: { top: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (ref.current) metrics(ref.current, { scrollHeight: 1000, clientHeight: 300, scrollTop: top });
  }, [top]);
  return (
    <div className="relative">
      <div ref={ref} data-testid="scroller" role="log" aria-label="Conversation" />
      <ScrollToBottom target={ref} />
    </div>
  );
}

describe("ScrollToBottom", () => {
  it("is hidden at the bottom and shown when scrolled away", async () => {
    const { rerender } = render(<Harness top={700} />);
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(screen.queryByRole("button", { name: /latest/i })).toBeNull();

    rerender(<Harness top={0} />);
    screen.getByTestId("scroller").dispatchEvent(new Event("scroll"));
    expect(await screen.findByRole("button", { name: "Scroll to latest message" })).toBeInTheDocument();
  });

  it("scrolls to the bottom and moves focus to the container", async () => {
    render(<Harness top={0} />);
    const scroller = screen.getByTestId("scroller");
    scroller.dispatchEvent(new Event("scroll"));
    await userEvent.click(await screen.findByRole("button", { name: /latest/i }));
    expect(scroller.scrollTop).toBe(1000);
    expect(scroller).toHaveFocus();
  });

  it("has no axe violations while visible", async () => {
    const { container } = render(<Harness top={0} />);
    screen.getByTestId("scroller").dispatchEvent(new Event("scroll"));
    await screen.findByRole("button", { name: /latest/i });
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("Suggestions", () => {
  const items = ["Explain this", { label: "Show code", value: "Show me a code example" }];

  it("calls onSelect with the value, falling back to the label", async () => {
    const onSelect = vi.fn();
    render(<Suggestions items={items} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Explain this" }));
    await userEvent.click(screen.getByRole("button", { name: "Show code" }));
    expect(onSelect).toHaveBeenNthCalledWith(1, "Explain this");
    expect(onSelect).toHaveBeenNthCalledWith(2, "Show me a code example");
  });

  it("can be disabled without leaving the page", async () => {
    const onSelect = vi.fn();
    render(<Suggestions items={items} onSelect={onSelect} disabled />);
    await userEvent.click(screen.getByRole("button", { name: "Explain this" }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("group", { name: "Suggested prompts" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Suggestions items={items} onSelect={() => {}} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("Thinking", () => {
  it("is a status region with a visible label", async () => {
    const { container } = render(<Thinking />);
    expect(screen.getByRole("status")).toHaveTextContent("Thinking…");
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("ErrorNotice", () => {
  it("is announced as an alert and retries", async () => {
    const onRetry = vi.fn();
    const { container } = render(<ErrorNotice message="The model timed out." onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("The model timed out.");
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(await checkA11y(container)).toHaveNoViolations();
  });

  it("keeps the button focusable but inert while retrying", async () => {
    const onRetry = vi.fn();
    render(<ErrorNotice onRetry={onRetry} retrying />);
    const button = screen.getByRole("button", { name: "Retrying…" });
    button.focus();
    expect(button).toHaveFocus();
    await userEvent.click(button);
    expect(onRetry).not.toHaveBeenCalled();
  });

  it("omits the button without onRetry", () => {
    render(<ErrorNotice />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("CopyButton", () => {
  it("copies the value and announces it", async () => {
    const user = userEvent.setup();
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    const { container } = render(<CopyButton value={() => "hello"} />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(write).toHaveBeenCalledWith("hello");
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard"));
    expect(await checkA11y(container)).toHaveNoViolations();
  });

  it("stays quiet when the clipboard is blocked", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    render(<CopyButton value="x" />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});
