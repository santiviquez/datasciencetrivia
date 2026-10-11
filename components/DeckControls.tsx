/**
 * The controls around a card: the arrows either side of it, the reveal button
 * under it and the face buttons under that. Shared by the deck and the
 * quizzes so both read as the same game.
 */

export function RevealButton({
  revealed,
  onClick,
  children,
}: {
  revealed: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={revealed}
      className="mt-6 shrink-0 rounded-md bg-[#edf2f7] px-4 py-2 text-sm font-semibold text-[#1a202c] transition hover:bg-[#e2e8f0]"
    >
      {children ?? (revealed ? "Hide Answer" : "Show Answer")}
    </button>
  );
}

const FACES = {
  happy: "M8 14s1.5 2 4 2 4-2 4-2",
  meh: "M8 15h8",
  sad: "M16 16s-1.5-2-4-2-4 2-4 2",
} as const;

export function RateButton({
  active,
  tone,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  tone: string;
  onClick: () => void;
  icon: keyof typeof FACES;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition"
      style={
        active
          ? { backgroundColor: tone, color: "#fff" }
          : { color: tone, backgroundColor: "transparent" }
      }
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d={FACES[icon]} />
        <path d="M9 9h.01M15 9h.01" />
      </svg>
      {children}
    </button>
  );
}

export function Arrow({
  dir,
  label,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`shrink-0 px-2 text-[#319795] transition disabled:opacity-25 sm:px-8 ${dir === "left" ? "pr-2 sm:pr-8" : "pl-2 sm:pl-8"}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}
