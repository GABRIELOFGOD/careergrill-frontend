import { ImageResponse } from "next/og";

export const alt = "Careergrill — jobs, scholarships and application support";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "88px",
        background: "#211532",
        color: "#fff",
      }}
    >
      <div style={{ color: "#f6b18c", fontSize: 30, fontWeight: 700, letterSpacing: 5 }}>CAREERGRILL</div>
      <div style={{ marginTop: 40, fontSize: 72, fontWeight: 700, lineHeight: 1.12 }}>
        Find your next opportunity.
      </div>
      <div style={{ marginTop: 28, color: "#e3dce9", fontSize: 32 }}>
        Jobs · Scholarships · Career guidance
      </div>
    </div>,
    size,
  );
}
