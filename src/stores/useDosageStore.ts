import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DosageInput, IntensityLevel } from "@/lib/calculator";

interface DosageStore {
  // Substance selection
  substance: DosageInput["substance"];
  setSubstance: (substance: DosageInput["substance"]) => void;

  // Intensity
  intensity: IntensityLevel;
  setIntensity: (intensity: IntensityLevel) => void;

  // Body & pharmacology
  bodyWeightKg: number | undefined;
  setBodyWeightKg: (weight: number | undefined) => void;
  useWeightAdjustment: boolean;
  setUseWeightAdjustment: (use: boolean) => void;
  onMAOI: boolean;
  setOnMAOI: (on: boolean) => void;

  // Tolerance
  lastDosePsilocybinMg: number | undefined;
  setLastDosePsilocybinMg: (mg: number | undefined) => void;
  daysSinceLastDose: number | undefined;
  setDaysSinceLastDose: (days: number | undefined) => void;

  // Material quality
  dryingQuality: "optimal" | "average" | "poor";
  setDryingQuality: (quality: "optimal" | "average" | "poor") => void;
  storageDegradation: number;
  setStorageDegradation: (degradation: number) => void;

  // Reset to defaults
  reset: () => void;
}

const initialState = {
  substance: {
    type: "mushroom",
    species: "psilocybe_cubensis",
    form: "dried",
  } as DosageInput["substance"],
  intensity: "moderate" as IntensityLevel,
  bodyWeightKg: undefined,
  useWeightAdjustment: false,
  onMAOI: false,
  lastDosePsilocybinMg: undefined,
  daysSinceLastDose: undefined,
  dryingQuality: "average" as const,
  storageDegradation: 0,
};

export const useDosageStore = create<DosageStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSubstance: (substance) => set({ substance }),
      setIntensity: (intensity) => set({ intensity }),
      setBodyWeightKg: (bodyWeightKg) => set({ bodyWeightKg }),
      setUseWeightAdjustment: (useWeightAdjustment) =>
        set({ useWeightAdjustment }),
      setOnMAOI: (onMAOI) => set({ onMAOI }),
      setLastDosePsilocybinMg: (lastDosePsilocybinMg) =>
        set({ lastDosePsilocybinMg }),
      setDaysSinceLastDose: (daysSinceLastDose) => set({ daysSinceLastDose }),
      setDryingQuality: (dryingQuality) => set({ dryingQuality }),
      setStorageDegradation: (storageDegradation) =>
        set({ storageDegradation }),
      reset: () => set(initialState),
    }),
    {
      name: "mycometric-settings",
      partialize: (state) => ({
        // Only persist safe, stable preferences
        substance: state.substance,
        bodyWeightKg: state.bodyWeightKg,
        useWeightAdjustment: state.useWeightAdjustment,
        dryingQuality: state.dryingQuality,
        // NOT persisted for safety/freshness:
        // - onMAOI (dangerous to accidentally apply)
        // - lastDosePsilocybinMg, daysSinceLastDose (tolerance changes constantly)
        // - storageDegradation (varies per batch)
        // - intensity (user likely wants fresh choice each session)
      }),
    },
  ),
);

