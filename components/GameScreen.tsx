import Deck from "./Deck";
import Author from "./Author";
import Keymaps from "./Keymaps";
import type { QuestionWithSlug } from "@/lib/questions";

/**
 * The game, sized to exactly one screen so the card, its answer and the
 * available actions are all visible without scrolling. Anything passed as
 * children sits below the fold.
 */
export default function GameScreen({
  questions,
  focus,
  children,
}: {
  questions: QuestionWithSlug[];
  focus?: QuestionWithSlug;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="deck-frame flex h-dvh flex-col border-[10px] px-4 py-5 sm:border-[15px] sm:px-6">
        <main id="main" className="flex min-h-0 flex-1 items-center justify-center">
          <Deck questions={questions} focus={focus} />
        </main>

        <div className="relative flex shrink-0 justify-center pt-4">
          <Author />
          <div className="absolute bottom-0 right-2">
            <Keymaps />
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
