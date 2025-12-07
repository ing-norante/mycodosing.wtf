import type {
  DosageInput,
  SclerotiaSpecies,
  Species,
  SubstanceCategory,
} from "@/lib/calculator";
import { getSpeciesList, getSyntheticList } from "@/lib/calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpeciesAndFormSelector } from "./SpeciesAndFormSelector";
import { SyntheticCompoundSelector } from "./SyntheticCompoundSelector";
import { cn } from "@/lib/utils";

const SUBSTANCE_TYPES: {
  id: SubstanceCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "mushroom",
    label: "MUSHROOMS",
    description: "Psilocybin-containing fungi",
  },
  {
    id: "sclerotia",
    label: "SCLEROTIA",
    description: "Truffles / philosopher's stones",
  },
  {
    id: "synthetic",
    label: "SYNTHETIC",
    description: "4-AcO-DMT, 4-HO-MET, 4-AcO-MET",
  },
];

interface SubstanceSelectorProps {
  value: DosageInput["substance"];
  onChange: (substance: DosageInput["substance"]) => void;
}

export function SubstanceSelector({ value, onChange }: SubstanceSelectorProps) {
  const speciesList = getSpeciesList();
  const syntheticList = getSyntheticList();

  const mushroomSpecies = speciesList.filter((s) => s.category === "mushroom");
  const sclerotiaSpecies = speciesList.filter(
    (s) => s.category === "sclerotia",
  );

  const currentType = value.type;

  const handleTypeChange = (type: string) => {
    const category = type as SubstanceCategory;
    if (category === "mushroom") {
      onChange({
        type: "mushroom",
        species: "psilocybe_cubensis" as Species,
        form: "dried",
      });
    } else if (category === "sclerotia") {
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
    <Tabs value={currentType} onValueChange={handleTypeChange}>
      <TabsList className="bg-background size-auto w-full items-center justify-between border-none">
        {SUBSTANCE_TYPES.map((type) => (
          <TabsTrigger
            key={type.id}
            value={type.id}
            className={cn(
              "bg-background size-20 w-full lg:size-40 shadow-shadow",
              type.id === currentType
                ? "border-border"
                : "border-border bg-secondary-background/20",
            )}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-sm font-bold uppercase lg:text-lg">
                {type.label}
              </span>
              <span className="text-xs text-wrap lg:text-xs">
                {type.description}
              </span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="mushroom">
        {value.type === "mushroom" && (
          <SpeciesAndFormSelector
            speciesList={mushroomSpecies}
            selectedSpecies={value.species}
            form={value.form}
            onSpeciesChange={(species) =>
              onChange({ ...value, species: species as Species })
            }
            onFormChange={(form) => onChange({ ...value, form })}
            label="Species"
          />
        )}
      </TabsContent>

      <TabsContent value="sclerotia">
        {value.type === "sclerotia" && (
          <SpeciesAndFormSelector
            speciesList={sclerotiaSpecies}
            selectedSpecies={value.species}
            form={value.form}
            onSpeciesChange={(species) =>
              onChange({ ...value, species: species as SclerotiaSpecies })
            }
            onFormChange={(form) => onChange({ ...value, form })}
            label="Species"
          />
        )}
      </TabsContent>

      <TabsContent value="synthetic">
        {value.type === "synthetic" && (
          <SyntheticCompoundSelector
            compounds={syntheticList}
            selectedCompound={value.compound}
            onCompoundChange={(compound) =>
              onChange({ type: "synthetic", compound })
            }
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
