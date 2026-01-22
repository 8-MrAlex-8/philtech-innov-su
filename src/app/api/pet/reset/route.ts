import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src", "data", "playerdata.json");

async function resetDb() {
  let data: any;
  try {
    const raw = await fs.promises.readFile(DB_PATH, "utf8");
    data = JSON.parse(raw);
  } catch (e) {
    data = {
      playerId: "player_001",
      name: "New Player",
      level: 1,
      xp: 0,
      coins: 0,
      completedQuests: [],
      inventory: [],
      pet: { petId: null, petName: null },
    };
  }

  data.xp = 0;
  data.coins = 0;
  data.completedQuests = [];
  data.inventory = [];

  // Clear pet selection on reset
  data.pet = data.pet || { petId: null, petName: null };
  data.pet.petId = null;
  data.pet.petName = null;

  await fs.promises.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  return data;
}

async function resetQuests() {
  const quests = {
    pet: [
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
    dungeonMaster: [
      {
        id: "armor-inspection",
        title: "Armor Inspection",
        description:
          "Your warrior’s armor has a few scuffs from yesterday’s adventure. Take a moment to straighten up your space or tidy your desk — the armor shines brighter with your care.",
        duration: 5,
        xp: 8,
        coins: 2,
      },
      {
        id: "morning-drill",
        title: "Morning Drill",
        description:
          "The warrior stretches and sharpens their stance. Stand up and do a few stretches or arm movements to join the morning drill.",
        duration: 3,
        xp: 5,
        coins: 1,
      },
      {
        id: "map-exploration",
        title: "Map Exploration",
        description:
          "A new map of the enchanted forest appears. Take 5–10 minutes to read a short article, story, or notes — your warrior studies the terrain.",
        duration: 10,
        xp: 12,
        coins: 4,
      },
      {
        id: "trail-march",
        title: "Trail March",
        description:
          "The path ahead winds through the misty woods. Take a short walk around your home or outside, and let your warrior lead the way.",
        duration: 15,
        xp: 20,
        coins: 8,
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
