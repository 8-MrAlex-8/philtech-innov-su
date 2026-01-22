import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src", "data", "pet-db.json");

async function readDb() {
  try {
    const raw = await fs.promises.readFile(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { xp: 0, coins: 0, completedQuests: [] };
  }
}

async function writeDb(obj: any) {
  await fs.promises.writeFile(DB_PATH, JSON.stringify(obj, null, 2), "utf8");
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const db = await readDb();

  // Add xp/coins
  if (typeof body.xp === "number") db.xp = (db.xp || 0) + body.xp;
  if (typeof body.coins === "number") db.coins = (db.coins || 0) + body.coins;

  // Add completed quests (single string or array)
  const existing: string[] = Array.isArray(db.completedQuests) ? db.completedQuests : [];
  if (body.completed) {
    if (Array.isArray(body.completed)) {
      for (const id of body.completed) if (!existing.includes(id)) existing.push(id);
    } else if (typeof body.completed === "string") {
      if (!existing.includes(body.completed)) existing.push(body.completed);
    }
  }
  db.completedQuests = existing;

  await writeDb(db);
  return NextResponse.json(db);
}
