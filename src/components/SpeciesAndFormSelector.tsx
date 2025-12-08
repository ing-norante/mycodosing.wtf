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
import ImageCard from "@/components/ui/image-card";

// Species-specific images
import psilocybeCubensisFresh from "@/assets/psilocybe_cubensis_fresh.png";
import psilocybeCubensisDried from "@/assets/psilocybe_cubensis_dried.png";
import psilocybeAzurescensFresh from "@/assets/psilocybe_azurescens_fresh.png";
import psilocybeAzurescensDried from "@/assets/psilocybe_azurescens_dried.png";
import psilocybeSemilanceataFresh from "@/assets/psilocybe_semilanceata_fresh.png";
import psilocybeSemilanceataDried from "@/assets/psilocybe_semilanceata_dried.png";
import psilocybeCyanescensFresh from "@/assets/psilocybe_cyanescens_fresh.png";
import psilocybeCyanescensDried from "@/assets/psilocybe_cyanescens_dried.png";
import psilocybeBaeocystisFresh from "@/assets/psilocybe_baeocystis_fresh.png";
import psilocybeBaeocystisDried from "@/assets/psilocybe_baeocystis_dried.png";
import psilocybeMexicanaFresh from "@/assets/psilocybe_mexicana_fresh.png";
import psilocybeMexicanaDried from "@/assets/psilocybe_mexicana_dried.png";
import psilocybeTampanensisFresh from "@/assets/psilocybe_tampanensis_fresh.png";
import psilocybeTampanensisDried from "@/assets/psilocybe_tampanensis_dried.png";
import psilocybeStuntziiFresh from "@/assets/psilocybe_stuntzii_fresh.png";
import psilocybeStuntziiDried from "@/assets/psilocybe_stuntzii_dried.png";
import psilocybeSubaeruginosaFresh from "@/assets/psilocybe_subaeruginosa_fresh.png";
import psilocybeSubaeruginosaDried from "@/assets/psilocybe_subaeruginosa_dried.png";
import psilocybeWeiliiFresh from "@/assets/psilocybe_weilii_fresh.png";
import psilocybeWeiliiDried from "@/assets/psilocybe_weilii_dried.png";
import panaeolusCyanescensFresh from "@/assets/panaeolus_cyanescens_fresh.png";
import panaeolusCyanescensDried from "@/assets/panaeolus_cyanescens_dried.png";
import panaeolusSubbalteatusFresh from "@/assets/panaeolus_subbalteatus_fresh.png";
import panaeolusSubbalteatusDried from "@/assets/panaeolus_subbalteatus_dried.png";
import gymnopilusPurpuratusFresh from "@/assets/gymnopilus_purpuratus_fresh.png";
import gymnopilusPurpuratusDried from "@/assets/gymnopilus_purpuratus_dried.png";
import pluteusSalicinusFresh from "@/assets/pluteus_salicinus_fresh.png";
import pluteusSalicinusDried from "@/assets/pluteus_salicinus_dried.png";
import psilocybeMexicanaSclerotiaFresh from "@/assets/psilocybe_mexicana_sclerotia_fresh.png";
import psilocybeMexicanaSclerotiaDried from "@/assets/psilocybe_mexicana_sclerotia_dried.png";
import psilocybeTampanensisSclerotiaFresh from "@/assets/psilocybe_tampanensis_sclerotia_fresh.png";
import psilocybeTampanensisSclerotiaDried from "@/assets/psilocybe_tampanensis_sclerotia_dried.png";

// Fallback generic images
import genericFresh from "@/assets/fresh.png";
import genericDried from "@/assets/dried.png";

// Image mapping for species with specific images
const speciesImages: Record<string, { fresh: string; dried: string }> = {
  psilocybe_cubensis: {
    fresh: psilocybeCubensisFresh,
    dried: psilocybeCubensisDried,
  },
  psilocybe_azurescens: {
    fresh: psilocybeAzurescensFresh,
    dried: psilocybeAzurescensDried,
  },
  psilocybe_semilanceata: {
    fresh: psilocybeSemilanceataFresh,
    dried: psilocybeSemilanceataDried,
  },
  psilocybe_cyanescens: {
    fresh: psilocybeCyanescensFresh,
    dried: psilocybeCyanescensDried,
  },
  psilocybe_baeocystis: {
    fresh: psilocybeBaeocystisFresh,
    dried: psilocybeBaeocystisDried,
  },
  psilocybe_mexicana: {
    fresh: psilocybeMexicanaFresh,
    dried: psilocybeMexicanaDried,
  },
  psilocybe_tampanensis: {
    fresh: psilocybeTampanensisFresh,
    dried: psilocybeTampanensisDried,
  },
  psilocybe_stuntzii: {
    fresh: psilocybeStuntziiFresh,
    dried: psilocybeStuntziiDried,
  },
  psilocybe_subaeruginosa: {
    fresh: psilocybeSubaeruginosaFresh,
    dried: psilocybeSubaeruginosaDried,
  },
  psilocybe_weilii: {
    fresh: psilocybeWeiliiFresh,
    dried: psilocybeWeiliiDried,
  },
  panaeolus_cyanescens: {
    fresh: panaeolusCyanescensFresh,
    dried: panaeolusCyanescensDried,
  },
  panaeolus_subbalteatus: {
    fresh: panaeolusSubbalteatusFresh,
    dried: panaeolusSubbalteatusDried,
  },
  gymnopilus_purpuratus: {
    fresh: gymnopilusPurpuratusFresh,
    dried: gymnopilusPurpuratusDried,
  },
  pluteus_salicinus: {
    fresh: pluteusSalicinusFresh,
    dried: pluteusSalicinusDried,
  },
  psilocybe_mexicana_sclerotia: {
    fresh: psilocybeMexicanaSclerotiaFresh,
    dried: psilocybeMexicanaSclerotiaDried,
  },
  psilocybe_tampanensis_sclerotia: {
    fresh: psilocybeTampanensisSclerotiaFresh,
    dried: psilocybeTampanensisSclerotiaDried,
  },
};

function getSpeciesImage(species: string, form: MaterialForm): string {
  // First try the exact species name (including _sclerotia if present)
  if (speciesImages[species]) {
    return speciesImages[species][form];
  }
  // For sclerotia species, try the base mushroom species as fallback
  const baseSpecies = species.replace("_sclerotia", "");
  if (speciesImages[baseSpecies]) {
    return speciesImages[baseSpecies][form];
  }
  // Fallback to generic images
  return form === "fresh" ? genericFresh : genericDried;
}

function formatSpeciesName(species: string): string {
  return species
    .replace(/_sclerotia$/, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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
          <SelectTrigger className="shadow-shadow p-1">
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
      <div className="col-span-2">
        <ImageCard
          caption={`${formatSpeciesName(selectedSpecies)} (${form})`}
          imageUrl={getSpeciesImage(selectedSpecies, form)}
        />
      </div>
    </div>
  );
}
