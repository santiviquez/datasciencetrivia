import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-20 flex w-full flex-col items-center gap-2 border-t border-[var(--page-rule)] pt-8 text-center text-sm text-[var(--page-muted)]">
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>Created by {SITE.author.name}</span>
        <a href={SITE.author.x} rel="me noopener noreferrer" target="_blank" className="underline underline-offset-2 hover:text-[var(--page-fg)]">
          X
        </a>
        <a href={SITE.author.linkedin} rel="me noopener noreferrer" target="_blank" className="underline underline-offset-2 hover:text-[var(--page-fg)]">
          LinkedIn
        </a>
      </p>
      <p className="text-xs">
        Free and open. To suggest a question or report a mistake, send me a DM.
      </p>
    </footer>
  );
}
