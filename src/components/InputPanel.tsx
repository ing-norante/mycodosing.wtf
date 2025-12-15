import { useCallback } from "react";
import { SubstanceSelector } from "./SubstanceSelector";
import { IntensitySelector } from "./IntensitySelector";
import { AdvancedSettings } from "./AdvancedSettings";
import type { DosageInput, DosageResult } from "@/lib/calculator";
import { calculateDosage } from "@/lib/calculator";
import { Card } from "@/components/ui/card";
import { useDosageStore } from "@/stores/useDosageStore";
import { usePostHog } from "posthog-js/react";
import { BodyPharmacologySection } from "./BodyPharmacologySection";

interface InputPanelProps {
  onResult: (result: DosageResult | null, input?: DosageInput) => void;
}

export function InputPanel({ onResult }: InputPanelProps) {
  const posthog = usePostHog();
  const {
    substance,
    intensity,
    bodyWeightKg,
    useWeightAdjustment,
    onMAOI,
    lastDosePsilocybinMg,
    daysSinceLastDose,
    dryingQuality,
    storageDegradation,
  } = useDosageStore();

  const isCalculateDisabled =
    useWeightAdjustment && bodyWeightKg === undefined;

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
      onResult(result, input);
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
            <SubstanceSelector />
          </section>
          {/* Body & Pharmacology Adjustments */}
          <section>
            <h3 className="mb-4 text-xs tracking-widest uppercase">
              2. Body & Pharmacology Adjustments
            </h3>
            <BodyPharmacologySection />
          </section>
          {/* Intensity Selection */}
          <section>
            <h3 className="mb-4 text-xs tracking-widest uppercase">
              3. Choose Intensity
            </h3>
            <IntensitySelector />
          </section>
        </div>
      </Card>

      {/* Advanced Settings */}
      <AdvancedSettings showMaterialQuality={substance.type !== "synthetic"} />

      {/* Calculate Button */}
      <button
        onClick={() => {
          handleCalculate();
          posthog.capture("calculate_dosage_button_clicked", {
            intensity,
            substance,
            bodyWeightKg,
            useWeightAdjustment,
            onMAOI,
            lastDosePsilocybinMg,
            daysSinceLastDose,
            dryingQuality,
            storageDegradation,
          });
        }}
        disabled={isCalculateDisabled}
        className="bg-main active:translate-x-boxShadowX active:translate-y-boxShadowY hover:translate-x-boxShadowX hover:translate-y-boxShadowY text-main-foreground border-foreground shadow-shadow w-full cursor-pointer border-3 px-6 py-4 text-xl font-black tracking-wider uppercase transition-all hover:shadow-none active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-shadow disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-shadow"
      >
        Calculate Dose
      </button>
    </div>
  );
}
