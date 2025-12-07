import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  return (
    <Label className="flex cursor-pointer items-center gap-3 font-semibold">
      <Checkbox
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <span className="text-sm">{label}</span>
    </Label>
  );
}
