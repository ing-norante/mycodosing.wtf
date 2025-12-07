import { Button } from "@/components/ui/button";
import type { MaterialForm } from "@/lib/calculator";
import { cn } from "@/lib/utils";

interface FormSelectorProps {
  value: MaterialForm;
  onChange: (form: MaterialForm) => void;
}

export function FormSelector({ value, onChange }: FormSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onChange("dried")}
        className={cn(
          "flex-1 font-semibold transition-colors",
          value !== "dried" && "bg-transparent",
        )}
      >
        DRIED
      </Button>
      <Button
        onClick={() => onChange("fresh")}
        className={cn(
          "flex-1 font-semibold transition-colors",
          value !== "fresh" && "bg-transparent",
        )}
      >
        FRESH
      </Button>
    </div>
  );
}
