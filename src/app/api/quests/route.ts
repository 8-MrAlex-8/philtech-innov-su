import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    let role = (url.searchParams.get("role") || "").toString();
    let typeParam = url.searchParams.get("type") || null;
    const fromPlayer = url.searchParams.get("fromPlayer") === "true";

    // If requested, infer type from playerdata.json
    if (fromPlayer && !typeParam) {
      try {
        const playerPath = path.join(process.cwd(), "src", "data", "playerdata.json");
        const rawPlayer = await fs.promises.readFile(playerPath, "utf-8");
        const player = JSON.parse(rawPlayer || "{}");
        typeParam = player?.pet?.petName ?? player?.pet?.petId?.toString() ?? null;
      } catch (e) {
        // ignore: fallback to query or defaults below
      }
    }

    // If role not provided, try to infer it from the referer (calling page)
    if (!role && fromPlayer) {
      const referer = (req.headers.get("referer") || "").toString();
      if (referer.includes("/dungeon-master") || referer.includes("/dungeon")) {
        role = "dungeonMaster";
      }
    }

    // Final fallback role
    if (!role) role = "pet";

    const filePath = path.join(process.cwd(), "src", "data", "quests.json");
    const raw = await fs.promises.readFile(filePath, "utf-8");
    const data = JSON.parse(raw || "{}");

    let quests: any = [];

    // If quests are organized by role -> type -> []
    if (typeParam && data[role] && typeof data[role] === "object" && !Array.isArray(data[role])) {
      quests = data[role][typeParam] ?? data[role]["default"] ?? data[role]["all"] ?? [];
    } else {
      // Fallback: role could map directly to an array, or use top-level default
      quests = data[role] ?? data["default"] ?? [];
    }

    return NextResponse.json(quests);
  } catch (e) {
    return NextResponse.json([]);
  }
}
