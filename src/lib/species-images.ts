import type { MaterialForm } from "@/lib/calculator";

type ImageLoader = () => Promise<{ default: string }>;

interface SpeciesImageLoaders {
  fresh: ImageLoader;
  dried: ImageLoader;
}

// Dynamic import loaders for each species
// Using explicit import() calls so Vite can code-split each image
const speciesImageLoaders: Record<string, SpeciesImageLoaders> = {
  // Mushrooms
  psilocybe_cubensis: {
    fresh: () => import("@/assets/psilocybe_cubensis_fresh.png"),
    dried: () => import("@/assets/psilocybe_cubensis_dried.png"),
  },
  psilocybe_azurescens: {
    fresh: () => import("@/assets/psilocybe_azurescens_fresh.png"),
    dried: () => import("@/assets/psilocybe_azurescens_dried.png"),
  },
  psilocybe_semilanceata: {
    fresh: () => import("@/assets/psilocybe_semilanceata_fresh.png"),
    dried: () => import("@/assets/psilocybe_semilanceata_dried.png"),
  },
  psilocybe_cyanescens: {
    fresh: () => import("@/assets/psilocybe_cyanescens_fresh.png"),
    dried: () => import("@/assets/psilocybe_cyanescens_dried.png"),
  },
  psilocybe_baeocystis: {
    fresh: () => import("@/assets/psilocybe_baeocystis_fresh.png"),
    dried: () => import("@/assets/psilocybe_baeocystis_dried.png"),
  },
  psilocybe_mexicana: {
    fresh: () => import("@/assets/psilocybe_mexicana_fresh.png"),
    dried: () => import("@/assets/psilocybe_mexicana_dried.png"),
  },
  psilocybe_tampanensis: {
    fresh: () => import("@/assets/psilocybe_tampanensis_fresh.png"),
    dried: () => import("@/assets/psilocybe_tampanensis_dried.png"),
  },
  psilocybe_stuntzii: {
    fresh: () => import("@/assets/psilocybe_stuntzii_fresh.png"),
    dried: () => import("@/assets/psilocybe_stuntzii_dried.png"),
  },
  psilocybe_subaeruginosa: {
    fresh: () => import("@/assets/psilocybe_subaeruginosa_fresh.png"),
    dried: () => import("@/assets/psilocybe_subaeruginosa_dried.png"),
  },
  psilocybe_weilii: {
    fresh: () => import("@/assets/psilocybe_weilii_fresh.png"),
    dried: () => import("@/assets/psilocybe_weilii_dried.png"),
  },
  panaeolus_cyanescens: {
    fresh: () => import("@/assets/panaeolus_cyanescens_fresh.png"),
    dried: () => import("@/assets/panaeolus_cyanescens_dried.png"),
  },
  panaeolus_subbalteatus: {
    fresh: () => import("@/assets/panaeolus_subbalteatus_fresh.png"),
    dried: () => import("@/assets/panaeolus_subbalteatus_dried.png"),
  },
  gymnopilus_purpuratus: {
    fresh: () => import("@/assets/gymnopilus_purpuratus_fresh.png"),
    dried: () => import("@/assets/gymnopilus_purpuratus_dried.png"),
  },
  pluteus_salicinus: {
    fresh: () => import("@/assets/pluteus_salicinus_fresh.png"),
    dried: () => import("@/assets/pluteus_salicinus_dried.png"),
  },
  // Sclerotia
  psilocybe_mexicana_sclerotia: {
    fresh: () => import("@/assets/psilocybe_mexicana_sclerotia_fresh.png"),
    dried: () => import("@/assets/psilocybe_mexicana_sclerotia_dried.png"),
  },
  psilocybe_tampanensis_sclerotia: {
    fresh: () => import("@/assets/psilocybe_tampanensis_sclerotia_fresh.png"),
    dried: () => import("@/assets/psilocybe_tampanensis_sclerotia_dried.png"),
  },
};

/**
 * Returns a promise that resolves to the image URL for the given species and form.
 * Uses dynamic imports for code-splitting - images are loaded on-demand.
 *
 * Note: All species in the database have specific images defined.
 * If a species is not found, this will throw an error.
 */
export async function loadSpeciesImage(
  species: string,
  form: MaterialForm,
): Promise<string> {
  // Try exact species match first
  if (speciesImageLoaders[species]) {
    const module = await speciesImageLoaders[species][form]();
    return module.default;
  }

  // For sclerotia species, try base mushroom species as fallback
  const baseSpecies = species.replace("_sclerotia", "");
  if (speciesImageLoaders[baseSpecies]) {
    const module = await speciesImageLoaders[baseSpecies][form]();
    return module.default;
  }

  // All species should have images - if we reach here, it's a programming error
  throw new Error(`No image found for species: ${species} (${form})`);
}

/**
 * Returns a loader function for the given species and form.
 * Useful for components that need to handle loading state themselves.
 */
export function getSpeciesImageLoader(
  species: string,
  form: MaterialForm,
): () => Promise<string> {
  return () => loadSpeciesImage(species, form);
}
