/**
 * Psilocybin Dosage Calculator v3.0
 *
 * Synthesizes best practices from three implementations:
 * - Uncertainty ranges (min/median/max) for biological variability
 * - Relative potency multipliers (simpler) + raw data (when precision needed)
 * - Proper tolerance model with dose-dependent recovery
 * - Rich output with warnings, citations, confidence levels
 * - Clean type system with validation
 *
 * Scientific foundation:
 * - Garcia-Romeu et al. (2021): Fixed dosing ≈ weight-adjusted dosing
 * - Gotvaldová et al. (2021): LC-MS/MS potency analysis
 * - Buchborn et al. (2016): 5-HT2A tolerance kinetics
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type SubstanceCategory = "mushroom" | "sclerotia" | "synthetic";

export interface SubstanceCategoryData {
  id: SubstanceCategory;
  label: string;
  description: string;
  image: string;
}

export type Species =
  | "gymnopilus_purpuratus"
  | "panaeolus_cyanescens"
  | "panaeolus_subbalteatus"
  | "pluteus_salicinus"
  | "psilocybe_azurescens"
  | "psilocybe_baeocystis"
  | "psilocybe_cubensis"
  | "psilocybe_cyanescens"
  | "psilocybe_mexicana"
  | "psilocybe_semilanceata"
  | "psilocybe_stuntzii"
  | "psilocybe_subaeruginosa"
  | "psilocybe_tampanensis"
  | "psilocybe_weilii";

export type SclerotiaSpecies =
  | "psilocybe_mexicana_sclerotia"
  | "psilocybe_tampanensis_sclerotia";

export type SyntheticCompound = "4_aco_dmt" | "4_ho_met" | "4_aco_met";

export type MaterialForm = "fresh" | "dried";

export type IntensityLevel =
  | "microdose"
  | "threshold"
  | "light"
  | "moderate"
  | "strong"
  | "heroic";

export type ConfidenceLevel = "high" | "moderate" | "low" | "very_low";

export interface ToleranceInput {
  lastDosePsilocybinMg: number;
  daysSinceLastDose: number;
}

export interface DosageInput {
  // Required
  intensity: IntensityLevel;

  // Substance selection (one of these patterns)
  substance:
    | { type: "mushroom"; species: Species; form: MaterialForm }
    | { type: "sclerotia"; species: SclerotiaSpecies; form: MaterialForm }
    | { type: "synthetic"; compound: SyntheticCompound };

  // Optional adjustments
  bodyWeightKg?: number;
  useWeightAdjustment?: boolean; // Default false per Garcia-Romeu 2021
  tolerance?: ToleranceInput;
  onMAOI?: boolean;

  // Degradation estimates (0-1)
  storageDegradation?: number; // e.g., 0.2 = 20% potency loss
  dryingQuality?: "optimal" | "average" | "poor"; // Affects psilocin retention
}

export interface DoseRange {
  min: number; // Conservative (high-potency material)
  median: number; // Expected value
  max: number; // Liberal (low-potency material)
}

export interface DosageResult {
  // Core output
  amount: DoseRange;
  unit: "g" | "mg";

  // Context
  psilocybinEquivalentMg: DoseRange;
  toleranceMultiplier: number;
  confidence: ConfidenceLevel;

  // Metadata
  warnings: Warning[];
  notes: string[];
  citations: Citation[];

  // Debug info
  calculationBreakdown: {
    baseTargetMg: number;
    afterWeightAdjustment: number;
    afterTolerance: number;
    afterMAOI: number;
    potencyMgPerG: DoseRange;
  };
}

export interface Warning {
  severity: "info" | "caution" | "warning" | "danger";
  message: string;
}

export interface Citation {
  authors: string;
  year: number;
  title: string;
  relevance: string;
  link: string;
}

// ============================================================================
// CONSTANTS AND REFERENCE DATA
// ============================================================================

/**
 * Target psilocybin-equivalent doses (mg) per intensity level
 * Based on clinical research and harm reduction guidelines
 */
const INTENSITY_TARGETS: Record<IntensityLevel, { min: number; max: number }> =
  {
    microdose: { min: 1, max: 3 }, // Fadiman protocol
    threshold: { min: 3, max: 6 }, // Perceptual threshold
    light: { min: 6, max: 12 }, // Mild effects
    moderate: { min: 12, max: 20 }, // Clear psychedelic state
    strong: { min: 20, max: 30 }, // Clinical therapeutic (COMPASS, Hopkins)
    heroic: { min: 35, max: 50 }, // McKenna "heroic dose"
  };

/**
 * Species potency data
 *
 * Contains both:
 * - Relative multiplier (vs P. cubensis = 1.0) for simple calculations
 * - Raw mg/g data for precision when needed
 *
 * Uncertainty factor accounts for:
 * - Strain variation
 * - Growing conditions
 * - Harvest timing
 * - Sample-to-sample variability
 */
interface SpeciesData {
  name: string;
  commonName: string; // New field for street/common names
  category: SubstanceCategory;
  relativeMultiplier: number; // vs cubensis dried
  psilocybinMgPerG: number; // dried material
  psilocinMgPerG: number; // dried material (low due to oxidation)
  baeocystinMgPerG: number;
  uncertaintyFactor: number; // 0.3 = ±30% typical variation
  freshToDryRatio: number; // weight ratio
  warnings: string[];
  notes: string;
}

const SPECIES_DATABASE: Record<Species | SclerotiaSpecies, SpeciesData> = {
  // === Psilocybe (most common) ===
  psilocybe_cubensis: {
    name: "Psilocybe cubensis",
    commonName: "Golden Teachers",
    category: "mushroom",
    relativeMultiplier: 1.0, // BASELINE
    psilocybinMgPerG: 6.3,
    psilocinMgPerG: 0.6,
    baeocystinMgPerG: 0.2,
    uncertaintyFactor: 0.4, // High due to strain variation (PE vs B+ etc)
    freshToDryRatio: 10,
    warnings: [],
    notes: "Most common cultivated. Strains vary significantly (0.5-1.4%).",
  },

  psilocybe_azurescens: {
    name: "Psilocybe azurescens",
    commonName: "Azures / Flying Saucers",
    category: "mushroom",
    relativeMultiplier: 2.5, // CORRECTED from 1.9
    psilocybinMgPerG: 17.8,
    psilocinMgPerG: 3.8,
    baeocystinMgPerG: 3.5,
    uncertaintyFactor: 0.3,
    freshToDryRatio: 10,
    warnings: [
      "EXTREME POTENCY - strongest known species",
      "Wood Lover's Paralysis (WLP) risk - temporary limb weakness",
      "Start with 30-50% of calculated dose",
    ],
    notes:
      "Be careful with this species as it can be very potent and has a high risk of WLP.",
  },

  psilocybe_semilanceata: {
    name: "Psilocybe semilanceata",
    commonName: "Liberty Caps",
    category: "mushroom",
    relativeMultiplier: 1.5, // CORRECTED from 2.0
    psilocybinMgPerG: 9.8,
    psilocinMgPerG: 0.2,
    baeocystinMgPerG: 0.2,
    uncertaintyFactor: 0.25, // More consistent than cultivated
    freshToDryRatio: 10,
    warnings: ["Cannot be cultivated - wild harvest only"],
    notes: "Very consistent potency. European/North American grasslands.",
  },

  psilocybe_cyanescens: {
    name: "Psilocybe cyanescens",
    commonName: "Wavy Caps",
    category: "mushroom",
    relativeMultiplier: 1.6,
    psilocybinMgPerG: 8.5,
    psilocinMgPerG: 3.6,
    baeocystinMgPerG: 0.3,
    uncertaintyFactor: 0.35,
    freshToDryRatio: 10,
    warnings: ["WLP risk (wood lover)"],
    notes: "Wood chip colonizer. PNW and Europe.",
  },

  psilocybe_baeocystis: {
    name: "Psilocybe baeocystis",
    commonName: "Bluebells / Knobby Tops",
    category: "mushroom",
    relativeMultiplier: 1.8,
    psilocybinMgPerG: 8.5,
    psilocinMgPerG: 5.9,
    baeocystinMgPerG: 1.0,
    uncertaintyFactor: 0.3,
    freshToDryRatio: 10,
    warnings: ["High baeocystin - may affect experience quality"],
    notes: "Pacific Northwest. Named for baeocystin content.",
  },

  psilocybe_mexicana: {
    name: "Psilocybe mexicana",
    commonName: "Mexicana",
    category: "mushroom",
    relativeMultiplier: 0.6,
    psilocybinMgPerG: 2.5,
    psilocinMgPerG: 1.5,
    baeocystinMgPerG: 0.1,
    uncertaintyFactor: 0.3,
    freshToDryRatio: 10,
    warnings: [],
    notes: "Traditional Mazatec ceremonial use. Milder experience.",
  },

  psilocybe_tampanensis: {
    name: "Psilocybe tampanensis",
    commonName: "Pollock / Tampanensis",
    category: "mushroom",
    relativeMultiplier: 1.0,
    psilocybinMgPerG: 6.8,
    psilocinMgPerG: 3.2,
    baeocystinMgPerG: 0.3,
    uncertaintyFactor: 0.25,
    freshToDryRatio: 10,
    warnings: [],
    notes: "Rare in wild. Usually cultivated for sclerotia.",
  },

  psilocybe_stuntzii: {
    name: "Psilocybe stuntzii",
    commonName: "Blue Ringers",
    category: "mushroom",
    relativeMultiplier: 0.55,
    psilocybinMgPerG: 3.6,
    psilocinMgPerG: 1.2,
    baeocystinMgPerG: 0.2,
    uncertaintyFactor: 0.35,
    freshToDryRatio: 10,
    warnings: ["Easy to confuse with Galerina marginata (deadly)"],
    notes: "Pacific Northwest. Moderate potency.",
  },

  psilocybe_subaeruginosa: {
    name: "Psilocybe subaeruginosa",
    commonName: "Subs / Australian",
    category: "mushroom",
    relativeMultiplier: 1.5,
    psilocybinMgPerG: 9.3,
    psilocinMgPerG: 3.5,
    baeocystinMgPerG: 0.4,
    uncertaintyFactor: 0.3,
    freshToDryRatio: 10,
    warnings: ["WLP risk (wood lover)"],
    notes: "Australia and New Zealand. High potency.",
  },

  psilocybe_weilii: {
    name: "Psilocybe weilii",
    commonName: "Weilii / GA Weilii",
    category: "mushroom",
    relativeMultiplier: 1.1,
    psilocybinMgPerG: 6.1,
    psilocinMgPerG: 2.7,
    baeocystinMgPerG: 0.5,
    uncertaintyFactor: 0.35,
    freshToDryRatio: 10,
    warnings: [],
    notes: "Southeastern US endemic. Wood decomposer.",
  },

  // === Panaeolus ===
  panaeolus_cyanescens: {
    name: "Panaeolus cyanescens",
    commonName: "Blue Meanies",
    category: "mushroom",
    relativeMultiplier: 1.7,
    psilocybinMgPerG: 8.5,
    psilocinMgPerG: 4.4,
    baeocystinMgPerG: 0.3,
    uncertaintyFactor: 0.4,
    freshToDryRatio: 10,
    warnings: ["Often confused with P. cinctulus (less potent)"],
    notes: "Tropical/subtropical dung species. High potency.",
  },

  panaeolus_subbalteatus: {
    name: "Panaeolus subbalteatus",
    commonName: "Subbs / Cinctulus",
    category: "mushroom",
    relativeMultiplier: 0.9,
    psilocybinMgPerG: 6.0,
    psilocinMgPerG: 3.0,
    baeocystinMgPerG: 0.2,
    uncertaintyFactor: 0.35,
    freshToDryRatio: 10,
    warnings: [],
    notes: "Temperate grassland species.",
  },

  // === Gymnopilus ===
  gymnopilus_purpuratus: {
    name: "Gymnopilus purpuratus",
    commonName: "Gym Purps",
    category: "mushroom",
    relativeMultiplier: 0.5,
    psilocybinMgPerG: 3.4,
    psilocinMgPerG: 1.2,
    baeocystinMgPerG: 0.5,
    uncertaintyFactor: 0.5, // Highly variable
    freshToDryRatio: 10,
    warnings: ["Highly variable potency"],
    notes: "Wood decomposer. Not commonly used.",
  },

  // === Pluteus ===
  pluteus_salicinus: {
    name: "Pluteus salicinus",
    commonName: "Pluteus / Willow Shield",
    category: "mushroom",
    relativeMultiplier: 0.4,
    psilocybinMgPerG: 2.1,
    psilocinMgPerG: 1.1,
    baeocystinMgPerG: 0.1,
    uncertaintyFactor: 0.4,
    freshToDryRatio: 10,
    warnings: [],
    notes: "Lower potency. Grows on willow/poplar.",
  },

  // === Sclerotia (Truffles) ===
  psilocybe_mexicana_sclerotia: {
    name: "P. mexicana (Sclerotia)",
    commonName: "Mexicana Truffles",
    category: "sclerotia",
    relativeMultiplier: 0.45,
    psilocybinMgPerG: 3.2,
    psilocinMgPerG: 1.5,
    baeocystinMgPerG: 0.1,
    uncertaintyFactor: 0.25, // Commercial = consistent
    freshToDryRatio: 3, // Denser, less water
    warnings: [],
    notes: "Commercial truffles. Very consistent potency. Usually sold fresh.",
  },

  psilocybe_tampanensis_sclerotia: {
    name: "P. tampanensis",
    commonName: "Philosopher's Stones",
    category: "sclerotia",
    relativeMultiplier: 0.55,
    psilocybinMgPerG: 3.1,
    psilocinMgPerG: 6.8, // Unusually high psilocin retention
    baeocystinMgPerG: 0.2,
    uncertaintyFactor: 0.2, // Very consistent
    freshToDryRatio: 3,
    warnings: [],
    notes: "Most common commercial truffle. Netherlands legal market.",
  },
};

/**
 * Synthetic compound data
 */
interface SyntheticData {
  name: string;
  psilocybinEquivalentRatio: number; // 1.0 = same as psilocybin by weight
  uncertaintyFactor: number;
  warnings: string[];
  notes: string;
}

const SYNTHETIC_DATABASE: Record<SyntheticCompound, SyntheticData> = {
  "4_aco_dmt": {
    name: "4-AcO-DMT (Psilacetin)",
    psilocybinEquivalentRatio: 1.1, // Slightly more potent
    uncertaintyFactor: 0.15, // Pure compound = low variance
    warnings: [
      "Research chemical - limited safety data",
      "Faster onset than psilocybin mushrooms",
      "Shorter duration (~4-6h vs 5-7h)",
    ],
    notes: "Prodrug of psilocin. Pharmacologically similar to psilocybin.",
  },
  "4_ho_met": {
    name: "4-HO-MET (Metocin)",
    psilocybinEquivalentRatio: 0.9,
    uncertaintyFactor: 0.15,
    warnings: [
      "Research chemical - very limited safety data",
      "More visual, less introspective than psilocybin",
    ],
    notes: "Direct 5-HT2A agonist (not a prodrug).",
  },
  "4_aco_met": {
    name: "4-AcO-MET",
    psilocybinEquivalentRatio: 0.85,
    uncertaintyFactor: 0.15,
    warnings: ["Research chemical - minimal safety data"],
    notes: "Prodrug of 4-HO-MET.",
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculates "psilocybin-equivalent" mg per gram
 * Accounts for relative potency of psilocin and baeocystin
 */
function calculatePotencyMgPerG(species: SpeciesData): number {
  const PSILOCIN_FACTOR = 1.4; // ~40% more potent by weight
  const BAEOCYSTIN_FACTOR = 0.5; // Weaker, partial agonist

  return (
    species.psilocybinMgPerG +
    species.psilocinMgPerG * PSILOCIN_FACTOR +
    species.baeocystinMgPerG * BAEOCYSTIN_FACTOR
  );
}

/**
 * Weight adjustment factor
 *
 * Per Garcia-Romeu 2021: No significant effect found 49-113kg
 * However, user may still want adjustment. We clamp to prevent extremes.
 */
function calculateWeightFactor(
  bodyWeightKg: number | undefined,
  useWeightAdjustment: boolean | undefined,
): number {
  if (!useWeightAdjustment || !bodyWeightKg) return 1.0;

  const ratio = bodyWeightKg / 70; // 70kg reference
  return clamp(ratio, 0.75, 1.35); // Prevent extreme adjustments
}

/**
 * Tolerance multiplier based on 5-HT2A receptor downregulation
 *
 * Model improvements over previous versions:
 * - Uses BOTH last dose amount AND days since
 * - Exponential decay with research-backed half-life
 * - Properly reaches 1.0 at day 14
 *
 * Formula: multiplier = 1 + (doseImpact * e^(-λt))
 * where λ = ln(2) / half_life_days
 */
function calculateToleranceMultiplier(tolerance?: ToleranceInput): number {
  if (!tolerance) return 1.0;
  if (tolerance.daysSinceLastDose >= 14) return 1.0;
  if (tolerance.daysSinceLastDose <= 0) return 2.5; // Same-day redose

  const { lastDosePsilocybinMg, daysSinceLastDose } = tolerance;

  // Dose-dependent tolerance impact
  // 25mg (standard therapeutic) = 1.0 impact
  // 10mg = 0.4 impact, 50mg = 2.0 impact (clamped)
  const doseImpact = clamp(lastDosePsilocybinMg / 25, 0.2, 2.0);

  // Half-life of tolerance recovery: ~2.8 days (Buchborn 2016)
  const HALF_LIFE_DAYS = 2.8;
  const DECAY_CONSTANT = Math.LN2 / HALF_LIFE_DAYS;

  // Peak tolerance addition (at t=0 after standard dose)
  const PEAK_TOLERANCE = 1.2;

  const toleranceRemaining =
    PEAK_TOLERANCE * doseImpact * Math.exp(-DECAY_CONSTANT * daysSinceLastDose);

  // Multiplier: 1.0 (no tolerance) to ~2.5 (peak)
  return clamp(1 + toleranceRemaining, 1.0, 2.5);
}

/**
 * Drying quality affects psilocin retention
 * Poor drying (high heat, slow) destroys more psilocin
 */
function getDryingDegradationFactor(
  quality: "optimal" | "average" | "poor" | undefined,
): number {
  switch (quality) {
    case "optimal":
      return 1.0; // Freeze-dried or fast fan-dried
    case "poor":
      return 0.7; // Oven-dried or slow air-dried
    case "average":
    default:
      return 0.85;
  }
}

// ============================================================================
// MAIN CALCULATOR
// ============================================================================

export function calculateDosage(input: DosageInput): DosageResult {
  const warnings: Warning[] = [];
  const notes: string[] = [];
  const citations: Citation[] = [];

  // 1. Get base target (midpoint of intensity range)
  const intensityRange = INTENSITY_TARGETS[input.intensity];
  const baseTargetMg = (intensityRange.min + intensityRange.max) / 2;

  // 2. Weight adjustment
  const weightFactor = calculateWeightFactor(
    input.bodyWeightKg,
    input.useWeightAdjustment,
  );
  const afterWeightMg = baseTargetMg * weightFactor;

  if (!input.useWeightAdjustment) {
    citations.push({
      authors: "Garcia-Romeu et al.",
      year: 2021,
      title: "Optimal dosing for psilocybin pharmacotherapy",
      relevance:
        "No significant relationship between body weight (49-113kg) and subjective effects",
      link: "https://pubmed.ncbi.nlm.nih.gov/33611977/",
    });
  } else if (input.bodyWeightKg) {
    notes.push(
      `Weight-adjusted: ${input.bodyWeightKg}kg → ${(
        weightFactor * 100
      ).toFixed(0)}% of standard dose`,
    );
  }

  // 3. Tolerance adjustment
  const toleranceMultiplier = calculateToleranceMultiplier(input.tolerance);
  const afterToleranceMg = afterWeightMg * toleranceMultiplier;

  if (toleranceMultiplier > 1.1 && input.tolerance) {
    const daysToReset = Math.max(0, 14 - input.tolerance.daysSinceLastDose);
    warnings.push({
      severity: "caution",
      message: `Tolerance detected: ${(toleranceMultiplier * 100 - 100).toFixed(
        0,
      )}% dose increase applied. Full reset in ~${daysToReset} days.`,
    });
    citations.push({
      authors: "Buchborn et al.",
      year: 2016,
      title: "Tolerance and cross-tolerance to psychedelics",
      relevance: "5-HT2A receptor downregulation; ~14 day recovery period",
      link: "https://www.sciencedirect.com/science/article/abs/pii/B9780128002124000790",
    });
  }

  // 4. MAOI adjustment
  const maoiFactor = input.onMAOI ? 0.5 : 1.0;
  const afterMAOIMg = afterToleranceMg * maoiFactor;

  if (input.onMAOI) {
    warnings.push({
      severity: "danger",
      message:
        "MAOI INTERACTION: Dose halved automatically. Effects will be significantly stronger and longer. Serotonin syndrome risk with high doses.",
    });
  }

  // 5. Calculate material amount based on substance type
  let amount: DoseRange;
  let unit: "g" | "mg";
  let confidence: ConfidenceLevel;
  let potencyMgPerG: DoseRange;

  if (input.substance.type === "synthetic") {
    // Synthetic compound calculation
    const synth = SYNTHETIC_DATABASE[input.substance.compound];

    const baseMg = afterMAOIMg / synth.psilocybinEquivalentRatio;
    const uncertainty = synth.uncertaintyFactor;

    amount = {
      min: round(baseMg * (1 - uncertainty), 1),
      median: round(baseMg, 1),
      max: round(baseMg * (1 + uncertainty), 1),
    };
    unit = "mg";
    confidence = "high"; // Pure compound

    potencyMgPerG = {
      min: 1000 * synth.psilocybinEquivalentRatio * (1 + uncertainty),
      median: 1000 * synth.psilocybinEquivalentRatio,
      max: 1000 * synth.psilocybinEquivalentRatio * (1 - uncertainty),
    };

    // Add synthetic warnings
    synth.warnings.forEach((w) => {
      warnings.push({ severity: "caution", message: w });
    });
    notes.push(synth.notes);
  } else {
    // Mushroom or sclerotia calculation
    const speciesKey =
      input.substance.type === "sclerotia"
        ? input.substance.species
        : input.substance.species;
    const species = SPECIES_DATABASE[speciesKey];

    if (!species) {
      throw new Error(`Unknown species: ${speciesKey}`);
    }

    // Calculate base potency
    let basePotencyMgPerG = calculatePotencyMgPerG(species);

    // Apply degradation factors
    const dryingFactor = getDryingDegradationFactor(input.dryingQuality);
    const storageFactor = 1 - (input.storageDegradation ?? 0);
    basePotencyMgPerG *= dryingFactor * storageFactor;

    if (input.storageDegradation && input.storageDegradation > 0) {
      notes.push(
        `Storage degradation: ${(input.storageDegradation * 100).toFixed(
          0,
        )}% potency loss assumed`,
      );
    }

    // Adjust for fresh material
    const formFactor =
      input.substance.form === "fresh" ? 1 / species.freshToDryRatio : 1;
    const effectivePotencyMgPerG = basePotencyMgPerG * formFactor;

    if (input.substance.form === "fresh") {
      notes.push(
        `Fresh material: ${species.freshToDryRatio}x weight compared to dried`,
      );
    }

    // Calculate dose range with uncertainty
    const uncertainty = species.uncertaintyFactor;
    const medianGrams = afterMAOIMg / effectivePotencyMgPerG;

    amount = {
      min: round(medianGrams * (1 - uncertainty), 2), // High potency batch
      median: round(medianGrams, 2),
      max: round(medianGrams * (1 + uncertainty), 2), // Low potency batch
    };
    unit = "g";

    potencyMgPerG = {
      min: round(effectivePotencyMgPerG * (1 - uncertainty), 2),
      median: round(effectivePotencyMgPerG, 2),
      max: round(effectivePotencyMgPerG * (1 + uncertainty), 2),
    };

    // Determine confidence based on species
    if (species.uncertaintyFactor <= 0.25) {
      confidence = "high";
    } else if (species.uncertaintyFactor <= 0.35) {
      confidence = "moderate";
    } else if (species.uncertaintyFactor <= 0.45) {
      confidence = "low";
    } else {
      confidence = "very_low";
    }

    // Add species-specific warnings
    species.warnings.forEach((w) => {
      const severity =
        w.includes("EXTREME") || w.includes("deadly")
          ? "danger"
          : w.includes("risk") || w.includes("WLP")
            ? "warning"
            : "caution";
      warnings.push({ severity, message: w });
    });
    notes.push(species.notes);
  }

  // 6. Add intensity-specific warnings
  if (input.intensity === "heroic") {
    warnings.push({
      severity: "danger",
      message:
        "HEROIC DOSE: High risk of overwhelming experience. Experienced sitter mandatory. Not for beginners.",
    });
  }

  // 7. General safety note
  notes.push(
    "Set and setting significantly influence outcomes. Prepare a safe, comfortable environment.",
  );

  // Calculate psilocybin equivalent ranges
  const psilocybinEquivalentMg: DoseRange = {
    min: round(afterMAOIMg * 0.85, 1),
    median: round(afterMAOIMg, 1),
    max: round(afterMAOIMg * 1.15, 1),
  };

  return {
    amount,
    unit,
    psilocybinEquivalentMg,
    toleranceMultiplier: round(toleranceMultiplier, 2),
    confidence,
    warnings,
    notes,
    citations,
    calculationBreakdown: {
      baseTargetMg: round(baseTargetMg, 1),
      afterWeightAdjustment: round(afterWeightMg, 1),
      afterTolerance: round(afterToleranceMg, 1),
      afterMAOI: round(afterMAOIMg, 1),
      potencyMgPerG,
    },
  };
}

// ============================================================================
// HELPER EXPORTS
// ============================================================================

export function getSpeciesList(): Array<{
  id: string;
  name: string;
  commonName: string;
  category: SubstanceCategory;
  relativePotency: number;
}> {
  return Object.entries(SPECIES_DATABASE).map(([id, data]) => ({
    id,
    name: data.name,
    commonName: data.commonName,
    category: data.category,
    relativePotency: data.relativeMultiplier,
  }));
}

export function getSyntheticList(): Array<{
  id: string;
  name: string;
  equivalentRatio: number;
}> {
  return Object.entries(SYNTHETIC_DATABASE).map(([id, data]) => ({
    id,
    name: data.name,
    equivalentRatio: data.psilocybinEquivalentRatio,
  }));
}

export function getIntensityLevels(): Array<{
  level: IntensityLevel;
  label: string;
  rangeDescription: string;
}> {
  const labels: Record<IntensityLevel, string> = {
    microdose: "Microdose",
    threshold: "Threshold",
    light: "Light",
    moderate: "Moderate",
    strong: "Strong",
    heroic: "Heroic",
  };

  return Object.entries(INTENSITY_TARGETS).map(([level, range]) => ({
    level: level as IntensityLevel,
    label: labels[level as IntensityLevel],
    rangeDescription: `${range.min}-${range.max}mg psilocybin-equivalent`,
  }));
}

export function estimateToleranceStatus(daysSinceLastDose: number): {
  tolerancePercent: number;
  daysToFullReset: number;
  recommendation: string;
} {
  // Use a standard 25mg reference dose
  const multiplier = calculateToleranceMultiplier({
    lastDosePsilocybinMg: 25,
    daysSinceLastDose,
  });

  const tolerancePercent = Math.round((multiplier - 1) * 100);
  const daysToFullReset = Math.max(0, 14 - daysSinceLastDose);

  let recommendation: string;
  if (tolerancePercent <= 5) {
    recommendation = "Full baseline sensitivity restored.";
  } else if (tolerancePercent <= 20) {
    recommendation = "Minimal tolerance. Normal dosing should work.";
  } else if (tolerancePercent <= 50) {
    recommendation = `Moderate tolerance. Consider waiting ${daysToFullReset} more days or increasing dose.`;
  } else {
    recommendation = `Significant tolerance. Recommend waiting for full reset (${daysToFullReset} days).`;
  }

  return { tolerancePercent, daysToFullReset, recommendation };
}

/**
 * Get species composition data for visualization
 * Returns psilocybin, psilocin, and baeocystin content
 */
export function getSpeciesComposition(speciesId: Species | SclerotiaSpecies): {
  psilocybin: number;
  psilocin: number;
  baeocystin: number;
  name: string;
} | null {
  const species = SPECIES_DATABASE[speciesId];
  if (!species) return null;

  return {
    psilocybin: species.psilocybinMgPerG,
    psilocin: species.psilocinMgPerG,
    baeocystin: species.baeocystinMgPerG,
    name: species.name,
  };
}
