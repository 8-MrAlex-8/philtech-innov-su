import Link from "next/link";

const DogPage = () => {
  return (
    <div className="h-dvh flex items-center justify-center bg-neutral-100">
      <div className="w-[85dvw] md:w-[30dvw] p-8 rounded-2xl bg-white shadow-lg text-center">
        <div className="text-5xl mb-4">🐕</div>
        <h2 className="text-2xl font-semibold mb-6">Your Pet: Dog</h2>
        <p className="text-sm text-neutral-600 mb-8">
          You've chosen a dog as your companion! Now start your journey
          nurturing your loyalty and trustworthiness.
        </p>

        <Link
          href="/pet-care"
          className="block w-full rounded-full border border-neutral-800 py-3 text-sm font-semibold tracking-wide hover:bg-neutral-900 hover:text-white transition"
        >
          ← Back to Pet Care
        </Link>
      </div>
    </div>
  );
};

export default DogPage;
