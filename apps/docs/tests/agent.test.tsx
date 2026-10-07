import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Reasoning } from "@/registry/ui/reasoning";
import { ToolCall } from "@/registry/ui/tool-call";
import { Plan, type PlanStep } from "@/registry/ui/plan";
import { Trace, type TraceEvent } from "@/registry/ui/trace";
import { ApprovalPrompt } from "@/registry/ui/approval-prompt";
import { Artifact } from "@/registry/ui/artifact";
import { checkA11y } from "./axe";

describe("Reasoning", () => {
  it("is open while streaming and collapses when streaming ends", async () => {
    const { rerender } = render(<Reasoning isStreaming>Because.</Reasoning>);
    const trigger = screen.getByRole("button", { name: /Thinking/ });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    rerender(<Reasoning isStreaming={false} duration={4}>Because.</Reasoning>);
    const done = await screen.findByRole("button", { name: "Thought for 4s" });
    expect(done).toHaveAttribute("aria-expanded", "false");
  });

  it("falls back to a generic label without a duration, and toggles on click", async () => {
    render(<Reasoning>Hidden thoughts</Reasoning>);
    const trigger = screen.getByRole("button", { name: "Thought process" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden thoughts")).toBeVisible();
  });

  it("has no a11y violations open and closed", async () => {
    const { container } = render(<Reasoning duration={2}>Because.</Reasoning>);
    expect(await checkA11y(container)).toHaveNoViolations();
    await userEvent.click(screen.getByRole("button"));
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("ToolCall", () => {
  it.each([
    ["pending", "Pending"],
    ["running", "Running"],
    ["success", "Done"],
    ["error", "Failed"],
  ] as const)("shows %s as %s", (state, label) => {
    render(<ToolCall name="search" state={state} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("search")).toBeInTheDocument();
  });

  it("reveals input, output and error when expanded", async () => {
    render(<ToolCall name="t" state="error" input={{ q: "x" }} output="out" error="boom" />);
    await userEvent.click(screen.getByRole("button", { name: /t/ }));
    expect(screen.getByText(/"q": "x"/)).toBeInTheDocument();
    expect(screen.getByText("out")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("omits sections that have no data", async () => {
    render(<ToolCall name="t" state="running" input={{ a: 1 }} defaultOpen />);
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.queryByText("Output")).toBeNull();
    expect(screen.queryByText("Error")).toBeNull();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <ToolCall name="get_weather" state="success" input={{ city: "Berlin" }} output={{ t: 14 }} defaultOpen />,
    );
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("Plan", () => {
  const steps: PlanStep[] = [
    { id: "1", title: "Search", state: "done" },
    { id: "2", title: "Draft", state: "active", detail: "3 files" },
    { id: "3", title: "Test", state: "pending" },
  ];

  it("renders an ordered list and marks only the active step as current", () => {
    render(<Plan steps={steps} />);
    const items = within(screen.getByRole("list", { name: "Plan" })).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(screen.getByText("3 files")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Plan steps={[...steps, { id: "4", title: "Fail", state: "error" }]} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("Trace", () => {
  const events: TraceEvent[] = [
    { id: "a", kind: "agent", name: "agent.run", start: 0, duration: 4200 },
    { id: "b", kind: "tool", name: "write_file", start: 100, duration: 310, status: "error" },
  ];

  it("renders a row per span with formatted durations and the total", () => {
    render(<Trace events={events} />);
    expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2
    expect(screen.getByText("agent.run")).toBeInTheDocument();
    expect(screen.getByText("4.20s")).toBeInTheDocument();
    expect(screen.getByText("310ms")).toBeInTheDocument();
    expect(screen.getByText("Total 4.20s")).toBeInTheDocument();
  });

  it("does not crash with no events", () => {
    render(<Trace events={[]} />);
    expect(screen.getByText("Total 1ms")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Trace events={events} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("ApprovalPrompt", () => {
  it("calls approve and deny handlers", async () => {
    const onApprove = vi.fn();
    const onDeny = vi.fn();
    render(<ApprovalPrompt title="Run it?" onApprove={onApprove} onDeny={onDeny} />);
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));
    await userEvent.click(screen.getByRole("button", { name: "Deny" }));
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onDeny).toHaveBeenCalledTimes(1);
  });

  it("is a named alertdialog and hides buttons once decided", () => {
    const { rerender } = render(<ApprovalPrompt title="Run it?" description="Danger" details="rm -rf" />);
    expect(screen.getByRole("alertdialog", { name: "Run it?" })).toBeInTheDocument();
    expect(screen.getByText("rm -rf")).toBeInTheDocument();
    rerender(<ApprovalPrompt title="Run it?" status="approved" />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    rerender(<ApprovalPrompt title="Run it?" status="denied" />);
    expect(screen.getByText("Denied")).toBeInTheDocument();
  });

  it("moves focus into the prompt only with autoFocus", () => {
    const { unmount } = render(<ApprovalPrompt title="A" />);
    expect(screen.getByRole("alertdialog")).not.toHaveFocus();
    unmount();
    render(<ApprovalPrompt title="B" autoFocus />);
    expect(screen.getByRole("alertdialog")).toHaveFocus();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<ApprovalPrompt title="Send email?" description="12 recipients" details="Subject" />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("Artifact", () => {
  it("shows the preview first and switches to code", async () => {
    render(<Artifact title="Hello.tsx" preview={<p>rendered</p>} code={<p>source</p>} />);
    expect(screen.getByRole("tab", { name: "preview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("rendered")).toBeVisible();
    await userEvent.click(screen.getByRole("tab", { name: "code" }));
    expect(screen.getByText("source")).toBeVisible();
  });

  it("supports arrow-key navigation between tabs", async () => {
    render(<Artifact title="x" preview={<p>rendered</p>} code={<p>source</p>} />);
    screen.getByRole("tab", { name: "preview" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "code" })).toHaveFocus();
  });

  it("shows a close button only when onClose is given", async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Artifact title="x" preview="p" code="c" />);
    expect(screen.queryByRole("button", { name: "Close artifact" })).toBeNull();
    rerender(<Artifact title="x" preview="p" code="c" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Close artifact" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Artifact title="Hello.tsx" preview={<p>r</p>} code={<p>c</p>} onClose={() => {}} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
