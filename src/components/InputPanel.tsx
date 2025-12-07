import { useState, useCallback } from "react";
import { SubstanceSelector } from "./SubstanceSelector";
import { IntensitySelector } from "./IntensitySelector";
import { AdvancedSettings } from "./AdvancedSettings";
import type {
  DosageInput,
  DosageResult,
  IntensityLevel,
} from "@/lib/calculator";
import { calculateDosage } from "@/lib/calculator";

interface InputPanelProps {
  onResult: (result: DosageResult | null) => void;
}

export function InputPanel({ onResult }: InputPanelProps) {
  // Core inputs
  const [substance, setSubstance] = useState<DosageInput["substance"]>({
    type: "mushroom",
    species: "psilocybe_cubensis",
    form: "dried",
  });
  const [intensity, setIntensity] = useState<IntensityLevel>("moderate");

  // Advanced inputs
  const [bodyWeightKg, setBodyWeightKg] = useState<number | undefined>(undefined);
  const [useWeightAdjustment, setUseWeightAdjustment] = useState(false);
  const [onMAOI, setOnMAOI] = useState(false);
  const [lastDosePsilocybinMg, setLastDosePsilocybinMg] = useState<
    number | undefined
  >(undefined);
  const [daysSinceLastDose, setDaysSinceLastDose] = useState<number | undefined>(
    undefined
  );
  const [dryingQuality, setDryingQuality] = useState<
    "optimal" | "average" | "poor"
  >("average");
  const [storageDegradation, setStorageDegradation] = useState(0);

  const handleCalculate = useCallback(() => {
    const input: DosageInput = {
      intensity,
      substance,
      bodyWeightKg,
      useWeightAdjustment,
      onMAOI,
      dryingQuality: substance.type !== "synthetic" ? dryingQuality : undefined,
      storageDegradation:
        substance.type !== "synthetic" ? storageDegradation : undefined,
    };

    // Add tolerance if both values are provided
    if (lastDosePsilocybinMg !== undefined && daysSinceLastDose !== undefined) {
      input.tolerance = {
        lastDosePsilocybinMg,
        daysSinceLastDose,
      };
    }

    try {
      const result = calculateDosage(input);
      onResult(result);
    } catch {
      // Handle any calculation errors
      onResult(null);
    }
  }, [
    intensity,
    substance,
    bodyWeightKg,
    useWeightAdjustment,
    onMAOI,
    lastDosePsilocybinMg,
    daysSinceLastDose,
    dryingQuality,
    storageDegradation,
    onResult,
  ]);

  return (
    <div className="space-y-6">
      {/* Session Setup Card */}
      <div className="brutalist-card">
        <h2 className="text-xl font-black uppercase tracking-wider mb-6 pb-3 border-b-3 border-foreground">
          Session Setup
        </h2>

        <div className="space-y-8">
          {/* Substance Selection */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              1. Select Substance
            </h3>
            <SubstanceSelector value={substance} onChange={setSubstance} />
          </section>

          {/* Intensity Selection */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              2. Choose Intensity
            </h3>
            <IntensitySelector value={intensity} onChange={setIntensity} />
          </section>
        </div>
      </div>

      {/* Advanced Settings */}
      <AdvancedSettings
        bodyWeightKg={bodyWeightKg}
        useWeightAdjustment={useWeightAdjustment}
        onMAOI={onMAOI}
        lastDosePsilocybinMg={lastDosePsilocybinMg}
        daysSinceLastDose={daysSinceLastDose}
        dryingQuality={dryingQuality}
        storageDegradation={storageDegradation}
        showMaterialQuality={substance.type !== "synthetic"}
        onBodyWeightChange={setBodyWeightKg}
        onUseWeightAdjustmentChange={setUseWeightAdjustment}
        onMAOIChange={setOnMAOI}
        onLastDoseChange={setLastDosePsilocybinMg}
        onDaysSinceChange={setDaysSinceLastDose}
        onDryingQualityChange={setDryingQuality}
        onStorageDegradationChange={setStorageDegradation}
      />

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="w-full py-4 px-6 bg-primary text-primary-foreground font-black text-xl uppercase tracking-wider border-3 border-foreground hover:brightness-110 active:brightness-90 transition-all cursor-pointer"
      >
        Calculate Dose
      </button>
    </div>
  );
}

