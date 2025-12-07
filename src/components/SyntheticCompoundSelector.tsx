import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SyntheticCompound } from "@/lib/calculator";

interface SyntheticOption {
  id: string;
  name: string;
  equivalentRatio: number;
}

interface SyntheticCompoundSelectorProps {
  compounds: SyntheticOption[];
  selectedCompound: SyntheticCompound;
  onCompoundChange: (compound: SyntheticCompound) => void;
}

export function SyntheticCompoundSelector({
  compounds,
  selectedCompound,
  onCompoundChange,
}: SyntheticCompoundSelectorProps) {
  return (
    <div>
      <Label
        htmlFor="compound"
        className="mb-2 block text-xs tracking-widest uppercase"
      >
        Compound
      </Label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {compounds.map((synth) => (
          <Button
            key={synth.id}
            onClick={() => onCompoundChange(synth.id as SyntheticCompound)}
            variant={selectedCompound === synth.id ? "default" : "neutral"}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="block font-bold">
                {synth.name.split(" ")[0]}
              </span>
              <span
                className={cn(
                  "text-xs",
                  selectedCompound === synth.id
                    ? "text-main-foreground/70"
                    : "text-muted-foreground",
                )}
              >
                {synth.equivalentRatio.toFixed(1)}x psilocybin equiv.
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
