import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAttachments } from "@/registry/hooks/use-attachments";
import { Attachment, AttachmentList, formatBytes } from "@/registry/ui/attachment";
import { checkA11y } from "./axe";

const file = (name: string, type: string, size = 10) =>
  new File([new Uint8Array(size)], name, { type });

beforeEach(() => {
  let n = 0;
  URL.createObjectURL = vi.fn(() => `blob:mock-${n++}`);
  URL.revokeObjectURL = vi.fn();
});

describe("useAttachments", () => {
  it("adds files as done immediately when there is no upload fn", () => {
    const { result } = renderHook(() => useAttachments());
    act(() => result.current.add([file("a.txt", "text/plain")]));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ name: "a.txt", status: "done", progress: 100 });
    expect(result.current.ready).toHaveLength(1);
    expect(result.current.isUploading).toBe(false);
  });

  it("creates preview URLs only for images and revokes them on remove", () => {
    const { result } = renderHook(() => useAttachments());
    act(() => result.current.add([file("p.png", "image/png"), file("a.txt", "text/plain")]));
    const [img, txt] = result.current.items;
    expect(img.previewUrl).toMatch(/^blob:/);
    expect(txt.previewUrl).toBeUndefined();
    act(() => result.current.remove(img.id));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(img.previewUrl);
    expect(result.current.items).toHaveLength(1);
  });

  it("rejects disallowed types, oversized files and over-limit files with errors", () => {
    const { result } = renderHook(() => useAttachments({ accept: "image/*,.pdf", maxSize: 100, maxFiles: 2 }));
    act(() =>
      result.current.add([
        file("virus.exe", "application/x-msdownload"),
        file("big.png", "image/png", 500),
        file("ok.png", "image/png"),
        file("doc.PDF", "application/pdf"),
        file("extra.png", "image/png"),
      ]),
    );
    const byName = Object.fromEntries(result.current.items.map((i) => [i.name, i]));
    expect(byName["virus.exe"]).toMatchObject({ status: "error", error: "File type not allowed" });
    expect(byName["big.png"].error).toMatch(/Larger than/);
    expect(byName["ok.png"].status).toBe("done");
    expect(byName["doc.PDF"].status).toBe("done"); // extension match is case-insensitive
    expect(byName["extra.png"].error).toMatch(/Limit of 2 files/);
    expect(result.current.ready).toHaveLength(2);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1); // only the accepted image
  });

  it("tracks upload progress and completion", async () => {
    let report!: (n: number) => void;
    let finish!: () => void;
    const upload = vi.fn((_f: File, onProgress: (n: number) => void) => {
      report = onProgress;
      return new Promise<void>((resolve) => (finish = resolve));
    });
    const { result } = renderHook(() => useAttachments({ upload }));
    act(() => result.current.add([file("a.txt", "text/plain")]));
    expect(result.current.items[0].status).toBe("uploading");
    expect(result.current.isUploading).toBe(true);
    act(() => report(42.4));
    expect(result.current.items[0].progress).toBe(42);
    await act(async () => finish());
    expect(result.current.items[0]).toMatchObject({ status: "done", progress: 100 });
    expect(result.current.isUploading).toBe(false);
  });

  it("marks failed uploads with the error message", async () => {
    const upload = vi.fn(() => Promise.reject(new Error("boom")));
    const { result } = renderHook(() => useAttachments({ upload }));
    await act(async () => result.current.add([file("a.txt", "text/plain")]));
    expect(result.current.items[0]).toMatchObject({ status: "error", error: "boom" });
    expect(result.current.ready).toHaveLength(0);
  });

  it("aborts an in-flight upload on remove, without flagging an error", async () => {
    let signal!: AbortSignal;
    const upload = vi.fn((_f: File, _p: unknown, s: AbortSignal) => {
      signal = s;
      return new Promise<void>((_, reject) => s.addEventListener("abort", () => reject(new Error("aborted"))));
    });
    const { result } = renderHook(() => useAttachments({ upload }));
    act(() => result.current.add([file("a.txt", "text/plain")]));
    await act(async () => result.current.remove(result.current.items[0].id));
    expect(signal.aborted).toBe(true);
    expect(result.current.items).toHaveLength(0);
  });

  it("clear removes everything, aborts uploads, and revokes previews", () => {
    const upload = vi.fn(() => new Promise<void>(() => {}));
    const { result } = renderHook(() => useAttachments({ upload }));
    act(() => result.current.add([file("p.png", "image/png")]));
    act(() => result.current.clear());
    expect(result.current.items).toHaveLength(0);
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("revokes previews on unmount", () => {
    const { result, unmount } = renderHook(() => useAttachments());
    act(() => result.current.add([file("p.png", "image/png")]));
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});

describe("formatBytes", () => {
  it("formats B, KB and MB", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(3 * 1024 * 1024)).toBe("3.0 MB");
  });
});

describe("Attachment", () => {
  const base = { name: "report.pdf", size: 2048, progress: 0 };

  it("shows name and size when done, with a labelled remove button", async () => {
    const onRemove = vi.fn();
    render(<Attachment item={{ ...base, status: "done" }} onRemove={onRemove} />);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText("2 KB")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove report.pdf" }));
    expect(onRemove).toHaveBeenCalled();
  });

  it("exposes upload progress as a progressbar", () => {
    render(<Attachment item={{ ...base, status: "uploading", progress: 40 }} />);
    expect(screen.getByRole("progressbar", { name: "Uploading report.pdf" })).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("shows the error message when failed, and no remove button without onRemove", () => {
    render(<Attachment item={{ ...base, status: "error", error: "Too big" }} />);
    expect(screen.getByText("Too big")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders images as thumbnails with alt text", () => {
    render(<Attachment item={{ ...base, name: "cat.png", status: "done", previewUrl: "blob:x" }} />);
    expect(screen.getByRole("img", { name: "cat.png" })).toHaveAttribute("src", "blob:x");
  });

  it("list renders nothing when empty and has no a11y violations when populated", async () => {
    const { container, rerender } = render(<AttachmentList items={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(
      <AttachmentList
        onRemove={() => {}}
        items={[
          { id: "1", ...base, status: "done" },
          { id: "2", ...base, name: "x.png", status: "done", previewUrl: "blob:x" },
          { id: "3", ...base, name: "up.zip", status: "uploading", progress: 10 },
          { id: "4", ...base, name: "bad.exe", status: "error", error: "File type not allowed" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
