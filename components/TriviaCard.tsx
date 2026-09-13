import { CATEGORIES, type CategoryKey } from "@/lib/questions";

interface TriviaCardProps {
  category: CategoryKey;
  question: string;
  answer: string;
  proposedBy?: string;
  revealed: boolean;
  /** The focused question on a permalink page is the page's heading. */
  as?: "h1" | "p";
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
  const long = question.length > 105;

  return (
    <article className="flex h-full max-h-[520px] min-h-[260px] w-[260px] flex-col border-[10px] border-black bg-white sm:w-[320px]">
      <header className="flex h-[75px] shrink-0 border-b-[10px] border-black sm:h-[100px]">
        <div className="flex flex-1 items-center border-r-[10px] border-black px-4">
          <span className="font-[family-name:var(--font-card)] text-[14px] uppercase leading-tight sm:text-[25px]">
            {meta.name}
          </span>
        </div>
        <div
          className="w-[75px] shrink-0 sm:w-[100px]"
          style={{ backgroundColor: meta.color }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.pattern} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
        <QuestionTag
          className={`font-[family-name:var(--font-card)] uppercase ${
            long
              ? "text-[12px] leading-[16px] sm:text-[13px] sm:leading-7"
              : "text-[12px] leading-[16px] sm:text-[20px] sm:leading-7"
          }`}
        >
          {question}
        </QuestionTag>

        {revealed ? (
          <p className="mt-3 font-[family-name:var(--font-body)] text-[12px] leading-relaxed sm:text-[16px]">
            {answer}
          </p>
        ) : null}

        {proposedBy ? (
          <p className="mt-auto pt-3 text-[11px] text-black/50">
            Proposed by {proposedBy}
          </p>
        ) : null}
      </div>

      <footer
        className="flex h-[28px] shrink-0 items-center justify-end border-t-[10px] border-black pr-3"
        style={{ backgroundColor: meta.color }}
      >
        <span className="text-[11px] font-semibold">datasciencetrivia.com</span>
      </footer>
    </article>
  );
}
