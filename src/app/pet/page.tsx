"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import petdata from "../../data/petdata.json";
import Chatbot from "../../components/Chatbot";

// Define all available quests with pet type filtering
const ALL_QUESTS = [
  // ANIMAL PET TASKS (paws theme)
  {
    id: "morning-pounce",
    title: "Morning Pounce",
    description:
      "Your furry friend stretches lazily as the morning sun hits the window. Take a few steps around your room to help them greet the day.",
    duration: 10,
    xp: 10,
    coins: 5,
    petType: "animal",
  },
  {
    id: "trail-of-pawprints",
    title: "Trail of Pawprints",
    description:
      "Golden leaves swirl ahead of your pet's paws. Step outside for a short walk and let them follow your path.",
    duration: 45,
    xp: 200,
    coins: 80,
    bonus: true,
    petType: "animal",
  },
  {
    id: "paw-music-ripple",
    title: "Music Ripple",
    description:
      "A faint tune echoes through your pet's world. Play a song fully or hum along — the ripples make the air sparkle.",
    duration: 20,
    xp: 30,
    coins: 15,
    petType: "animal",
  },
  {
    id: "creative-pawprints",
    title: "Creative Pawprints",
    description:
      "Your furry companion paws at a blank page curiously. Draw, write, or doodle something to leave your mark together.",
    duration: 30,
    xp: 40,
    coins: 20,
    petType: "animal",
  },
  // PLANT PET TASKS (leaves/petals theme)
  {
    id: "morning-bloom",
    title: "Morning Bloom",
    description:
      "Your plant friend stretches lazily as the morning sun hits the window. Spend a moment admiring it to help them greet the day.",
    duration: 10,
    xp: 10,
    coins: 5,
    petType: "plant",
  },
  {
    id: "trail-of-petals",
    title: "Trail of Petals",
    description:
      "Golden petals swirl gently in the breeze. Step outside for a short walk and let your plant's essence follow your path.",
    duration: 45,
    xp: 200,
    coins: 80,
    bonus: true,
    petType: "plant",
  },
  {
    id: "petal-music-ripple",
    title: "Music Ripple",
    description:
      "A faint tune echoes through your plant's world. Play a song fully or hum along — the ripples make the petals dance.",
    duration: 20,
    xp: 30,
    coins: 15,
    petType: "plant",
  },
  {
    id: "creative-leaf-patterns",
    title: "Creative Leaf Patterns",
    description:
      "Your plant friend sways with curiosity. Draw, write, or arrange leaves to create something beautiful together.",
    duration: 30,
    xp: 40,
    coins: 20,
    petType: "plant",
  },
];

// Helper function to determine pet type
const getPetType = (pet: {
  category?: string;
}): "animal" | "plant" | "dungeonMaster" => {
  if (pet.category === "delightful-garden") {
    return "plant";
  }
  if (pet.category === "dungeon-master") {
    return "dungeonMaster";
  }
  return "animal";
};

export default function GameInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState("");
  const [showQuests, setShowQuests] = useState(false);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<
    null | (typeof ALL_QUESTS)[0]
  >(null);
  const [completedLoaded, setCompletedLoaded] = useState(false);
  const [petName, setPetName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingPet, setPendingPet] = useState<{
    id: number;
    defaultName: string;
    image: string;
  } | null>(null);
  const [customName, setCustomName] = useState("");
  const [currentPetType, setCurrentPetType] = useState<
    "animal" | "plant" | "dungeonMaster"
  >("animal");
  const [serverQuests, setServerQuests] = useState<Array<{
    id: string;
    title: string;
    description: string;
    duration: number;
    xp: number;
    coins: number;
    bonus?: boolean;
    petType: string;
  }> | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentPetId, setCurrentPetId] = useState<number | null>(null);

  // Bold the real-life action sentence in a quest description
  const renderDescriptionWithIrl = (desc: string) => {
    if (!desc) return null;
    const re =
      /(?:^|[.?!]\s*)(\s*(?:Take|Stand up|Stand|Do|Spend|Play|Step|Draw|Walk)[^.!?]*[.!?]?)/i;
    const m = re.exec(desc);
    if (!m) return desc;
    const irl = m[1].trim();
    const idx = desc.indexOf(irl);
    if (idx === -1) return desc;
    const before = desc.slice(0, idx);
    const after = desc.slice(idx + irl.length);
    return (
      <>
        {before}
        <strong>{irl}</strong>
        {after}
      </>
    );
  };

  // Load pet data from JSON based on petId query parameter
  useEffect(() => {
    const petId = searchParams?.get("petId");
    if (petId) {
      const selectedPet = petdata.pets.find((p) => p.id === parseInt(petId));
      if (selectedPet) {
        const petType = getPetType(selectedPet);
        // Schedule state update for next render to avoid cascading renders
        setTimeout(() => setCurrentPetType(petType), 0);

        // Check if pet is already saved
        (async () => {
          try {
            const res = await fetch("/api/pet");
            if (res.ok) {
              const data = await res.json();
              const savedPetId = data.pet?.petId;
              // If this pet is already saved, just load it
              if (savedPetId === selectedPet.id) {
                setImageUrl(selectedPet.image);
                return;
              }
            }

            // For delightful-garden pets, auto-save without showing name modal
            if (selectedPet.category === "delightful-garden") {
              try {
                await fetch("/api/pet", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    petId: selectedPet.id,
                    petName: selectedPet.name, // Use default name, no renaming allowed
                  }),
                });
                setImageUrl(selectedPet.image);
                setCurrentPetId(selectedPet.id);
                setPetName(selectedPet.name);
                // Remove petId from URL to prevent showing modal again on refresh
                router.replace("/pet");
                return;
              } catch {
                console.error("Failed to save plant selection");
              }
            }

            // For other pets, show name modal
            setPendingPet({
              id: selectedPet.id,
              defaultName: selectedPet.name,
              image: selectedPet.image,
            });
            setCustomName(selectedPet.name);
            setPetName(selectedPet.name);
            setShowNameModal(true);
            setImageUrl(selectedPet.image);
          } catch {
            console.error("Failed to check pet status");
            // On error, check if it's a delightful-garden pet
            if (selectedPet.category === "delightful-garden") {
              try {
                await fetch("/api/pet", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    petId: selectedPet.id,
                    petName: selectedPet.name,
                  }),
                });
                setImageUrl(selectedPet.image);
                router.replace("/pet");
                return;
              } catch {
                console.error("Failed to save plant selection");
              }
            }
            // For other pets, show modal anyway
            setPendingPet({
              id: selectedPet.id,
              defaultName: selectedPet.name,
              image: selectedPet.image,
            });
            setCustomName(selectedPet.name);
            setPetName(selectedPet.name);
            setShowNameModal(true);
            setImageUrl(selectedPet.image);
          }
        })();
      }
    } else {
      // No petId in query, load from saved player profile
      (async () => {
        try {
          const res = await fetch("/api/pet");
          if (res.ok) {
            const data = await res.json();
            const savedPetId = data.pet?.petId;
            if (savedPetId) {
              const savedPet = petdata.pets.find((p) => p.id === savedPetId);
              if (savedPet) {
                setImageUrl(savedPet.image);
                setCurrentPetType(getPetType(savedPet));
                setCurrentPetId(savedPet.id);
                setPetName(data.pet?.petName || savedPet.name);
              }
            }
          }
        } catch {
          console.error("Failed to load saved pet");
        }
      })();
    }
  }, [searchParams, router]);

  // When quests modal opens, try to fetch server-side quests for the current role/type
  useEffect(() => {
    if (!showQuests) return;

    (async () => {
      try {
        const role =
          currentPetType === "dungeonMaster" ? "dungeonMaster" : "pet";
        const res = await fetch(
          `/api/quests?fromPlayer=true&role=${encodeURIComponent(role)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setServerQuests(data);
          else setServerQuests(null);
        } else {
          setServerQuests(null);
        }
      } catch (e) {
        console.error("Failed to load server quests", e);
        setServerQuests(null);
      }
    })();
  }, [showQuests, currentPetType]);

  const addCompletedQuest = useCallback(
    (id: string) => {
      try {
        const stored = JSON.parse(
          localStorage.getItem("pet_completed_quests") || "[]",
        );
        const storedArr: string[] = Array.isArray(stored) ? stored : [];
        const union = Array.from(
          new Set([...storedArr, ...completedQuests, id]),
        );
        localStorage.setItem("pet_completed_quests", JSON.stringify(union));
        setCompletedQuests(union);
      } catch {
        const union = Array.from(new Set([...completedQuests, id]));
        localStorage.setItem("pet_completed_quests", JSON.stringify(union));
        setCompletedQuests(union);
      }
    },
    [completedQuests],
  );

  useEffect(() => {
    // Try to load from server DB, fallback to localStorage
    (async () => {
      try {
        const res = await fetch("/api/pet");
        if (res.ok) {
          const data = await res.json();
          setXp(typeof data.xp === "number" ? data.xp : 0);
          setCoins(typeof data.coins === "number" ? data.coins : 0);
          setCompletedQuests(
            Array.isArray(data.completedQuests) ? data.completedQuests : [],
          );
          setCompletedLoaded(true);
          return;
        }
      } catch {
        // ignore errors and fallback to localStorage
      }

      const storedXp = parseInt(localStorage.getItem("pet_xp") || "0", 10);
      const storedCoins = parseInt(
        localStorage.getItem("pet_coins") || "0",
        10,
      );
      setXp(storedXp);
      setCoins(storedCoins);
      const storedCompleted = JSON.parse(
        localStorage.getItem("pet_completed_quests") || "[]",
      );
      setCompletedQuests(Array.isArray(storedCompleted) ? storedCompleted : []);
      setCompletedLoaded(true);
    })();
  }, []);

  // Handle completed quest from query parameter
  useEffect(() => {
    const comp = searchParams?.get?.("completed");
    if (!comp || !completedLoaded) return;

    // Schedule state update for next render to avoid cascading renders
    setTimeout(() => {
      addCompletedQuest(comp);
      try {
        router.replace("/pet");
      } catch {
        // ignore routing errors
      }
    }, 0);
  }, [searchParams, completedLoaded, router, addCompletedQuest]);

  useEffect(() => {
    localStorage.setItem("pet_xp", String(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("pet_coins", String(coins));
  }, [coins]);

  useEffect(() => {
    if (!completedLoaded) return;
    localStorage.setItem(
      "pet_completed_quests",
      JSON.stringify(completedQuests),
    );
  }, [completedQuests, completedLoaded]);

  const savePetWithName = async (useDefault: boolean = false) => {
    if (!pendingPet) return;
    const nameToUse = useDefault
      ? pendingPet.defaultName
      : customName.trim() || pendingPet.defaultName;

    try {
      await fetch("/api/pet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId: pendingPet.id,
          petName: nameToUse,
        }),
      });
      setShowNameModal(false);
      setPendingPet(null);
      setPetName(nameToUse);
      setCurrentPetId(pendingPet.id);
      // Remove petId from URL to prevent showing modal again on refresh
      router.replace("/pet");
    } catch (e) {
      console.error("Failed to save pet selection", e);
    }
  };

  const startQuest = (quest: {
    id: string;
    duration: number;
    xp: number;
    coins: number;
  }) => {
    // ignore clicks for completed quests (safety)
    if (completedQuests.includes(quest.id)) return;
    const url = `/pet/quest/${quest.id}?duration=${quest.duration}&xp=${quest.xp}&coins=${quest.coins}`;
    router.push(url);
    setShowQuests(false);
    setSelectedQuest(null);
  };

  // show the full quest view (description) before starting
  const openQuestDetail = (quest: (typeof ALL_QUESTS)[0]) => {
    if (completedQuests.includes(quest.id)) return;
    setSelectedQuest(quest);
    setShowQuests(false);
  };

  // Get filtered quests based on current pet type. Prefer server-provided quests when available.
  const localFiltered = ALL_QUESTS.filter((q) => q.petType === currentPetType);
  const filteredQuests =
    serverQuests && serverQuests.length > 0 ? serverQuests : localFiltered;

  // progress percent toward next level (example: next level at 100 xp)
  const nextLevelXp = 100;
  // Show progress toward the next 100 XP (bar based on 100 XP)
  const progressPct = Math.min(
    100,
    Math.round(((xp % nextLevelXp) / nextLevelXp) * 100),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 relative overflow-hidden font-sans">
      {/* Background Dot Pattern (Optional aesthetic touch) */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
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
                <div
                  className="h-full bg-black"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
              <span className="ml-1.5 font-bold text-sm tracking-tighter">
                {xp} XP
              </span>
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
          <ShoppingBag className="w-14 h-14 stroke-[1.5px] text-black" />
        </button>

        {/* Character Interaction Area */}
        <div className="relative mt-10">
          {/* Speech Bubble (Above Character) - Clickable to open chat */}
          <button
            onClick={() => currentPetId && setShowChatbot(true)}
            className="absolute -top-20 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:scale-110 transition-transform focus:outline-none"
            title="Chat with your pet"
            disabled={!currentPetId}
          >
            <div className="relative">
              <MessageCircle
                className="w-24 h-24 text-black fill-white stroke-[1px] rotate-[-10deg]"
                style={{ filter: "drop-shadow(3px 3px 0px rgba(0,0,0,1))" }}
              />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
          </button>

          <div className="w-64 h-48 flex items-center justify-center">
            {imageUrl ? (
              <div className="tilt-wobble w-full h-full flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt="Game Character"
                  width={256}
                  height={192}
                  className="w-full h-full object-contain drop-shadow-xl"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse" />
            )}
            <style jsx>{`
              /* Quick wobble burst once every 5s */
              @keyframes tiltWobble {
                0% {
                  transform: rotate(0deg);
                }
                4% {
                  transform: rotate(-4deg);
                }
                8% {
                  transform: rotate(4deg);
                }
                12% {
                  transform: rotate(-3deg);
                }
                16% {
                  transform: rotate(3deg);
                }
                20% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(0deg);
                }
              }
              .tilt-wobble {
                animation: tiltWobble 5s ease-in-out infinite;
                transform-origin: 50% 80%;
              }
            `}</style>
          </div>
          {petName && (
            <div className="mt-3 text-center text-xl font-bold text-gray-800">
              {petName}
            </div>
          )}
        </div>

        {/* 3. Alert Icon (Right Floating) */}
        <button
          onClick={() => {
            const storedCompleted = JSON.parse(
              localStorage.getItem("pet_completed_quests") || "[]",
            );
            setCompletedQuests(
              Array.isArray(storedCompleted) ? storedCompleted : [],
            );
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
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-white border-2 border-black w-80 rounded-md p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">Quests</h3>
                <button
                  onClick={() => setShowQuests(false)}
                  className="text-sm"
                >
                  Close
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {filteredQuests.map((q) => {
                  const done = completedQuests.includes(q.id);
                  return (
                    <li key={q.id}>
                      <button
                        onClick={() => openQuestDetail(q)}
                        disabled={done}
                        className={`w-full text-left border-2 border-black rounded-md px-3 py-2 ${done ? "bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none" : "bg-white hover:bg-gray-50"}`}
                        aria-disabled={done}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{q.title}</span>
                          <div className="text-sm flex items-center gap-2">
                            {q.bonus && (
                              <span className="text-xs font-semibold text-yellow-700">
                                BONUS
                              </span>
                            )}
                            {done && (
                              <span className="text-xs font-bold">✓ Done</span>
                            )}
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
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="bg-white border-2 border-black w-96 rounded-md p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{selectedQuest.title}</h3>
                {selectedQuest.bonus && (
                  <div className="text-yellow-700 text-sm font-semibold">
                    Bonus Quest
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedQuest(null)}
                className="text-sm"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-700">
              {renderDescriptionWithIrl(selectedQuest.description)}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Duration: {selectedQuest.duration}s
              </div>
              <div className="text-sm">
                {selectedQuest.xp} XP · {selectedQuest.coins} C
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setSelectedQuest(null)}
                className="px-3 py-1 border-2 border-black rounded-md bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => startQuest(selectedQuest)}
                className="px-3 py-1 border-2 border-black rounded-md bg-black text-white"
              >
                Start Quest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Name Input Modal */}
      {showNameModal && pendingPet && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className="bg-white border-2 border-black w-96 rounded-md p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">Name Your Companion</h3>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter a name (or use default)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={pendingPet.defaultName}
                className="w-full border-2 border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    savePetWithName(false);
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Default: {pendingPet.defaultName}
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => savePetWithName(true)}
                className="px-4 py-2 border-2 border-black rounded-md bg-white hover:bg-gray-50"
              >
                Use Default
              </button>
              <button
                onClick={() => savePetWithName(false)}
                className="px-4 py-2 border-2 border-black rounded-md bg-black text-white hover:bg-gray-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Modal */}
      {currentPetId && (
        <Chatbot
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
          petId={currentPetId}
          petName={petName || "Pet"}
          petType={
            currentPetType === "plant" ? "plant companion" : "pet companion"
          }
        />
      )}
    </div>
  );
}
