import { NumberInput } from "./NumberInput";
import { SectionHeader } from "./SectionHeader";
import { CheckboxWithLabel } from "./CheckboxWithLabel";
import { MAOIHoverCard } from "./MAOIHoverCard";
import { useDosageStore } from "@/stores/useDosageStore";

export function BodyPharmacologySection() {
  const {
    bodyWeightKg,
    setBodyWeightKg,
    useWeightAdjustment,
    setUseWeightAdjustment,
    onMAOI,
    setOnMAOI,
  } = useDosageStore();

  return (
    <div className="space-y-4">
      <SectionHeader title="Body & Pharmacology" />

      <NumberInput
        id="body-weight"
        label="Body weight (kg)"
        value={bodyWeightKg}
        onChange={setBodyWeightKg}
        placeholder="70"
      />

      <CheckboxWithLabel
        checked={useWeightAdjustment}
        onCheckedChange={setUseWeightAdjustment}
        label="Use weight-based adjustment"
      />

      <MAOIHoverCard checked={onMAOI} onCheckedChange={setOnMAOI} />
    </div>
  );
}
