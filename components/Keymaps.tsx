const KEYS: [string, string][] = [
  ["→", "Next Card"],
  ["←", "Previous card"],
  ["a", "Show answer"],
  ["e", "Rate easy"],
  ["n", "Rate neutral"],
  ["h", "Rate hard"],
];

/** Shortcut hints, shown only where there's a keyboard and room for them. */
export default function Keymaps() {
  return (
    <div className="hidden text-sm text-[var(--muted)] lg:block">
      <h2 className="sr-only">Keyboard shortcuts</h2>
      <dl className="space-y-3">
        {KEYS.map(([key, label]) => (
          <div key={key} className="flex items-center">
            <dt className="mr-12">
              <kbd className="rounded border border-b-2 border-[var(--rule)] bg-white px-1.5 py-0.5 font-mono text-[11px] text-[#1a202c]">
                {key}
              </kbd>
            </dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
