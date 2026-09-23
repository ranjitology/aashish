import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Aashish Kumar Jha — Registered Civil Engineer";
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
          background: "linear-gradient(135deg, #071527 0%, #122e56 55%, #183d70 100%)",
          padding: 72,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 18,
              background: "#14b8a6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
              color: "#071527",
            }}
          >
            AKJ
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>Aashish Kumar Jha</div>
            <div style={{ fontSize: 24, color: "#b3cdea", marginTop: 4 }}>
              Registered Civil Engineer · Lecturer · Water Resources
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 30, color: "#e8f4fb", maxWidth: 900 }}>
            &ldquo;Engineering sustainable water solutions, shaping future engineers.&rdquo;
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "rgba(20,184,166,0.18)",
              border: "2px solid #14b8a6",
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 24,
              color: "#5eead4",
              fontWeight: 600,
            }}
          >
            NEC Registered Engineer [78836] · Janakpur, Nepal
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}