import { ImageResponse } from "@vercel/og";
import fs from "fs";

function toBase64(filePath: string) {
  const img = fs.readFileSync(filePath);

  return Buffer.from(img).toString("base64");
}

export function getOgImage(text: string, image: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: 80,
          background: "white",
          flexDirection: "column",
          padding: "5%",
        }}
      >
        <div
          style={{
            display: "flex",
            textAlign: "left",
            padding: "2px 0",
          }}
        >
          {text}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
          }}
        >
          <img
            src={"data:image/jpeg;base64," + toBase64(image)}
            width={60}
            height={60}
            style={{
              borderRadius: "50%",
              border: "2px solid #1E1E1E",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 40,
            }}
          >
            Hiroki SAKABE
          </div>
        </div>
      </div>
    ),
  );
}
