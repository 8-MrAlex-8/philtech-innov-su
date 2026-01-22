import Link from "next/link";

const DungeonMasterPage = () => {
  return (
    <div className="h-dvh flex items-center justify-center bg-neutral-100">
      <div className="w-[85dvw] md:w-[30dvw] p-8 rounded-2xl bg-white shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-6">Dungeon Master</h1>
        
        <p className="text-sm text-neutral-600 mb-8">Choose your warrior class:</p>
        
        <div className="flex gap-4 mb-8 justify-center">
          <Link
            href="/dungeon-master/male-warrior"
            className="px-6 py-3 rounded-lg border border-neutral-800 font-semibold hover:bg-neutral-900 hover:text-white transition"
          >
            ⚔️ Male Warrior
          </Link>
          <Link
            href="/dungeon-master/female-warrior"
            className="px-6 py-3 rounded-lg border border-neutral-800 font-semibold hover:bg-neutral-900 hover:text-white transition"
          >
            ⚔️ Female Warrior
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
