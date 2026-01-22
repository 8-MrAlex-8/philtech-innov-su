import Link from "next/link";

const PetCarePage = () => {
  return (
    <div className="h-dvh flex items-center justify-center bg-neutral-100">
      <div className="w-[85dvw] md:w-[30dvw] p-8 rounded-2xl bg-white shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-6">Pet Care</h1>

        <p className="text-sm text-neutral-600 mb-8">Choose your companion:</p>

        <div className="flex gap-4 mb-8 justify-center">
          <Link
            href="/pet-care/cat"
            className="px-6 py-3 rounded-lg border border-neutral-800 font-semibold hover:bg-neutral-900 hover:text-white transition"
          >
            🐱 Cat
          </Link>
          <Link
            href="/pet-care/dog"
            className="px-6 py-3 rounded-lg border border-neutral-800 font-semibold hover:bg-neutral-900 hover:text-white transition"
          >
            🐕 Dog
          </Link>
        </div>

        <Link
          href="/"
          className="block text-sm text-neutral-600 hover:text-neutral-900 underline"
        >
          ← Back to Roulette
        </Link>
      </div>
    </div>
  );
};

export default PetCarePage;
