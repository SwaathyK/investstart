import { AvatarConfig, Outfit } from "@/types/avatar";

export const defaultAvatarConfig: AvatarConfig = {
  avatarStyle: "Transparent",
  topType: "ShortHairShortCurly",
  accessoriesType: "Blank",
  hairColor: "BrownDark",
  facialHairType: "Blank",
  clotheType: "Hoodie",
  clotheColor: "Blue03",
  graphicType: "Diamond",
  eyeType: "Happy",
  eyebrowType: "DefaultNatural",
  mouthType: "Smile",
  skinColor: "Light"
};

export const defaultUnlockedOutfitIds: string[] = ["outfit-starter-analyst"];

export const outfits: Outfit[] = [
  {
    id: "outfit-starter-analyst",
    name: "Starter Analyst",
    description: "A cozy hoodie, confident smile, and curious eyes for new market explorers.",
    rarity: "common",
    unlockCondition: "Available to every learner",
    previewConfigOverrides: {
      clotheType: "Hoodie",
      clotheColor: "Blue03",
      graphicType: "Diamond"
    }
  },
  {
    id: "outfit-chart-wizard",
    name: "Chart Wizard",
    description: "Flowing coat with candlestick embroidery and arcane market focus.",
    rarity: "rare",
    unlockCondition: "Complete the Technical Analysis Basics course",
    requiredCourseId: "course-technical-basics",
    previewConfigOverrides: {
      topType: "LongHairCurly",
      hairColor: "SilverGray",
      clotheType: "BlazerSweater",
      clotheColor: "PastelGreen",
      accessoriesType: "Round",
      graphicType: "Resist"
    }
  },
  {
    id: "outfit-risk-taker",
    name: "Risk Taker",
    description: "Letterman jacket, bold eyebrows, and a smirk ready for the opening bell.",
    rarity: "rare",
    unlockCondition: "Complete the Intro to Markets course",
    requiredCourseId: "course-intro-markets",
    previewConfigOverrides: {
      topType: "ShortHairShaggyMullet",
      hairColor: "Black",
      eyebrowType: "RaisedExcited",
      mouthType: "Serious",
      clotheType: "BlazerShirt",
      clotheColor: "PastelOrange",
      accessoriesType: "Wayfarers"
    }
  },
  {
    id: "outfit-crypto-knight",
    name: "Crypto Knight",
    description: "Glowing helmet, cyber hoodie, and neon confidence from the future of finance.",
    rarity: "legendary",
    unlockCondition: "Premium outfit — will be purchasable soon",
    isPremium: true,
    previewConfigOverrides: {
      topType: "LongHairShavedSides",
      hairColor: "SilverGray",
      clotheType: "Hoodie",
      clotheColor: "Black",
      graphicType: "SkullOutline",
      accessoriesType: "Sunglasses",
      eyeType: "Side",
      mouthType: "Twinkle"
    }
  }
];
