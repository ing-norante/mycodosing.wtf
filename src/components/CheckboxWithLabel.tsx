import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePostHog } from "posthog-js/react";

interface CheckboxWithLabelProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export function CheckboxWithLabel({
  checked,
  onCheckedChange,
  label,
}: CheckboxWithLabelProps) {
  const posthog = usePostHog();
  return (
    <Label className="flex cursor-pointer items-center gap-3 font-semibold">
      <Checkbox
        checked={checked}
        className="cursor-pointer"
        onCheckedChange={(checked) => {
          onCheckedChange(checked as boolean);
          posthog.capture("use_weight_adjustment_changed", {
            useWeightAdjustment: checked as boolean,
          });
        }}
      />
      <span className="text-sm">{label}</span>
    </Label>
  );
}
