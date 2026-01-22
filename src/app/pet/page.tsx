"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import petdata from "../../data/petdata.json";

const QUESTS = [
  {
    id: "morning-glow",
    title: "Morning Glow",
    description:
      "Your pet stretches lazily as the morning sun hits the window. Take a few steps around your room to help it greet the day.",
    duration: 10,
    xp: 10,
    coins: 5,
  },
  {
    id: "trail-of-leaves",
    title: "Trail of Leaves",
    description:
      "Golden leaves swirl ahead of your pet’s paws. Step outside for a short walk and let them follow your path.",
    duration: 45,
    xp: 200,
    coins: 80,
    bonus: true,
  },
  {
    id: "music-ripple",
    title: "Music Ripple",
    description:
      "A faint tune echoes through your pet’s world. Play a song fully or hum along — the ripples make the air sparkle.",
    duration: 20,
    xp: 30,
    coins: 15,
  },
  {
    id: "creative-pawprints",
    title: "Creative Pawprints",
    description:
      "Your pet paws at a blank page curiously. Draw, write, or doodle something to leave your mark together.",
    duration: 30,
    xp: 40,
    coins: 20,
  },
];

export default function GameInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState(
    "https://toppng.com/uploads/preview/cute-pusheen-cat-drawings-11549780281jhaxjprj03.png"
  );
  const [showQuests, setShowQuests] = useState(false);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<null | (typeof QUESTS)[0]>(null);
  const [completedLoaded, setCompletedLoaded] = useState(false);

  // Load pet data from JSON based on petId query parameter
  useEffect(() => {
    const petId = searchParams?.get("petId");
    if (petId) {
      const selectedPet = petdata.pets.find(p => p.id === parseInt(petId));
      if (selectedPet) {
        setImageUrl(selectedPet.image);
      }
    }
  }, [searchParams]);

  const addCompletedQuest = (id: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem("pet_completed_quests") || "[]");
      const storedArr: string[] = Array.isArray(stored) ? stored : [];
      const union = Array.from(new Set([...storedArr, ...completedQuests, id]));
      localStorage.setItem("pet_completed_quests", JSON.stringify(union));
      setCompletedQuests(union);
    } catch (e) {
      const union = Array.from(new Set([...completedQuests, id]));
      localStorage.setItem("pet_completed_quests", JSON.stringify(union));
      setCompletedQuests(union);
    }
  };

  useEffect(() => {
    // Try to load from server DB, fallback to localStorage
    (async () => {
      try {
        const res = await fetch("/api/pet");
        if (res.ok) {
          const data = await res.json();
          setXp(typeof data.xp === "number" ? data.xp : 0);
          setCoins(typeof data.coins === "number" ? data.coins : 0);
          setCompletedQuests(Array.isArray(data.completedQuests) ? data.completedQuests : []);
          setCompletedLoaded(true);
          return;
        }
      } catch (e) {
        // ignore and fallback to localStorage
      }

      const storedXp = parseInt(localStorage.getItem("pet_xp") || "0", 10);
      const storedCoins = parseInt(localStorage.getItem("pet_coins") || "0", 10);
      setXp(storedXp);
      setCoins(storedCoins);
      const storedCompleted = JSON.parse(localStorage.getItem("pet_completed_quests") || "[]");
      setCompletedQuests(Array.isArray(storedCompleted) ? storedCompleted : []);
      setCompletedLoaded(true);
    })();
  }, []);

  // If navigated back with ?completed=id ensure UI updates immediately
  useEffect(() => {
    const comp = searchParams?.get?.("completed");
    if (!comp) return;
    addCompletedQuest(comp);
    try {
      router.replace("/pet");
    } catch (e) {
      // ignore
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("pet_xp", String(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("pet_coins", String(coins));
  }, [coins]);

  useEffect(() => {
    if (!completedLoaded) return;
    localStorage.setItem("pet_completed_quests", JSON.stringify(completedQuests));
  }, [completedQuests, completedLoaded]);

  const startQuest = (quest: { id: string; duration: number; xp: number; coins: number }) => {
    // ignore clicks for completed quests (safety)
    if (completedQuests.includes(quest.id)) return;
    const url = `/pet/quest/${quest.id}?duration=${quest.duration}&xp=${quest.xp}&coins=${quest.coins}`;
    router.push(url);
    setShowQuests(false);
    setSelectedQuest(null);
  };

  // show the full quest view (description) before starting
  const openQuestDetail = (quest: (typeof QUESTS)[0]) => {
    if (completedQuests.includes(quest.id)) return;
    setSelectedQuest(quest);
    setShowQuests(false);
  };

  // progress percent toward next level (example: next level at 100 xp)
  const nextLevelXp = 100;
  // Show progress toward the next 100 XP (bar based on 100 XP)
  const progressPct = Math.min(100, Math.round(((xp % nextLevelXp) / nextLevelXp) * 100));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 relative overflow-hidden font-sans">
      {/* Background Dot Pattern (Optional aesthetic touch) */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      ></div>

      {/* --- TOP HUD --- */}
      <div className="flex justify-between items-start w-full max-w-md mx-auto z-10 mb-8">
        {/* Left Widget: Level & XP */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border-2 border-black bg-white rounded-md flex items-center justify-center font-bold text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {Math.floor(xp / nextLevelXp) + 1}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-24 h-6 border-2 border-black bg-white rounded-md overflow-hidden relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="h-full bg-black" style={{ width: `${progressPct}%` }}></div>
              </div>
              <span className="font-bold text-sm tracking-tighter">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Right Widget: Currency */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 border-2 border-black bg-white rounded-md flex items-center justify-center font-bold text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            C
          </div>
          <div className="w-24 h-8 border-2 border-black bg-white rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-bold">
            {coins}
          </div>
        </div>
      </div>

      {/* --- MAIN GAME AREA --- */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto relative z-10">
        {/* 1. Shop Icon (Top Left floating) */}
        <button 
          onClick={() => router.push("/shop")}
          className="absolute left-4 top-0 hover:-translate-y-1 transition-transform hover:scale-110"
          title="Go to Shop"
        >
          <ShoppingBag className="w-14 h-14 stroke-[2.5px] text-black drop-shadow-md" />
        </button>

        {/* Character Interaction Area */}
        <div className="relative mt-10">
          {/* Speech Bubble (Above Character) */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="relative">
              <MessageCircle className="w-24 h-24 text-black fill-white stroke-[1.5px] rotate-[-10deg]" />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="w-64 h-48 flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Game Character" className="w-full h-full object-contain drop-shadow-xl" />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* 3. Alert Icon (Right Floating) */}
        <button
          onClick={() => {
            const storedCompleted = JSON.parse(localStorage.getItem("pet_completed_quests") || "[]");
            setCompletedQuests(Array.isArray(storedCompleted) ? storedCompleted : []);
            setShowQuests(true);
          }}
          className="absolute right-0 top-1/3 hover:scale-110 transition-transform"
          aria-label="Open quests"
        >
          <div className="w-16 h-16 rounded-full border-[3px] border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-bold text-5xl font-mono">!</span>
          </div>
        </button>

        {/* Quest Modal */}
        {showQuests && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
            <div className="bg-white border-2 border-black w-80 rounded-md p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">Quests</h3>
                <button onClick={() => setShowQuests(false)} className="text-sm">Close</button>
              </div>
              <ul className="flex flex-col gap-2">
                {QUESTS.map((q) => {
                  const done = completedQuests.includes(q.id);
                  return (
                    <li key={q.id}>
                      <button
                        onClick={() => openQuestDetail(q)}
                        disabled={done}
                        className={`w-full text-left border-2 border-black rounded-md px-3 py-2 ${done ? 'bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none' : 'bg-white hover:bg-gray-50'}`}
                        aria-disabled={done}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{q.title}</span>
                          <div className="text-sm flex items-center gap-2">
                            {q.bonus && <span className="text-xs font-semibold text-yellow-700">BONUS</span>}
                            {done && <span className="text-xs font-bold">✓ Done</span>}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
                <div className="mt-3 text-xs text-gray-600">
                  Completed: {JSON.stringify(completedQuests)}
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
          <div className="bg-white border-2 border-black w-96 rounded-md p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{selectedQuest.title}</h3>
                {selectedQuest.bonus && <div className="text-yellow-700 text-sm font-semibold">Bonus Quest</div>}
              </div>
              <button onClick={() => setSelectedQuest(null)} className="text-sm">Close</button>
            </div>
            <p className="mt-3 text-sm text-gray-700">{selectedQuest.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">Duration: {selectedQuest.duration}s</div>
              <div className="text-sm">{selectedQuest.xp} XP · {selectedQuest.coins} C</div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setSelectedQuest(null)} className="px-3 py-1 border-2 border-black rounded-md bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={() => startQuest(selectedQuest)} className="px-3 py-1 border-2 border-black rounded-md bg-black text-white">Start Quest</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}