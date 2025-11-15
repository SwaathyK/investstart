export type AvatarStyle = "Circle" | "Transparent";

export type Rarity = "common" | "rare" | "legendary";

export interface AvatarConfig {
  avatarStyle: AvatarStyle;
  topType: string;
  accessoriesType: string;
  hairColor: string;
  facialHairType: string;
  clotheType: string;
  clotheColor: string;
  graphicType: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
}

export interface Outfit {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  unlockCondition: string;
  requiredCourseId?: string;
  isPremium?: boolean;
  previewConfigOverrides: Partial<AvatarConfig>;
}

export interface AvatarApiResponse {
  avatarConfig: AvatarConfig;
  selectedOutfitId: string | null;
  unlockedOutfitIds: string[];
  savedAt: string;
}

export interface SaveAvatarRequest {
  avatarConfig: AvatarConfig;
  selectedOutfitId: string | null;
}

export interface SaveAvatarResponse {
  success: boolean;
  avatarConfig: AvatarConfig;
  selectedOutfitId: string | null;
  savedAt: string;
}

export interface OutfitsResponse {
  outfits: Outfit[];
}
