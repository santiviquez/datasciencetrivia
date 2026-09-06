import { ImageResponse } from "next/og";
import { QUESTION_COUNT } from "@/lib/questions";

export const alt = "Data Science Trivia — Learn Data Science The Fun Way";
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
          alignItems: "center",
          background: "#fbfbfa",
          borderTop: "24px solid #72D0EA",
          borderLeft: "24px solid #92DCCF",
          borderRight: "24px solid #EFAAAD",
          borderBottom: "24px solid #BB92D4",
        }}
      >
        <div style={{ display: "flex", fontSize: 82, fontWeight: 800, color: "#111", letterSpacing: -2 }}>
          Data Science Trivia
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 34, color: "#444" }}>
          {QUESTION_COUNT} flashcards to test what you actually know
        </div>
        <div style={{ display: "flex", marginTop: 44, gap: 16 }}>
          {["Machine Learning", "Statistics", "Deep Learning", "History"].map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 22px",
                fontSize: 24,
                fontWeight: 600,
                color: "#111",
                border: "4px solid #000",
                background: ["#72D0EA", "#92DCCF", "#EFAAAD", "#BB92D4"][i],
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 24, color: "#777" }}>
          datasciencetrivia.com
        </div>
      </div>
    ),
    size,
  );
}
