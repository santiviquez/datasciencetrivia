import { CATEGORIES, type CategoryKey } from "@/lib/questions";

interface TriviaCardProps {
  category: CategoryKey;
  question: string;
  answer: string;
  proposedBy?: string;
  /** When false the answer is hidden but still occupies no space. */
  revealed: boolean;
  /** Renders the question as an <h1> on question detail pages. */
  as?: "h1" | "h2" | "p";
}

export default function TriviaCard({
  category,
  question,
  answer,
  proposedBy,
  revealed,
  as: QuestionTag = "p",
}: TriviaCardProps) {
  const meta = CATEGORIES[category];
  // Long questions need to step down a size to stay inside the card.
  const long = question.length > 105;

  return (
    <article
      className="flex w-full max-w-[340px] flex-col border-[10px] border-black bg-[var(--card-bg)] text-[var(--card-ink)] shadow-[8px_8px_0_0_rgba(0,0,0,0.18)] sm:max-w-[380px]"
      style={{ minHeight: "clamp(360px, 56vh, 470px)" }}
    >
      <header className="flex shrink-0 border-b-[10px] border-black">
        <div className="flex flex-1 items-center border-r-[10px] border-black px-3 py-3 sm:px-4">
          <span className="font-[family-name:var(--font-card)] text-[15px] font-bold uppercase leading-tight tracking-tight sm:text-[22px]">
            {meta.name}
          </span>
        </div>
        <div
          className="flex w-[74px] shrink-0 items-center justify-center sm:w-[92px]"
          style={{ backgroundColor: meta.color }}
        >
          {/* Decorative local SVG: nothing for next/image to optimise. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.pattern} alt="" aria-hidden="true" width={92} height={92} className="h-full w-full object-cover" />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <QuestionTag
          className={`font-[family-name:var(--font-card)] font-medium uppercase ${
            long ? "text-[13px] leading-[1.45] sm:text-[15px]" : "text-[15px] leading-[1.4] sm:text-[20px]"
          }`}
        >
          {question}
        </QuestionTag>

        {revealed ? (
          <p className="border-t-2 border-dashed border-black/20 pt-3 font-[family-name:var(--font-body)] text-[13px] leading-relaxed sm:text-[15px]">
            {answer}
          </p>
        ) : null}
      </div>

      {proposedBy ? (
        <p className="shrink-0 px-4 pb-2 text-[11px] text-black/55">
          Proposed by {proposedBy}
        </p>
      ) : null}

      <footer
        className="flex shrink-0 items-center justify-end border-t-[10px] border-black px-3 py-1"
        style={{ backgroundColor: meta.color }}
      >
        <span className="text-[11px] font-semibold text-black/80">
          datasciencetrivia.com
        </span>
      </footer>
    </article>
  );
}
