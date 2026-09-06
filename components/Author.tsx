import { SITE } from "@/lib/site";

export default function Author() {
  return (
    <div className="flex flex-col items-center gap-1 text-center text-sm text-[var(--muted)]">
      <p className="flex items-center gap-2">
        <span>Created by {SITE.author.handle}</span>
        <a href={SITE.author.x} target="_blank" rel="me noopener noreferrer" aria-label="X" className="text-[#1a202c]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.9 2.5h3.3l-7.2 8.2 8.4 11.1h-6.6l-5.2-6.8-5.9 6.8H2.4l7.7-8.8L2 2.5h6.8l4.7 6.2 5.4-6.2Zm-1.2 17.4h1.8L7.4 4.3H5.5l12.2 15.6Z" />
          </svg>
        </a>
        <a href={SITE.author.linkedin} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn" className="text-[#1a202c]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 21.5h5.2V9.2H2.4v12.3Zm7.6 0h5.2v-6.7c0-1.8.3-3.5 2.5-3.5s2.2 2 2.2 3.6v6.6h5.2v-7.6c0-4.4-2.4-6.5-5.5-6.5-2.5 0-3.6 1.4-4.3 2.4h-.1V9.2H10v12.3Z" />
          </svg>
        </a>
      </p>
      <p className="text-[11px] text-black/25">
        To suggest new questions or report an error send me a dm.
      </p>
    </div>
  );
}
