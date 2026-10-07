import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/registry/ui/button";
import { Message, MessageContent, MessageActions } from "@/registry/ui/message";
import { checkA11y } from "./axe";

describe("Button", () => {
  it("fires onClick and respects disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Button>Save</Button>);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe("Message", () => {
  it("exposes the role for styling and renders content and actions", () => {
    render(
      <Message role="user" data-testid="msg">
        <MessageContent>Hello</MessageContent>
        <MessageActions><Button>Copy</Button></MessageActions>
      </Message>,
    );
    expect(screen.getByTestId("msg")).toHaveAttribute("data-role", "user");
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Message><MessageContent>Hi</MessageContent></Message>);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
