import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SyntheticCompound } from "@/lib/calculator";
import ImageCard from "@/components/ui/image-card";

// Compound-specific images
import acoAcoDmt from "@/assets/4-AcO-DMT.png";
import acoHoMet from "@/assets/4-HO-MET.png";
import acoAcoMet from "@/assets/4-AcO-MET.png";
// Fallback generic image
import genericSynthetic from "@/assets/synthetic.png";

// Image mapping for compounds
const compoundImages: Record<string, string> = {
  "4_aco_dmt": acoAcoDmt,
  "4_ho_met": acoHoMet,
  "4_aco_met": acoAcoMet,
};

function getCompoundImage(compound: string): string {
  return compoundImages[compound] || genericSynthetic;
}

function formatCompoundName(compound: string): string {
  // Convert "4_aco_dmt" → "4-AcO-DMT"
  return compound
    .replace(/_/g, "-")
    .replace(/aco/gi, "AcO")
    .replace(/ho/gi, "HO")
    .replace(/dmt/gi, "DMT")
    .replace(/met/gi, "MET");
}

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
    <div className="space-y-4">
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
              className={cn(
                "flex-1 font-semibold transition-colors",
                selectedCompound !== synth.id && "bg-transparent",
              )}
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
      <ImageCard
        key={selectedCompound}
        caption={formatCompoundName(selectedCompound)}
        imageUrl={getCompoundImage(selectedCompound)}
        className="animate-fade-in"
      />
    </div>
  );
}
