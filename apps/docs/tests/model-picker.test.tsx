import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ModelPicker, type Model } from "@/registry/ui/model-picker";
import { checkA11y } from "./axe";

const MODELS: Model[] = [
  { value: "big", label: "Big One", provider: "Acme", description: "Most capable", contextWindow: 1_000_000, capabilities: ["vision", "reasoning"] },
  { value: "small", label: "Small One", provider: "Acme", description: "Fast and cheap", contextWindow: 200_000, capabilities: ["fast"] },
  { value: "other", label: "Other Model", provider: "Globex", description: "Long documents" },
];

const trigger = () => screen.getByRole("combobox", { name: "Model" });
// The popup mounts asynchronously, so wait for it.
const open = async () => {
  await userEvent.click(trigger());
  await screen.findByRole("listbox");
};

describe("ModelPicker", () => {
  it("shows the placeholder when nothing is selected and the label when selected", () => {
    const { rerender } = render(<ModelPicker models={MODELS} />);
    expect(trigger()).toHaveTextContent("Select model");
    rerender(<ModelPicker models={MODELS} value="small" />);
    expect(trigger()).toHaveTextContent("Small One");
  });

  it("lists models grouped by provider with context and capability tags", async () => {
    render(<ModelPicker models={MODELS} />);
    await open();
    expect(screen.getAllByRole("group")).toHaveLength(2);
    expect(within(screen.getAllByRole("group")[0]).getByText("Acme")).toBeInTheDocument();
    expect(within(screen.getAllByRole("group")[0]).getAllByRole("option")).toHaveLength(2);
    expect(within(screen.getAllByRole("group")[1]).getByText("Globex")).toBeInTheDocument();
    const big = screen.getByRole("option", { name: /Big One/ });
    expect(big).toHaveTextContent("1M ctx");
    expect(big).toHaveTextContent("Vision");
    expect(big).toHaveTextContent("Reasoning");
    expect(screen.getByRole("option", { name: /Small One/ })).toHaveTextContent("200K ctx");
  });

  it("can render a flat list", async () => {
    render(<ModelPicker models={MODELS} groupByProvider={false} />);
    await open();
    expect(screen.queryAllByRole("group")).toHaveLength(0);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("filters by label, provider, description and capability", async () => {
    render(<ModelPicker models={MODELS} />);
    await open();
    const search = screen.getByPlaceholderText("Search models…");
    const visible = () => MODELS.map((m) => m.label).filter((l) => screen.queryByText(l));

    await userEvent.type(search, "globex");
    expect(visible()).toEqual(["Other Model"]);
    await userEvent.clear(search);
    await userEvent.type(search, "cheap");
    expect(visible()).toEqual(["Small One"]);
    await userEvent.clear(search);
    await userEvent.type(search, "reasoning");
    expect(visible()).toEqual(["Big One"]);
  });

  it("shows an empty state when nothing matches", async () => {
    render(<ModelPicker models={MODELS} />);
    await open();
    await userEvent.type(screen.getByPlaceholderText("Search models…"), "zzzz");
    expect(screen.getByText("No models found.")).toBeInTheDocument();
  });

  it("selects with the mouse, reports the id, and closes", async () => {
    const onValueChange = vi.fn();
    render(<ModelPicker models={MODELS} onValueChange={onValueChange} />);
    await open();
    await userEvent.click(screen.getByRole("option", { name: /Small One/ }));
    expect(onValueChange).toHaveBeenCalledWith("small");
    expect(trigger()).toHaveTextContent("Small One"); // uncontrolled
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });

  it("selects with the keyboard and returns focus to the trigger", async () => {
    const onValueChange = vi.fn();
    render(<ModelPicker models={MODELS} onValueChange={onValueChange} />);
    trigger().focus();
    await userEvent.keyboard("{Enter}");
    await screen.findByRole("listbox");
    await userEvent.keyboard("long");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("other");
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it("is controlled: the shown model follows the value prop", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<ModelPicker models={MODELS} value="big" onValueChange={onValueChange} />);
    await open();
    await userEvent.click(screen.getByRole("option", { name: /Small One/ }));
    expect(onValueChange).toHaveBeenCalledWith("small");
    expect(trigger()).toHaveTextContent("Big One");
    rerender(<ModelPicker models={MODELS} value="small" onValueChange={onValueChange} />);
    expect(trigger()).toHaveTextContent("Small One");
  });

  it("marks the selected option and respects defaultValue and disabled", async () => {
    render(<ModelPicker models={MODELS} defaultValue="big" />);
    await open();
    expect(screen.getByRole("option", { name: /Big One/ })).toHaveAttribute("aria-selected", "true");
  });

  it("does not open when disabled", async () => {
    render(<ModelPicker models={MODELS} disabled />);
    await userEvent.click(trigger());
    await new Promise((r) => setTimeout(r, 100));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("has no a11y violations closed and open", async () => {
    const { container, baseElement } = render(<ModelPicker models={MODELS} defaultValue="big" />);
    expect(await checkA11y(container)).toHaveNoViolations();
    await open();
    expect(within(baseElement).getByRole("listbox")).toBeInTheDocument();
    expect(await checkA11y(baseElement)).toHaveNoViolations();
  });
});
