import { ImageResponse } from "next/og";

export const alt = "aiui — UI components for AI applications";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0d0e17";
const PAPER = "#f3f1ea";
const LIME = "#c8f542";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: INK,
          color: PAPER,
          backgroundImage:
            "linear-gradient(rgba(243,241,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(243,241,234,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>
          <div style={{ display: "flex", width: 22, height: 44, background: LIME }} />
          aiui
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 118, lineHeight: 0.95, letterSpacing: -4, fontWeight: 500 }}>
            <div style={{ display: "flex" }}>Interfaces for</div>
            <div style={{ display: "flex", color: LIME }}>intelligence.</div>
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "rgba(243,241,234,0.62)" }}>
            Streaming-first UI for chat, agents and tool use.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "rgba(243,241,234,0.5)" }}>
          OPEN SOURCE · BASE UI · SHADCN REGISTRY
        </div>
      </div>
    ),
    size,
  );
}
