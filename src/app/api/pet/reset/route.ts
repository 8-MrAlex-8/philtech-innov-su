import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src", "data", "pet-db.json");

async function resetDb() {
  const base = { xp: 0, coins: 0, completedQuests: [] };
  await fs.promises.writeFile(DB_PATH, JSON.stringify(base, null, 2), "utf8");
  return base;
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
