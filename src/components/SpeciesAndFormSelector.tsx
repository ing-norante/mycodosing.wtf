import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleHelp } from "lucide-react";
import { FormSelector } from "./FormSelector";
import type { MaterialForm, Species, SclerotiaSpecies } from "@/lib/calculator";
import { LazyImageCard } from "@/components/ui/lazy-image-card";
import { getSpeciesImageLoader } from "@/lib/species-images";
import { usePostHog } from "posthog-js/react";

function formatSpeciesName(species: string): string {
  return species
    .replace(/_sclerotia$/, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface SpeciesOption {
  id: string;
  commonName: string;
  name: string;
  relativePotency: number;
}

interface SpeciesAndFormSelectorProps {
  speciesList: SpeciesOption[];
  selectedSpecies: Species | SclerotiaSpecies;
  form: MaterialForm;
  onSpeciesChange: (species: Species | SclerotiaSpecies) => void;
  onFormChange: (form: MaterialForm) => void;
  label: string;
}

export function SpeciesAndFormSelector({
  speciesList,
  selectedSpecies,
  form,
  onSpeciesChange,
  onFormChange,
  label,
}: SpeciesAndFormSelectorProps) {
  const posthog = usePostHog();
  // Create a loader function for the current species and form
  const imageLoader = getSpeciesImageLoader(selectedSpecies, form);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="col-span-2 sm:col-span-1">
        <Label
          htmlFor="species"
          className="mb-2 block text-xs tracking-widest uppercase"
        >
          {label}
        </Label>
        <Select
          value={selectedSpecies}
          onValueChange={(value) => {
            onSpeciesChange(value as Species | SclerotiaSpecies);
            posthog.capture("species_changed", { species: value });
          }}
        >
          <SelectTrigger
            className="shadow-shadow cursor-pointer p-1"
            aria-label="Select species"
          >
            <SelectValue
              placeholder={
                <>
                  <CircleHelp />
                  Select {label}
                </>
              }
            />
          </SelectTrigger>
          <SelectContent>
            {speciesList.map((species) => (
              <SelectItem key={species.id} value={species.id}>
                <span className="text-sm font-bold">{species.commonName}</span>
                <span className="font-mono text-xs tracking-tight italic">
                  {species.name}
                </span>
                <span className="text-xs font-semibold">
                  ({species.relativePotency.toFixed(1)}x)
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Label
          htmlFor="form"
          className="mb-2 block text-xs tracking-widest uppercase"
        >
          Form
        </Label>
        <FormSelector value={form} onChange={onFormChange} />
      </div>
      <div className="col-span-2 col-start-1">
        <LazyImageCard
          loader={imageLoader}
          caption={`${formatSpeciesName(selectedSpecies)} (${form})`}
          loadKey={`${selectedSpecies}-${form}`}
          className="animate-fade-in"
        />
      </div>
    </div>
  );
}
