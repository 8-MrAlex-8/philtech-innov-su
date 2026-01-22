import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src", "data", "pet-db.json");

async function resetDb() {
  const base = { xp: 0, coins: 0, completedQuests: [] };
  await fs.promises.writeFile(DB_PATH, JSON.stringify(base, null, 2), "utf8");
  return base;
}

async function resetQuests() {
  const quests = {
    default: [
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
    ],
  };

  const Q_PATH = path.join(process.cwd(), "src", "data", "quests.json");
  await fs.promises.writeFile(Q_PATH, JSON.stringify(quests, null, 2), "utf8");
  return quests;
}

function forbiddenIfProd() {
  if (process.env.NODE_ENV === "production") {
    return true;
  }
  return false;
}

export async function GET() {
  if (forbiddenIfProd()) return new NextResponse(null, { status: 403 });
  const db = await resetDb();
  const quests = await resetQuests();
  return NextResponse.json({ db, quests });
}

export async function POST() {
  if (forbiddenIfProd()) return new NextResponse(null, { status: 403 });
  const db = await resetDb();
  const quests = await resetQuests();
  return NextResponse.json({ db, quests });
}
