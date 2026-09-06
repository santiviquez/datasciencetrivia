import Link from "next/link";

export default function NotFound() {
  return (
    <div className="deck-frame flex min-h-screen items-center justify-center border-[10px] px-4 sm:border-[15px]">
      <main id="main" className="text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Card not found</h1>
        <p className="mt-3 text-sm text-[var(--page-muted)]">
          That question isn&apos;t in the deck.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="border-[3px] border-black bg-black px-5 py-2.5 text-sm font-bold uppercase text-white transition hover:bg-white hover:text-black">
            Play the deck
          </Link>
          <Link href="/questions" className="border-[3px] border-black px-5 py-2.5 text-sm font-bold uppercase transition hover:bg-black hover:text-white">
            All questions
          </Link>
        </div>
      </main>
    </div>
  );
}
