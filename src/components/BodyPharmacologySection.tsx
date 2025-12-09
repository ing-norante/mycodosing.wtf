import { NumberInput } from "./NumberInput";
import { SectionHeader } from "./SectionHeader";
import { CheckboxWithLabel } from "./CheckboxWithLabel";
import { MAOIHoverCard } from "./MAOIHoverCard";
import { useDosageStore } from "@/stores/useDosageStore";
import { CircleQuestionMark } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

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

      <div className="flex items-center gap-3">
        <CheckboxWithLabel
          checked={useWeightAdjustment}
          onCheckedChange={setUseWeightAdjustment}
          label="Use weight-based adjustment"
        />
        <HoverCard>
          <HoverCardTrigger asChild>
            <CircleQuestionMark className="size-4" />
          </HoverCardTrigger>
          <HoverCardContent>
            <p>
              Clinical data{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/33611977/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Garcia-Romeu et al. (2021)
              </a>{" "}
              suggests body weight has minimal impact on intensity for adults
              between 49-113kg. If enabled, we clamp the adjustment to avoid
              dangerous overdoses for heavier users.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
      {useWeightAdjustment && (
        <NumberInput
          id="body-weight"
          label="Body weight (kg)"
          value={bodyWeightKg}
          onChange={setBodyWeightKg}
          placeholder="70"
        />
      )}

      <MAOIHoverCard checked={onMAOI} onCheckedChange={setOnMAOI} />
    </div>
  );
}
