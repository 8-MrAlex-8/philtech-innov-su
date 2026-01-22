import Link from "next/link";

const ThemePage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Theme Selected 🎉</h1>
      <p className="text-neutral-600">
        This is a dummy page to simulate navigation.
      </p>

      <Link
        href="/"
        className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-900 hover:text-white transition"
      >
        ← Back to Roulette
      </Link>
    </main>
  );
};

export default ThemePage;
