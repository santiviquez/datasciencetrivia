const KEYS: [string, string][] = [
  ["→", "Next card"],
  ["←", "Previous card"],
  ["A", "Show / hide answer"],
  ["E", "Rate easy"],
  ["N", "Rate neutral"],
  ["H", "Rate hard"],
  ["S", "Shuffle deck"],
];

/**
 * Keyboard hints. Hidden on touch layouts where they'd be noise, but kept in
 * the DOM for screen readers so the shortcuts remain discoverable.
 */
export default function Keymaps() {
  return (
    <section aria-labelledby="shortcuts" className="mt-14 hidden w-full max-w-md lg:block">
      <h2 id="shortcuts" className="sr-only">
        Keyboard shortcuts
      </h2>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-[var(--page-muted)]">
        {KEYS.map(([key, label]) => (
          <div key={key} className="flex items-center gap-3">
            <dt>
              <kbd className="inline-flex min-w-[24px] justify-center border border-[var(--page-rule)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--page-fg)]">
                {key}
              </kbd>
            </dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
