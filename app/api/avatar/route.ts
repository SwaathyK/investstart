import { NextResponse } from "next/server";
import { defaultAvatarConfig, defaultUnlockedOutfitIds } from "@/data/avatar";
import {
  AvatarApiResponse,
  AvatarConfig,
  SaveAvatarRequest,
  SaveAvatarResponse
} from "@/types/avatar";

let storedConfig: AvatarConfig = { ...defaultAvatarConfig };
let storedOutfitId: string | null = null;
let savedAt = new Date().toISOString();
const unlockedOutfitIds = new Set<string>(defaultUnlockedOutfitIds);

function snapshot(): AvatarApiResponse {
  return {
    avatarConfig: { ...storedConfig },
    selectedOutfitId: storedOutfitId,
    unlockedOutfitIds: Array.from(unlockedOutfitIds),
    savedAt
  };
}

export async function GET() {
  return NextResponse.json(snapshot());
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SaveAvatarRequest | undefined;
    if (!payload || !payload.avatarConfig) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    storedConfig = { ...payload.avatarConfig };
    storedOutfitId = payload.selectedOutfitId ?? null;
    if (storedOutfitId) {
      unlockedOutfitIds.add(storedOutfitId);
    }
    savedAt = new Date().toISOString();

    const response: SaveAvatarResponse = {
      success: true,
      avatarConfig: { ...storedConfig },
      selectedOutfitId: storedOutfitId,
      savedAt
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to save avatar" },
      { status: 500 }
    );
  }
}
