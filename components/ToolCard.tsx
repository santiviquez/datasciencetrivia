import type { ReactNode } from "react";

/** A category's colour and pattern, passed in so a calculator's bundle stays free of the deck. */
export interface CardLook {
  color: string;
  pattern: string;
}

/** The flashcard frame every calculator sits in: deck header, pattern square and footer band. */
export default function ToolCard({
  title,
  look,
  footer,
  children,
}: {
  title: string;
  look: CardLook;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-[460px] border-[10px] border-black bg-white">
      <header className="flex h-[64px] border-b-[10px] border-black">
        <div className="flex flex-1 items-center border-r-[10px] border-black px-4">
          <span className="font-[family-name:var(--font-card)] text-base uppercase leading-tight sm:text-lg">{title}</span>
        </div>
        <div className="w-[64px] shrink-0" style={{ backgroundColor: look.color }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={look.pattern} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        </div>
      </header>

      <div className="p-4">{children}</div>

      <footer
        className="flex h-[28px] items-center justify-between border-t-[10px] border-black px-3 text-[11px] font-semibold"
        style={{ backgroundColor: look.color }}
      >
        <span className="min-w-0 truncate tabular-nums">{footer}</span>
        <span className="shrink-0 pl-3">datasciencetrivia.com</span>
      </footer>
    </article>
  );
}
