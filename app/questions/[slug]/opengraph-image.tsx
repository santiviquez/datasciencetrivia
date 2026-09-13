import { ImageResponse } from "next/og";
import { CATEGORIES, getAllQuestions, getQuestionBySlug } from "@/lib/questions";

export const alt = "A Data Science Trivia question";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

export default async function QuestionOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  const category = q ? CATEGORIES[q.category] : CATEGORIES.ml;
  const text = q?.question ?? "Data Science Trivia";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fbfbfa",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            border: "14px solid #000",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", borderBottom: "14px solid #000", height: 120 }}>
            <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "0 32px", borderRight: "14px solid #000", fontSize: 40, fontWeight: 700, textTransform: "uppercase", color: "#111" }}>
              {category.name}
            </div>
            <div style={{ display: "flex", width: 140, background: category.color }} />
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              padding: 44,
              fontSize: text.length > 90 ? 40 : 52,
              fontWeight: 600,
              lineHeight: 1.25,
              textTransform: "uppercase",
              color: "#111",
            }}
          >
            {text}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 28px", height: 76, borderTop: "14px solid #000", background: category.color, fontSize: 24, fontWeight: 600, color: "#111" }}>
            datasciencetrivia.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
