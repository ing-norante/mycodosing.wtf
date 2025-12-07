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
import { Card } from "@/components/ui/card";

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
  const [bodyWeightKg, setBodyWeightKg] = useState<number | undefined>(
    undefined,
  );
  const [useWeightAdjustment, setUseWeightAdjustment] = useState(false);
  const [onMAOI, setOnMAOI] = useState(false);
  const [lastDosePsilocybinMg, setLastDosePsilocybinMg] = useState<
    number | undefined
  >(undefined);
  const [daysSinceLastDose, setDaysSinceLastDose] = useState<
    number | undefined
  >(undefined);
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
      <Card className="p-2 lg:p-4">
        <h2 className="border-foreground mb-6 border-b-3 pb-3 text-xl font-black tracking-wider uppercase">
          Session Setup
        </h2>

        <div className="space-y-8">
          {/* Substance Selection */}
          <section>
            <h3 className="mb-4 text-xs tracking-widest uppercase">
              1. Select Substance
            </h3>
            <SubstanceSelector value={substance} onChange={setSubstance} />
          </section>

          {/* Intensity Selection */}
          <section>
            <h3 className="mb-4 text-xs tracking-widest uppercase">
              2. Choose Intensity
            </h3>
            <IntensitySelector value={intensity} onChange={setIntensity} />
          </section>
        </div>
      </Card>

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
        className="bg-main text-main-foreground border-foreground w-full cursor-pointer border-3 px-6 py-4 text-xl font-black tracking-wider uppercase transition-all hover:brightness-110 active:brightness-90"
      >
        Calculate Dose
      </button>
    </div>
  );
}
