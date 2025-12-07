import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BodyPharmacologySection } from "./BodyPharmacologySection";
import { ToleranceSection } from "./ToleranceSection";
import { MaterialQualitySection } from "./MaterialQualitySection";

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
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-background">Advanced Factors</AccordionTrigger>
        <AccordionContent className="bg-background">
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <BodyPharmacologySection
                bodyWeightKg={bodyWeightKg}
                useWeightAdjustment={useWeightAdjustment}
                onMAOI={onMAOI}
                onBodyWeightChange={onBodyWeightChange}
                onUseWeightAdjustmentChange={onUseWeightAdjustmentChange}
                onMAOIChange={onMAOIChange}
              />

              <ToleranceSection
                lastDosePsilocybinMg={lastDosePsilocybinMg}
                daysSinceLastDose={daysSinceLastDose}
                onLastDoseChange={onLastDoseChange}
                onDaysSinceChange={onDaysSinceChange}
              />

              {showMaterialQuality && (
                <MaterialQualitySection
                  dryingQuality={dryingQuality}
                  storageDegradation={storageDegradation}
                  onDryingQualityChange={onDryingQualityChange}
                  onStorageDegradationChange={onStorageDegradationChange}
                />
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
