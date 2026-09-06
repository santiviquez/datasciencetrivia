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
  heading,
  children,
}: {
  questions: QuestionWithSlug[];
  focus?: QuestionWithSlug;
  /**
   * The page's h1. On a permalink the card itself is the heading, so this is
   * omitted there. It is visually hidden: the game has no room for a title bar
   * without pushing the card off-screen, but a page still needs one heading
   * that names it.
   */
  heading?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="deck-frame flex h-dvh flex-col border-[10px] px-4 py-5 sm:border-[15px] sm:px-6">
        <main id="main" className="flex min-h-0 flex-1 flex-col items-center justify-center">
          {heading ? <h1 className="sr-only">{heading}</h1> : null}
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
