import { ImageResponse } from "next/og";

export const alt = "turn: interfaces for intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: 88,
          background: "#000",
          color: "#efefe4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 38, letterSpacing: -1 }}>
          <div style={{ display: "flex", width: 40, height: 40, border: "3px solid #efefe4", borderRadius: 8 }} />
          turn
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 1.02, letterSpacing: -3, fontWeight: 400 }}>
          <div style={{ display: "flex" }}>interfaces for intelligence</div>
          <div style={{ display: "flex", color: "#8a8a8a" }}>streaming-first components</div>
          <div style={{ display: "flex", color: "#8a8a8a" }}>for chat, agents and tool use</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a3a3a3" }}>open source · base ui · shadcn registry</div>
      </div>
    ),
    size,
  );
}
