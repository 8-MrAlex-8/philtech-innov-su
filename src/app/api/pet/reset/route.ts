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

function forbiddenIfProd() {
  if (process.env.NODE_ENV === "production") {
    return true;
  }
  return false;
}

export async function GET() {
  if (forbiddenIfProd()) return new NextResponse(null, { status: 403 });
  const db = await resetDb();
  return NextResponse.json(db);
}

export async function POST() {
  if (forbiddenIfProd()) return new NextResponse(null, { status: 403 });
  const db = await resetDb();
  return NextResponse.json(db);
}
