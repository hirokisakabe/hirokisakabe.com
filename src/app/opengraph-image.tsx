import { ImageResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div style={{ marginTop: 40 }}>hirokisakabe.com</div>
        <div style={{ fontSize: 16, marginTop: 10, fontWeight: 400 }}>
          Hiroki SAKABE&apos;s blog
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
