"use client";

import * as React from "react";

export type AttachmentItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  /** Object URL for image files. Revoked automatically on remove or unmount. */
  previewUrl?: string;
  status: "uploading" | "done" | "error";
  /** 0–100 while uploading. */
  progress: number;
  error?: string;
};

export type UseAttachmentsOptions = {
  /** Same syntax as the input accept attribute, e.g. "image/*,.pdf". */
  accept?: string;
  /** Max size per file in bytes. */
  maxSize?: number;
  maxFiles?: number;
  /** Upload hook. Report progress 0–100, resolve when done, reject to mark failed. */
  upload?: (file: File, onProgress: (percent: number) => void, signal: AbortSignal) => Promise<void>;
};

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule;
  });
}

function formatLimit(bytes: number) {
  return bytes >= 1024 * 1024 ? `${Math.round(bytes / 1024 / 1024)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function useAttachments({ accept, maxSize, maxFiles, upload }: UseAttachmentsOptions = {}) {
  const [items, setItems] = React.useState<AttachmentItem[]>([]);
  const itemsRef = React.useRef(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  const controllers = React.useRef(new Map<string, AbortController>());

  const patch = React.useCallback((id: string, next: Partial<AttachmentItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...next } : it)));
  }, []);

  const add = React.useCallback(
    (files: File[]) => {
      let slots = maxFiles === undefined ? Infinity : Math.max(0, maxFiles - itemsRef.current.length);
      const created: AttachmentItem[] = [];

      for (const file of files) {
        const base = {
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
        };
        let error: string | undefined;
        if (slots <= 0) error = `Limit of ${maxFiles} files reached`;
        else if (!matchesAccept(file, accept)) error = "File type not allowed";
        else if (maxSize !== undefined && file.size > maxSize) error = `Larger than ${formatLimit(maxSize)}`;

        if (error) {
          created.push({ ...base, status: "error", error });
          continue;
        }
        slots -= 1;
        created.push({
          ...base,
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
          status: upload ? "uploading" : "done",
          progress: upload ? 0 : 100,
        });
      }

      setItems((prev) => [...prev, ...created]);

      if (!upload) return;
      for (const item of created) {
        if (item.status !== "uploading") continue;
        const controller = new AbortController();
        controllers.current.set(item.id, controller);
        upload(item.file, (p) => patch(item.id, { progress: Math.round(p) }), controller.signal)
          .then(() => patch(item.id, { status: "done", progress: 100 }))
          .catch((e: unknown) => {
            if (controller.signal.aborted) return;
            patch(item.id, { status: "error", error: e instanceof Error ? e.message : "Upload failed" });
          })
          .finally(() => controllers.current.delete(item.id));
      }
    },
    [accept, maxSize, maxFiles, upload, patch],
  );

  const remove = React.useCallback((id: string) => {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const clear = React.useCallback(() => {
    for (const c of controllers.current.values()) c.abort();
    controllers.current.clear();
    for (const it of itemsRef.current) if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    setItems([]);
  }, []);

  React.useEffect(
    () => () => {
      for (const c of controllers.current.values()) c.abort();
      for (const it of itemsRef.current) if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    },
    [],
  );

  return {
    items,
    add,
    remove,
    clear,
    isUploading: items.some((it) => it.status === "uploading"),
    /** Files that finished successfully, ready to send. */
    ready: items.filter((it) => it.status === "done"),
  };
}
