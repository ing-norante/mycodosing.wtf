import { cn } from "@/lib/utils";
import type {
  DosageInput,
  MaterialForm,
  SclerotiaSpecies,
  Species,
  SubstanceCategory,
  SyntheticCompound,
} from "@/lib/calculator";
import { getSpeciesList, getSyntheticList } from "@/lib/calculator";

const SUBSTANCE_TYPES: {
  id: SubstanceCategory;
  label: string;
  description: string;
}[] = [
  { id: "mushroom", label: "MUSHROOMS", description: "Psilocybin-containing fungi" },
  { id: "sclerotia", label: "SCLEROTIA", description: "Truffles / philosopher's stones" },
  { id: "synthetic", label: "SYNTHETIC", description: "4-AcO-DMT, 4-HO-MET, 4-AcO-MET" },
];

interface SubstanceSelectorProps {
  value: DosageInput["substance"];
  onChange: (substance: DosageInput["substance"]) => void;
}

export function SubstanceSelector({ value, onChange }: SubstanceSelectorProps) {
  const speciesList = getSpeciesList();
  const syntheticList = getSyntheticList();

  const mushroomSpecies = speciesList.filter((s) => s.category === "mushroom");
  const sclerotiaSpecies = speciesList.filter((s) => s.category === "sclerotia");

  const currentType = value.type;

  const handleTypeChange = (type: SubstanceCategory) => {
    if (type === "mushroom") {
      onChange({
        type: "mushroom",
        species: "psilocybe_cubensis" as Species,
        form: "dried",
      });
    } else if (type === "sclerotia") {
      onChange({
        type: "sclerotia",
        species: "psilocybe_tampanensis_sclerotia" as SclerotiaSpecies,
        form: "fresh",
      });
    } else {
      onChange({
        type: "synthetic",
        compound: "4_aco_dmt",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Substance Type Selector */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Substance Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SUBSTANCE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={cn(
                "brutalist-card text-left transition-all hover:bg-secondary cursor-pointer",
                currentType === type.id && "bg-primary text-primary-foreground hover:bg-primary"
              )}
            >
              <span className="block font-bold text-lg">{type.label}</span>
              <span
                className={cn(
                  "text-xs",
                  currentType === type.id
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {type.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Species/Compound Selection */}
      {currentType === "mushroom" && value.type === "mushroom" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Species
            </label>
            <select
              value={value.species}
              onChange={(e) =>
                onChange({
                  ...value,
                  species: e.target.value as Species,
                })
              }
              className="w-full brutalist-card bg-input text-foreground cursor-pointer hover:bg-secondary transition-colors"
            >
              {mushroomSpecies.map((species) => (
                <option key={species.id} value={species.id}>
                  {species.name} ({species.relativePotency.toFixed(1)}x)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Form
            </label>
            <div className="flex gap-0">
              <button
                onClick={() => onChange({ ...value, form: "dried" })}
                className={cn(
                  "flex-1 py-3 px-4 border-3 border-foreground font-bold transition-colors cursor-pointer",
                  value.form === "dried"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-secondary"
                )}
              >
                DRIED
              </button>
              <button
                onClick={() => onChange({ ...value, form: "fresh" })}
                className={cn(
                  "flex-1 py-3 px-4 border-3 border-foreground border-l-0 font-bold transition-colors cursor-pointer",
                  value.form === "fresh"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-secondary"
                )}
              >
                FRESH
              </button>
            </div>
          </div>
        </div>
      )}

      {currentType === "sclerotia" && value.type === "sclerotia" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Species
            </label>
            <select
              value={value.species}
              onChange={(e) =>
                onChange({
                  ...value,
                  species: e.target.value as SclerotiaSpecies,
                })
              }
              className="w-full brutalist-card bg-input text-foreground cursor-pointer hover:bg-secondary transition-colors"
            >
              {sclerotiaSpecies.map((species) => (
                <option key={species.id} value={species.id}>
                  {species.name} ({species.relativePotency.toFixed(1)}x)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Form
            </label>
            <div className="flex gap-0">
              <button
                onClick={() => onChange({ ...value, form: "fresh" as MaterialForm })}
                className={cn(
                  "flex-1 py-3 px-4 border-3 border-foreground font-bold transition-colors cursor-pointer",
                  value.form === "fresh"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-secondary"
                )}
              >
                FRESH
              </button>
              <button
                onClick={() => onChange({ ...value, form: "dried" as MaterialForm })}
                className={cn(
                  "flex-1 py-3 px-4 border-3 border-foreground border-l-0 font-bold transition-colors cursor-pointer",
                  value.form === "dried"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-secondary"
                )}
              >
                DRIED
              </button>
            </div>
          </div>
        </div>
      )}

      {currentType === "synthetic" && value.type === "synthetic" && (
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Compound
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {syntheticList.map((synth) => (
              <button
                key={synth.id}
                onClick={() =>
                  onChange({
                    type: "synthetic",
                    compound: synth.id as SyntheticCompound,
                  })
                }
                className={cn(
                  "brutalist-card text-left transition-all hover:bg-secondary cursor-pointer",
                  value.compound === synth.id &&
                    "bg-primary text-primary-foreground hover:bg-primary"
                )}
              >
                <span className="block font-bold">{synth.name.split(" ")[0]}</span>
                <span
                  className={cn(
                    "text-xs",
                    value.compound === synth.id
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {synth.equivalentRatio.toFixed(1)}x psilocybin equiv.
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

