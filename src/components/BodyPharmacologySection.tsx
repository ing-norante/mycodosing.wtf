import { NumberInput } from "@/components/NumberInput";
import { CheckboxWithLabel } from "@/components/CheckboxWithLabel";
import { MAOIHoverCard } from "@/components/MAOIHoverCard";
import { useDosageStore } from "@/stores/useDosageStore";
import { CircleQuestionMark } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      <div className="flex items-center gap-3">
        <CheckboxWithLabel
          checked={useWeightAdjustment}
          onCheckedChange={setUseWeightAdjustment}
          label="Use weight-based adjustment"
        />
        <Popover>
          <PopoverTrigger>
            <CircleQuestionMark
              className="size-4"
              aria-label="Learn more about MAOI"
            />
          </PopoverTrigger>
          <PopoverContent className="bg-main text-main-foreground flex flex-col gap-2 rounded-none text-sm">
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
          </PopoverContent>
        </Popover>
      </div>
      {useWeightAdjustment && (
        <NumberInput
          id="body-weight"
          label="Body weight (kg)"
          value={bodyWeightKg}
          onChange={setBodyWeightKg}
          min={0}
        />
      )}

      <MAOIHoverCard checked={onMAOI} onCheckedChange={setOnMAOI} />
    </div>
  );
}
