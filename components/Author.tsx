import Link from "next/link";
import { SITE } from "@/lib/site";
import { GitHubIcon, LinkedInIcon, XIcon } from "./SocialIcons";

/**
 * The site's footer. It sits under the game and under every static page, so the
 * links here are the ones that need to be reachable from anywhere: who made
 * this, where to find them, and the page that explains the deck.
 *
 * The profile links carry rel="me", which is how each profile can point back
 * and confirm it is the same person as the `sameAs` list in the structured data.
 */
export default function Author() {
  return (
    <div className="flex flex-col items-center gap-1 text-center text-sm text-[var(--muted)]">
      <p className="flex items-center gap-2">
        <span>Created by {SITE.author.handle}</span>
        <a href={SITE.author.x} target="_blank" rel="me noopener noreferrer" aria-label="X" className="text-[#1a202c]">
          <XIcon />
        </a>
        <a href={SITE.author.linkedin} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn" className="text-[#1a202c]">
          <LinkedInIcon />
        </a>
        <a href={SITE.author.github} target="_blank" rel="me noopener noreferrer" aria-label="GitHub" className="text-[#1a202c]">
          <GitHubIcon />
        </a>
      </p>
      <p className="text-[11px]">
        <Link href="/about" className="underline underline-offset-2 hover:text-[var(--fg)]">
          About
        </Link>
        {" · "}
        <Link href="/quiz" className="underline underline-offset-2 hover:text-[var(--fg)]">
          Quizzes
        </Link>
        {" · "}
        <Link href="/ai-history" className="underline underline-offset-2 hover:text-[var(--fg)]">
          History of AI
        </Link>
        <span className="text-black/25">
          {" "}
          · To suggest new questions or report an error send me a dm.
        </span>
      </p>
    </div>
  );
}
