"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function QuestTimerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = pathname?.split("/").pop() || "unknown";
  const duration = parseInt(searchParams.get("duration") || "0", 10);
  const rewardXp = parseInt(searchParams.get("xp") || "0", 10);
  const rewardCoins = parseInt(searchParams.get("coins") || "0", 10);

  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [done, setDone] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const startTimer = () => {
    if (timerStarted || !duration) return;
    setTimerStarted(true);
    setSecondsLeft(duration);
    setDone(false);

    const iv = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(iv);
          setDone(true);
          setIntervalId(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    setIntervalId(iv);
  };

  const cancelQuest = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    router.push("/pet");
  };

  const claimRewards = () => {
    // Try server-backed DB first
    (async () => {
      try {
        await fetch("/api/pet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            xp: rewardXp,
            coins: rewardCoins,
            completed: id,
          }),
        });
        router.push(`/pet?completed=${encodeURIComponent(id)}`);
        return;
      } catch (e) {
        // fallback to localStorage
        const curXp = parseInt(localStorage.getItem("pet_xp") || "0", 10);
        const curCoins = parseInt(localStorage.getItem("pet_coins") || "0", 10);
        localStorage.setItem("pet_xp", String(curXp + rewardXp));
        localStorage.setItem("pet_coins", String(curCoins + rewardCoins));
        try {
          const list = JSON.parse(
            localStorage.getItem("pet_completed_quests") || "[]",
          );
          const arr = Array.isArray(list) ? list : [];
          if (!arr.includes(id)) {
            arr.push(id);
            localStorage.setItem("pet_completed_quests", JSON.stringify(arr));
          }
        } catch (e2) {
          localStorage.setItem("pet_completed_quests", JSON.stringify([id]));
        }
        router.push(`/pet?completed=${encodeURIComponent(id)}`);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-md p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
        <h2 className="font-bold text-xl mb-4">{id.replace(/-/g, " ")}</h2>

        {!done ? (
          <div>
            <div className="text-6xl font-mono mb-4">{secondsLeft}s</div>
            {!timerStarted ? (
              <div>
                <div className="text-sm text-gray-600 mb-4">
                  Ready to start? Press the button when you're ready to begin.
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={cancelQuest}
                    className="px-4 py-2 border-2 border-black rounded-md bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startTimer}
                    className="px-4 py-2 border-2 border-black rounded-md bg-black text-white hover:bg-gray-800"
                  >
                    Start Timer
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-600 mb-4">
                  Task in progress...
                </div>
                <button
                  onClick={cancelQuest}
                  className="px-4 py-2 border-2 border-black rounded-md bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-4xl font-bold mb-2">Done!</div>
            <div className="mb-4">
              You earned <strong>{rewardXp} XP</strong> and{" "}
              <strong>{rewardCoins} C</strong>.
            </div>
            <button
              onClick={claimRewards}
              className="px-4 py-2 border-2 border-black rounded-md bg-white hover:bg-gray-50"
            >
              Claim and Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
