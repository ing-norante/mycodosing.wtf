import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { estimateToleranceStatus } from "@/lib/calculator";

interface AdvancedSettingsProps {
  bodyWeightKg: number | undefined;
  useWeightAdjustment: boolean;
  onMAOI: boolean;
  lastDosePsilocybinMg: number | undefined;
  daysSinceLastDose: number | undefined;
  dryingQuality: "optimal" | "average" | "poor";
  storageDegradation: number;
  showMaterialQuality: boolean; // Hide for synthetics
  onBodyWeightChange: (weight: number | undefined) => void;
  onUseWeightAdjustmentChange: (use: boolean) => void;
  onMAOIChange: (on: boolean) => void;
  onLastDoseChange: (mg: number | undefined) => void;
  onDaysSinceChange: (days: number | undefined) => void;
  onDryingQualityChange: (quality: "optimal" | "average" | "poor") => void;
  onStorageDegradationChange: (degradation: number) => void;
}

export function AdvancedSettings({
  bodyWeightKg,
  useWeightAdjustment,
  onMAOI,
  lastDosePsilocybinMg,
  daysSinceLastDose,
  dryingQuality,
  storageDegradation,
  showMaterialQuality,
  onBodyWeightChange,
  onUseWeightAdjustmentChange,
  onMAOIChange,
  onLastDoseChange,
  onDaysSinceChange,
  onDryingQualityChange,
  onStorageDegradationChange,
}: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toleranceStatus =
    daysSinceLastDose !== undefined
      ? estimateToleranceStatus(daysSinceLastDose)
      : null;

  return (
    <div className="brutalist-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <span className="font-bold text-lg uppercase tracking-wider">
          Advanced Factors
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="mt-6 space-y-6">
          {/* Grid layout for sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Body & Pharmacology */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                Body & Pharmacology
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Body weight (kg)
                </label>
                <input
                  type="number"
                  value={bodyWeightKg ?? ""}
                  onChange={(e) =>
                    onBodyWeightChange(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="70"
                  className="w-full px-3 py-2 border-3 border-foreground bg-input font-mono"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useWeightAdjustment}
                  onChange={(e) => onUseWeightAdjustmentChange(e.target.checked)}
                />
                <span className="text-sm">
                  Use weight-based adjustment
                  <span className="block text-xs text-muted-foreground mt-1">
                    Not recommended 49–113 kg (Garcia-Romeu 2021)
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onMAOI}
                  onChange={(e) => onMAOIChange(e.target.checked)}
                />
                <span className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-severity-danger" />
                  <span>
                    Currently on an MAOI
                    <span className="block text-xs text-severity-danger mt-1">
                      Dangerous interaction — dose halved automatically
                    </span>
                  </span>
                </span>
              </label>
            </div>

            {/* Tolerance */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                Tolerance
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Last psilocybin-equiv dose (mg)
                </label>
                <input
                  type="number"
                  value={lastDosePsilocybinMg ?? ""}
                  onChange={(e) =>
                    onLastDoseChange(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="25"
                  className="w-full px-3 py-2 border-3 border-foreground bg-input font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Days since last session
                </label>
                <input
                  type="number"
                  value={daysSinceLastDose ?? ""}
                  onChange={(e) =>
                    onDaysSinceChange(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="14"
                  className="w-full px-3 py-2 border-3 border-foreground bg-input font-mono"
                />
              </div>

              {toleranceStatus && (
                <div
                  className={cn(
                    "p-3 border-3 text-sm",
                    toleranceStatus.tolerancePercent <= 5
                      ? "border-confidence-high bg-confidence-high/10"
                      : toleranceStatus.tolerancePercent <= 20
                      ? "border-severity-caution bg-severity-caution/10"
                      : "border-severity-warning bg-severity-warning/10"
                  )}
                >
                  <div className="font-bold font-mono">
                    {toleranceStatus.tolerancePercent}% tolerance
                  </div>
                  <div className="text-xs mt-1">{toleranceStatus.recommendation}</div>
                  {toleranceStatus.daysToFullReset > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Full reset in {toleranceStatus.daysToFullReset} days
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Tolerance builds quickly and usually resets over ~14 days.
              </p>
            </div>

            {/* Material Quality - only for natural substances */}
            {showMaterialQuality && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                  Material Quality
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Drying quality
                  </label>
                  <select
                    value={dryingQuality}
                    onChange={(e) =>
                      onDryingQualityChange(
                        e.target.value as "optimal" | "average" | "poor"
                      )
                    }
                    className="w-full px-3 py-2 border-3 border-foreground bg-input cursor-pointer"
                  >
                    <option value="optimal">Optimal (freeze/fan-dried)</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor (oven/slow-dried)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated storage potency loss (%)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={storageDegradation * 100}
                      onChange={(e) =>
                        onStorageDegradationChange(Number(e.target.value) / 100)
                      }
                      className="flex-1"
                    />
                    <span className="font-mono font-bold w-12 text-right">
                      {Math.round(storageDegradation * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Old or improperly stored material loses potency
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

