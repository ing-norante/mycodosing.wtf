import { Button } from "@/components/ui/button";
import type { MaterialForm } from "@/lib/calculator";

interface FormSelectorProps {
  value: MaterialForm;
  onChange: (form: MaterialForm) => void;
}

export function FormSelector({ value, onChange }: FormSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onChange("dried")}
        className="flex-1 font-semibold transition-colors"
        variant={value === "dried" ? "default" : "neutral"}
      >
        DRIED
      </Button>
      <Button
        onClick={() => onChange("fresh")}
        className="flex-1 font-semibold transition-colors"
        variant={value === "fresh" ? "default" : "neutral"}
      >
        FRESH
      </Button>
    </div>
  );
}
