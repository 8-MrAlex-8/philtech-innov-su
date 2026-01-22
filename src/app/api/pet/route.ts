import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PLAYER_DATA_PATH = path.join(process.cwd(), "src", "data", "playerdata.json");
const PLAYER_ID = "player_001";

async function readPlayerData() {
  try {
    const raw = await fs.promises.readFile(PLAYER_DATA_PATH, "utf8");
    const data = JSON.parse(raw);
    return data;
  } catch (e) {
    return {
      playerId: PLAYER_ID,
      name: "New Player",
      level: 1,
      xp: 0,
      coins: 0,
      completedQuests: [],
      inventory: [],
      pet: {
        petId: null,
        petName: null
      }
    };
  }
}

async function writePlayerData(data: any) {
  await fs.promises.writeFile(PLAYER_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const playerData = await readPlayerData();
  return NextResponse.json(playerData);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const playerData = await readPlayerData();

  // Add xp/coins
  if (typeof body.xp === "number") playerData.xp = (playerData.xp || 0) + body.xp;
  if (typeof body.coins === "number") playerData.coins = (playerData.coins || 0) + body.coins;

  // Add completed quests (single string or array)
  const existing: string[] = Array.isArray(playerData.completedQuests) ? playerData.completedQuests : [];
  if (body.completed) {
    if (Array.isArray(body.completed)) {
      for (const id of body.completed) if (!existing.includes(id)) existing.push(id);
    } else if (typeof body.completed === "string") {
      if (!existing.includes(body.completed)) existing.push(body.completed);
    }
  }
  playerData.completedQuests = existing;

  // Save pet selection
  if (body.petId !== undefined) {
    playerData.pet.petId = body.petId;
  }
  if (body.petName !== undefined) {
    playerData.pet.petName = body.petName;
  }

  await writePlayerData(playerData);
  return NextResponse.json(playerData);
}
