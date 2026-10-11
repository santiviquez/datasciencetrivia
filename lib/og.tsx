import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CATEGORIES, type CategoryKey } from "./questions";

/**
 * Every share image is the site's flashcard inside the site's four-colour
 * frame, so a link to any page previews as the same game the page opens on.
 */
export const OG_SIZE = { width: 1200, height: 630 };

/**
 * The card's own typefaces (Maven Pro for the card, Poppins for body text).
 * Without them the renderer falls back to a single regular weight.
 */
export function ogFonts() {
  const font = (file: string) => readFileSync(join(process.cwd(), "assets", "fonts", file));
  return [
    { name: "Maven Pro", data: font("MavenPro-Bold.ttf"), weight: 700 as const, style: "normal" as const },
    { name: "Poppins", data: font("Poppins-Regular.ttf"), weight: 400 as const, style: "normal" as const },
  ];
}

const patterns = new Map<CategoryKey, string>();

/** The category's card pattern as a data URL; the renderer can't fetch /public. */
function pattern(key: CategoryKey): string {
  let url = patterns.get(key);
  if (!url) {
    const svg = readFileSync(join(process.cwd(), "public", CATEGORIES[key].pattern));
    url = `data:image/svg+xml;base64,${svg.toString("base64")}`;
    patterns.set(key, url);
  }
  return url;
}

export function cardImage({
  category,
  label,
  title,
  subtitle,
}: {
  /** Sets the colour and pattern. */
  category: CategoryKey;
  /** Header text; the category name unless given. */
  label?: string;
  /** The card's question: the biggest text on the image. */
  title: string;
  /** Optional line under the title, in sentence case. */
  subtitle?: string;
}) {
  const color = CATEGORIES[category].color;
  const titleSize = title.length > 110 ? 38 : title.length > 70 ? 46 : 56;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 36,
          background: "#fbfbfa",
          fontFamily: "Maven Pro",
          borderTop: "20px solid #72D0EA",
          borderLeft: "20px solid #92DCCF",
          borderRight: "20px solid #EFAAAD",
          borderBottom: "20px solid #BB92D4",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, border: "12px solid #000", background: "#fff" }}>
          <div style={{ display: "flex", height: 112, borderBottom: "12px solid #000" }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                padding: "0 32px",
                borderRight: "12px solid #000",
                fontSize: 42,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              {label ?? CATEGORIES[category].name}
            </div>
            <div style={{ display: "flex", width: 200, background: color }}>
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img src={pattern(category)} width={200} height={100} style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", padding: "0 44px" }}>
            <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.2, textTransform: "uppercase", color: "#111" }}>
              {title}
            </div>
            {subtitle ? (
              <div style={{ display: "flex", marginTop: 22, fontFamily: "Poppins", fontSize: 30, lineHeight: 1.4, color: "#444" }}>
                {subtitle}
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              height: 64,
              padding: "0 28px",
              borderTop: "12px solid #000",
              background: color,
              fontSize: 26,
              fontWeight: 700,
              color: "#111",
            }}
          >
            datasciencetrivia.com
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: ogFonts() },
  );
}
