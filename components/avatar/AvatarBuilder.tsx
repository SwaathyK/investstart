"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Dice3, Loader2, RefreshCcw, Save, CheckCircle2, Sparkles, X } from "lucide-react";
import type { AvatarConfig, AvatarApiResponse, Outfit } from "@/types/avatar";
import { defaultAvatarConfig } from "@/data/avatar";

const AvatarPreview = dynamic(() => import("avataaars"), { ssr: false });

interface Option {
  value: string;
  label: string;
}

const skinToneOptions: Option[] = [
  { value: "Pale", label: "Porcelain" },
  { value: "Light", label: "Light" },
  { value: "Tanned", label: "Sun Kissed" },
  { value: "Brown", label: "Warm Brown" },
  { value: "DarkBrown", label: "Deep Brown" },
  { value: "Black", label: "Ebony" }
];

const hairStyleOptions: Option[] = [
  { value: "ShortHairShortCurly", label: "Curly" },
  { value: "ShortHairShaggyMullet", label: "Shaggy" },
  { value: "ShortHairSides", label: "Side Part" },
  { value: "LongHairStraight2", label: "Straight" },
  { value: "LongHairCurly", label: "Wavy" },
  { value: "LongHairFro", label: "Fro" }
];

const hairColorOptions: Option[] = [
  { value: "Brown", label: "Chestnut" },
  { value: "BrownDark", label: "Coffee" },
  { value: "Black", label: "Ink" },
  { value: "Blonde", label: "Sand" },
  { value: "BlondeGolden", label: "Honey" },
  { value: "Auburn", label: "Copper" },
  { value: "PastelPink", label: "Berry" },
  { value: "SilverGray", label: "Silver" },
  { value: "Red", label: "Crimson" }
];

const accessoriesOptions: Option[] = [
  { value: "Blank", label: "None" },
  { value: "Round", label: "Round Glasses" },
  { value: "Prescription01", label: "Specs" },
  { value: "Prescription02", label: "Readers" },
  { value: "Sunglasses", label: "Shades" },
  { value: "Wayfarers", label: "Wayfarers" }
];

const eyeOptions: Option[] = [
  { value: "Default", label: "Neutral" },
  { value: "Happy", label: "Happy" },
  { value: "Wink", label: "Wink" },
  { value: "Hearts", label: "Hearts" },
  { value: "Side", label: "Side-eye" },
  { value: "Squint", label: "Focus" }
];

const mouthOptions: Option[] = [
  { value: "Smile", label: "Smile" },
  { value: "Serious", label: "Serious" },
  { value: "Default", label: "Neutral" },
  { value: "Twinkle", label: "Twinkle" },
  { value: "Concerned", label: "Concerned" },
  { value: "Grimace", label: "Grin" }
];

const eyebrowOptions: Option[] = [
  { value: "Default", label: "Default" },
  { value: "DefaultNatural", label: "Natural" },
  { value: "RaisedExcited", label: "Raised" },
  { value: "UpDown", label: "Up & Down" },
  { value: "AngryNatural", label: "Bold" },
  { value: "UpDownNatural", label: "Lifted" }
];

const facialHairOptions: Option[] = [
  { value: "Blank", label: "None" },
  { value: "BeardLight", label: "Beard Light" },
  { value: "BeardMedium", label: "Beard Medium" },
  { value: "MoustacheFancy", label: "Fancy" },
  { value: "MoustacheMagnum", label: "Magnum" }
];

const clothesOptions: Option[] = [
  { value: "BlazerShirt", label: "Blazer Shirt" },
  { value: "BlazerSweater", label: "Blazer Sweater" },
  { value: "CollarSweater", label: "Collar Sweater" },
  { value: "GraphicShirt", label: "Graphic Tee" },
  { value: "Hoodie", label: "Hoodie" },
  { value: "Overall", label: "Overall" },
  { value: "ShirtCrewNeck", label: "Crew Neck" },
  { value: "ShirtVNeck", label: "V Neck" }
];

const clothesColorOptions: Option[] = [
  { value: "Black", label: "Black" },
  { value: "Blue01", label: "Blue 01" },
  { value: "Blue02", label: "Blue 02" },
  { value: "Blue03", label: "Blue 03" },
  { value: "Gray01", label: "Gray 01" },
  { value: "Gray02", label: "Gray 02" },
  { value: "PastelBlue", label: "Pastel Blue" },
  { value: "PastelGreen", label: "Pastel Green" },
  { value: "PastelOrange", label: "Pastel Orange" },
  { value: "PastelYellow", label: "Pastel Yellow" },
  { value: "PastelRed", label: "Pastel Red" },
  { value: "Pink", label: "Pink" },
  { value: "Red", label: "Red" },
  { value: "White", label: "White" }
];

const graphicOptions: Option[] = [
  { value: "Diamond", label: "Diamond" },
  { value: "Resist", label: "Resist" },
  { value: "Bear", label: "Bear" },
  { value: "SkullOutline", label: "Skull" },
  { value: "Pizza", label: "Pizza" },
  { value: "Hola", label: "Hola" }
];

const optionGroups: Array<{
  title: string;
  options: Option[];
  field: keyof AvatarConfig;
}> = [
  { title: "Skin", options: skinToneOptions, field: "skinColor" },
  { title: "Hair style", options: hairStyleOptions, field: "topType" },
  { title: "Hair color", options: hairColorOptions, field: "hairColor" },
  { title: "Accessories", options: accessoriesOptions, field: "accessoriesType" },
  { title: "Eyes", options: eyeOptions, field: "eyeType" },
  { title: "Eyebrows", options: eyebrowOptions, field: "eyebrowType" },
  { title: "Mouth", options: mouthOptions, field: "mouthType" },
  { title: "Facial hair", options: facialHairOptions, field: "facialHairType" },
  { title: "Clothing", options: clothesOptions, field: "clotheType" },
  { title: "Clothing color", options: clothesColorOptions, field: "clotheColor" },
  { title: "Graphic", options: graphicOptions, field: "graphicType" }
];

function randomPick(options: Option[]) {
  return options[Math.floor(Math.random() * options.length)].value;
}

function mergeConfig(base: AvatarConfig, outfit: Outfit | undefined) {
  if (!outfit) return base;
  return {
    ...base,
    ...outfit.previewConfigOverrides
  };
}

export function AvatarBuilder() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [baseConfig, setBaseConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const [savedConfig, setSavedConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const [savedOutfitId, setSavedOutfitId] = useState<string | null>(null);
  const [unlockedOutfitIds, setUnlockedOutfitIds] = useState<string[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      try {
        setLoading(true);
        const [avatarRes, outfitRes] = await Promise.all([fetch("/api/avatar"), fetch("/api/outfits")]);
        if (!avatarRes.ok || !outfitRes.ok) {
          throw new Error("Unable to load avatar studio");
        }
        const avatarPayload = (await avatarRes.json()) as AvatarApiResponse;
        const outfitsPayload = (await outfitRes.json()) as { outfits: Outfit[] };
        if (!mounted) return;
        setBaseConfig(avatarPayload.avatarConfig ?? defaultAvatarConfig);
        setSavedConfig(avatarPayload.avatarConfig ?? defaultAvatarConfig);
        setSelectedOutfitId(avatarPayload.selectedOutfitId ?? null);
        setSavedOutfitId(avatarPayload.selectedOutfitId ?? null);
        setUnlockedOutfitIds(avatarPayload.unlockedOutfitIds ?? []);
        setOutfits(outfitsPayload.outfits ?? []);
        setSavedAt(avatarPayload.savedAt ?? null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!banner) return;
    const timer = window.setTimeout(() => setBanner(null), 2600);
    return () => window.clearTimeout(timer);
  }, [banner]);

  useEffect(() => {
    if (showSuccessModal) {
      // Auto-close after 5 seconds
      const timer = window.setTimeout(() => setShowSuccessModal(false), 5000);
      return () => window.clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const selectedOutfit = useMemo(
    () => outfits.find((outfit) => outfit.id === selectedOutfitId),
    [outfits, selectedOutfitId]
  );

  const appliedConfig = useMemo(
    () => mergeConfig(baseConfig, selectedOutfit),
    [baseConfig, selectedOutfit]
  );

  const savedOutfit = useMemo(
    () => outfits.find((outfit) => outfit.id === savedOutfitId),
    [outfits, savedOutfitId]
  );

  const savedAppliedConfig = useMemo(
    () => mergeConfig(savedConfig, savedOutfit),
    [savedConfig, savedOutfit]
  );

  const unlockedSet = useMemo(() => new Set(unlockedOutfitIds), [unlockedOutfitIds]);

  const hasUnsavedChanges =
    JSON.stringify(baseConfig) !== JSON.stringify(savedConfig) || selectedOutfitId !== savedOutfitId;

  const handleUpdate = (field: keyof AvatarConfig, value: string) => {
    setBaseConfig((prev) => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // If clothing type changes to non-GraphicShirt, keep graphicType but it won't display
      // If clothing type changes to GraphicShirt, ensure graphicType is set
      if (field === 'clotheType') {
        if (value !== 'GraphicShirt' && prev.clotheType === 'GraphicShirt') {
          // Switching away from GraphicShirt - graphic will be hidden but value preserved
        } else if (value === 'GraphicShirt' && !prev.graphicType) {
          // Switching to GraphicShirt - set a default graphic if none exists
          updated.graphicType = 'Diamond';
        }
      }
      
      return updated;
    });
  };

  const randomize = () => {
    setBaseConfig((prev) => ({
      ...prev,
      skinColor: randomPick(skinToneOptions),
      topType: randomPick(hairStyleOptions),
      hairColor: randomPick(hairColorOptions),
      accessoriesType: randomPick(accessoriesOptions),
      eyeType: randomPick(eyeOptions),
      eyebrowType: randomPick(eyebrowOptions),
      mouthType: randomPick(mouthOptions),
      facialHairType: randomPick(facialHairOptions),
      clotheType: randomPick(clothesOptions),
      clotheColor: randomPick(clothesColorOptions),
      graphicType: randomPick(graphicOptions)
    }));
  };

  const handleSelectOutfit = (outfit: Outfit) => {
    if (!unlockedSet.has(outfit.id)) {
      setBanner(outfit.unlockCondition);
      return;
    }
    setSelectedOutfitId(outfit.id);
  };

  const clearOutfit = () => setSelectedOutfitId(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const response = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarConfig: baseConfig, selectedOutfitId })
      });
      const payload = (await response.json()) as AvatarApiResponse & { success?: boolean };
      if (!response.ok || payload.success === false) {
        throw new Error((payload as { error?: string }).error ?? "Unable to save avatar");
      }
      setSavedConfig(payload.avatarConfig ?? baseConfig);
      setSavedOutfitId(payload.selectedOutfitId ?? null);
      setUnlockedOutfitIds(payload.unlockedOutfitIds ?? unlockedOutfitIds);
      setSavedAt(payload.savedAt ?? new Date().toISOString());
      setBanner("Avatar saved!");
      
      // Show success modal with animation
      setShowSuccessModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const revertChanges = () => {
    setBaseConfig(savedConfig);
    setSelectedOutfitId(savedOutfitId);
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-md">
          <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
          <span className="text-sm font-medium text-gray-700">Loading avatar studio…</span>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row">
      <section className="w-full rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-xl lg:w-1/2">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">Live preview</p>
            <h1 className="text-3xl font-bold text-gray-900">Assemble your Avataaars buddy</h1>
          </div>
          <button
            type="button"
            onClick={randomize}
            className="inline-flex items-center gap-2 rounded-full border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5"
          >
            <Dice3 className="h-4 w-4" />
            Randomize
          </button>
        </header>
        <div className="mt-6 rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center shadow-inner">
          <div className="mx-auto w-60">
            <AvatarPreview
              {...appliedConfig}
            />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            {selectedOutfit ? `Showing ${selectedOutfit.name} preset` : "Freestyle look"}
          </p>
          {banner ? <p className="mt-2 text-xs font-semibold uppercase text-primary-500">{banner}</p> : null}
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        </div>
        <footer className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!hasUnsavedChanges || isSaving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md disabled:border-blue-200 disabled:bg-blue-200"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save avatar"}
          </button>
          <button
            type="button"
            onClick={revertChanges}
            disabled={!hasUnsavedChanges}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Revert
          </button>
          <button
            type="button"
            onClick={clearOutfit}
            className="text-sm font-medium text-gray-500 underline underline-offset-4"
          >
            Clear outfit
          </button>
          {savedAt ? <span className="ml-auto text-xs text-gray-500">Last saved {new Date(savedAt).toLocaleString()}</span> : null}
        </footer>
      </section>

      <section className="flex flex-1 flex-col gap-6 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-900">Style controls</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {optionGroups.map((group) => {
            const isGraphicOption = group.field === 'graphicType';
            const isGraphicShirt = baseConfig.clotheType === 'GraphicShirt';
            const isDisabled = isGraphicOption && !isGraphicShirt;
            
            return (
              <label 
                key={group.title} 
                className={`flex flex-col gap-2 rounded-2xl border border-gray-200 p-4 text-sm text-gray-700 ${
                  isDisabled ? 'bg-gray-100/50 opacity-60' : 'bg-gray-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-gray-500">{group.title}</span>
                  {isGraphicOption && !isGraphicShirt && (
                    <span className="text-xs text-orange-600 font-medium">Requires Graphic Tee</span>
                  )}
                </div>
                <select
                  className={`rounded-xl border border-gray-300 px-3 py-2 text-base font-medium text-gray-900 focus:border-gray-900 focus:outline-none ${
                    isDisabled ? 'cursor-not-allowed bg-gray-100' : ''
                  }`}
                  value={baseConfig[group.field]}
                  onChange={(event) => handleUpdate(group.field, event.target.value)}
                  disabled={isDisabled}
                >
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Course & premium outfits</h3>
          <p className="text-sm text-gray-600">
            Unlock outfits as you progress through learning paths. Selecting one overlays its recommended palette on your avatar.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {outfits.map((outfit) => {
              const unlocked = unlockedSet.has(outfit.id) || !outfit.requiredCourseId;
              const isActive = selectedOutfitId === outfit.id;
              return (
                <article
                  key={outfit.id}
                  className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-sm ${isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
                >
                  <div>
                    <p className="text-sm uppercase text-gray-500">{outfit.rarity}</p>
                    <h4 className="text-lg font-semibold text-gray-900">{outfit.name}</h4>
                    <p className="text-sm text-gray-600">{outfit.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {outfit.requiredCourseId ? (
                      <span className="rounded-full border border-gray-300 px-2.5 py-0.5 text-xs text-gray-600">
                        Requires {outfit.requiredCourseId}
                      </span>
                    ) : null}
                    {outfit.isPremium ? (
                      <span className="rounded-full border border-amber-400 bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700">
                        Premium drop
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectOutfit(outfit)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      unlocked
                        ? isActive
                          ? "bg-gray-900 text-white"
                          : "border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                        : "border border-dashed border-gray-300 text-gray-400"
                    }`}
                  >
                    {unlocked ? (isActive ? "Equipped" : "Equip outfit") : "Locked"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon with Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-green-100 rounded-full p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Avatar Created Successfully! 🎉
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Your avatar has been saved and is ready to use
            </p>

            {/* Saved Avatar Preview with Animation */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 mb-6 border-2 border-primary-200 overflow-hidden">
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="transform transition-all duration-500 animate-bounce-slow">
                  <div className="w-48 h-48 mx-auto flex items-center justify-center">
                    <AvatarPreview
                      {...savedAppliedConfig}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-sm font-semibold text-gray-700">Your New Avatar</span>
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                Awesome!
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
