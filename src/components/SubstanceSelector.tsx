import type {
  SclerotiaSpecies,
  Species,
  SubstanceCategory,
} from "@/lib/calculator";
import { getSpeciesList, getSyntheticList } from "@/lib/calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpeciesAndFormSelector } from "./SpeciesAndFormSelector";
import { SyntheticCompoundSelector } from "./SyntheticCompoundSelector";
import { cn } from "@/lib/utils";
import sclerotiaImage from "@/assets/sclerotia.png";
import syntheticImage from "@/assets/synthetic.png";
import mushroomImage from "@/assets/mushroom.png";
import { useDosageStore } from "@/stores/useDosageStore";
import { LazyImage } from "@/components/ui/lazy-image";
import { usePostHog } from "posthog-js/react";

const SUBSTANCE_TYPES: {
  id: SubstanceCategory;
  label: string;
  description: string;
  image: string;
}[] = [
  {
    id: "mushroom",
    label: "MUSHROOMS",
    description: "Psilocybin-containing fungi",
    image: mushroomImage,
  },
  {
    id: "sclerotia",
    label: "SCLEROTIA",
    description: "Truffles / philosopher's stones",
    image: sclerotiaImage,
  },
  {
    id: "synthetic",
    label: "SYNTHETIC",
    description: "4-AcO-DMT, 4-HO-MET, 4-AcO-MET",
    image: syntheticImage,
  },
];

export function SubstanceSelector() {
  const posthog = usePostHog();
  const { substance, setSubstance } = useDosageStore();

  const speciesList = getSpeciesList();
  const syntheticList = getSyntheticList();

  const mushroomSpecies = speciesList.filter((s) => s.category === "mushroom");
  const sclerotiaSpecies = speciesList.filter(
    (s) => s.category === "sclerotia",
  );

  const currentType = substance.type;

  const handleTypeChange = (type: string) => {
    const category = type as SubstanceCategory;
    if (category === "mushroom") {
      setSubstance({
        type: "mushroom",
        species: "psilocybe_cubensis" as Species,
        form: "dried",
      });
      posthog.capture("substance_changed", { substance: "mushroom" });
    } else if (category === "sclerotia") {
      setSubstance({
        type: "sclerotia",
        species: "psilocybe_tampanensis_sclerotia" as SclerotiaSpecies,
        form: "fresh",
      });
      posthog.capture("substance_changed", { substance: "sclerotia" });
    } else {
      setSubstance({
        type: "synthetic",
        compound: "4_aco_dmt",
      });
      posthog.capture("substance_changed", { substance: "synthetic" });
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
              "bg-background shadow-shadow size-20 w-full lg:size-40",
              type.id === currentType
                ? "border-border"
                : "border-border bg-secondary-background/20",
            )}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              {type.image !== undefined && (
                <LazyImage
                  loader={() => Promise.resolve(type.image)}
                  alt={`${type.label} image`}
                  className="size-14"
                  loadKey={type.id}
                />
              )}
              <span className="text-sm font-bold uppercase lg:text-lg">
                {type.label}
              </span>
              <span className="hidden text-xs text-wrap lg:block lg:text-xs">
                {type.description}
              </span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="mushroom">
        {substance.type === "mushroom" && (
          <SpeciesAndFormSelector
            speciesList={mushroomSpecies}
            selectedSpecies={substance.species}
            form={substance.form}
            onSpeciesChange={(species) =>
              setSubstance({ ...substance, species: species as Species })
            }
            onFormChange={(form) => setSubstance({ ...substance, form })}
            label="Species"
          />
        )}
      </TabsContent>

      <TabsContent value="sclerotia">
        {substance.type === "sclerotia" && (
          <SpeciesAndFormSelector
            speciesList={sclerotiaSpecies}
            selectedSpecies={substance.species}
            form={substance.form}
            onSpeciesChange={(species) =>
              setSubstance({
                ...substance,
                species: species as SclerotiaSpecies,
              })
            }
            onFormChange={(form) => setSubstance({ ...substance, form })}
            label="Species"
          />
        )}
      </TabsContent>

      <TabsContent value="synthetic">
        {substance.type === "synthetic" && (
          <SyntheticCompoundSelector
            compounds={syntheticList}
            selectedCompound={substance.compound}
            onCompoundChange={(compound) =>
              setSubstance({ type: "synthetic", compound })
            }
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
