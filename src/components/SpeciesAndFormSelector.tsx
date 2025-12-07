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

interface SpeciesOption {
  id: string;
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
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <Label
          htmlFor="species"
          className="mb-2 block text-xs tracking-widest uppercase"
        >
          {label}
        </Label>
        <Select
          value={selectedSpecies}
          onValueChange={(value) =>
            onSpeciesChange(value as Species | SclerotiaSpecies)
          }
        >
          <SelectTrigger>
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
                <span className="font-semibold">{species.name}</span>
                <span className="text-xs">
                  ({species.relativePotency.toFixed(1)}x)
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label
          htmlFor="form"
          className="mb-2 block text-xs tracking-widest uppercase"
        >
          Form
        </Label>
        <FormSelector value={form} onChange={onFormChange} />
      </div>
    </div>
  );
}
