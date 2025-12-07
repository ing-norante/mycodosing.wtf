import { NumberInput } from "./NumberInput";
import { SectionHeader } from "./SectionHeader";
import { CheckboxWithLabel } from "./CheckboxWithLabel";
import { MAOIHoverCard } from "./MAOIHoverCard";

interface BodyPharmacologySectionProps {
  bodyWeightKg: number | undefined;
  useWeightAdjustment: boolean;
  onMAOI: boolean;
  onBodyWeightChange: (weight: number | undefined) => void;
  onUseWeightAdjustmentChange: (use: boolean) => void;
  onMAOIChange: (on: boolean) => void;
}

export function BodyPharmacologySection({
  bodyWeightKg,
  useWeightAdjustment,
  onMAOI,
  onBodyWeightChange,
  onUseWeightAdjustmentChange,
  onMAOIChange,
}: BodyPharmacologySectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Body & Pharmacology" />

      <NumberInput
        id="body-weight"
        label="Body weight (kg)"
        value={bodyWeightKg}
        onChange={onBodyWeightChange}
        placeholder="70"
      />

      <CheckboxWithLabel
        checked={useWeightAdjustment}
        onCheckedChange={onUseWeightAdjustmentChange}
        label="Use weight-based adjustment"
      />

      <MAOIHoverCard checked={onMAOI} onCheckedChange={onMAOIChange} />
    </div>
  );
}
