import { ImageResponse } from "next/og";

export const alt = "aiui — UI components for AI applications";
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
          justifyContent: "center",
          padding: 96,
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div style={{ fontSize: 40, color: "#7c8cff", fontWeight: 600 }}>aiui</div>
        <div style={{ fontSize: 84, fontWeight: 600, lineHeight: 1.05, marginTop: 24, letterSpacing: -2 }}>
          UI components for AI applications
        </div>
        <div style={{ fontSize: 34, color: "#a3a3a3", marginTop: 32 }}>
          Chat, agents and tool use. Copy them into your project.
        </div>
      </div>
    ),
    size,
  );
}
