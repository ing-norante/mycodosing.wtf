mycodosing – Psilocybin Dosage Calculator

Stack assumptions:

- Frontend: Vite + React + TypeScript
- Core logic is already implemented in a TS module that exports:
  - calculateDosage(input: DosageInput): DosageResult
  - getSpeciesList(), getSyntheticList(), getIntensityLevels()
  - estimateToleranceStatus(daysSinceLastDose)

The UI should be a neobrutalist, high-contrast interface with giant typography, flat boxes, and a simple grid. It must be extremely easy to use for non-technical users, but still feel clinical and data-driven.

========================================
CORE DOMAIN MODEL (MUST BE REFLECTED IN UI)
========================================

The TS logic defines:

Substance categories:

- "mushroom"
- "sclerotia"
- "synthetic"

Species (for mushrooms/sclerotia), e.g.:

- Psilocybe cubensis, azurescens, cyanescens, semilanceata, subaeruginosa, etc.
- Sclerotia variants: P. mexicana (sclerotia), P. tampanensis (sclerotia)

Synthetic compounds:

- "4_aco_dmt"
- "4_ho_met"
- "4_aco_met"

Intensity levels (from Type IntensityLevel):

- "microdose"
- "threshold"
- "light"
- "moderate"
- "strong"
- "heroic"

Each intensity level has a target **psilocybin-equivalent mg range**, e.g.:

- microdose: 1–3 mg
- strong: 20–30 mg
- heroic: 35–50 mg

DosageInput shape (simplified for UI):

- intensity: IntensityLevel (required)
- substance (union):
  - { type: "mushroom"; species: Species; form: "fresh" | "dried" }
  - { type: "sclerotia"; species: SclerotiaSpecies; form: "fresh" | "dried" }
  - { type: "synthetic"; compound: SyntheticCompound }
- Optional:
  - bodyWeightKg?: number
  - useWeightAdjustment?: boolean
  - tolerance?: { lastDosePsilocybinMg: number; daysSinceLastDose: number }
  - onMAOI?: boolean
  - storageDegradation?: number (0–1)
  - dryingQuality?: "optimal" | "average" | "poor"

DosageResult shape (simplified for UI):

- amount: { min, median, max } // DoseRange
- unit: "g" | "mg"
- psilocybinEquivalentMg: { min, median, max }
- toleranceMultiplier: number
- confidence: "high" | "moderate" | "low" | "very_low"
- warnings: { severity: "info" | "caution" | "warning" | "danger"; message: string }[]
- notes: string[]
- citations: { authors, year, title, relevance }[]
- calculationBreakdown:
  - baseTargetMg
  - afterWeightAdjustment
  - afterTolerance
  - afterMAOI
  - potencyMgPerG: { min, median, max }

There is also a helper:

- estimateToleranceStatus(daysSinceLastDose) → {
  tolerancePercent,
  daysToFullReset,
  recommendation
  }

========================================
UI GOALS
========================================

1. **Default flow must be trivial**:

   - Select substance type and species
   - Select dried/fresh (for natural materials)
   - Select intensity with a large, labeled slider
   - Click “Calculate”
   - Immediately see dose ranges and key warnings

2. **Advanced controls are visible but not overwhelming**:

   - Collapsible “Advanced” panel for body weight, tolerance, storage/drying details

3. **Output emphasizes ranges and safety**:

   - Show min / median / max dose clearly
   - Show psilocybin-equivalent mg
   - Show confidence level
   - Show warnings + citations in a neat stacked list

4. **Visual style**:
   - Neobrutalist:
     - Off-white or very dark background
     - Black text, 1 accent color (e.g., toxic green / electric blue)
     - Big, bold typography
     - Flat panels with thick borders, no shadows, no gradients
   - Slightly “lab notebook” feeling but with underground / hacker edge

========================================
LAYOUT SPECIFICATION
========================================

Overall layout:

- A responsive two- or three-column layout on desktop, collapsing to vertical on mobile.

Top area:

- Left:
  - Giant title: mycodosing”
  - Subtitle in smaller type: “Research-informed psychedelic dosage calculator v3.0”
  - Short disclaimer line: “Educational tool, not medical advice.”
- Right:
  - Small “About the model” box with a few citations (e.g., Garcia-Romeu 2021, Gotvaldová 2021, Buchborn 2016) and a “View all citations” link or expandable area.

Main content split into:

1. INPUT PANEL (left / center column)

---

“Session Setup” card

- Section: “Substance”

  - Large segmented buttons:
    - Mushrooms
    - Sclerotia
    - Synthetic (4-AcO-DMT / 4-HO-MET / 4-AcO-MET)
  - If Mushrooms selected:
    - Dropdown populated from getSpeciesList() filtered by category "mushroom".
    - Radio or toggle for “Dried / Fresh”.
  - If Sclerotia selected:
    - Dropdown from getSpeciesList() filtered by category "sclerotia".
    - Toggle “Fresh / Dried”.
  - If Synthetic selected:
    - Cards or radio buttons for each compound from getSyntheticList():
      - 4-AcO-DMT
      - 4-HO-MET
      - 4-AcO-MET

- Section: “Intensity”
  - Large horizontal slider with 6 stops from microdose → heroic.
  - Under the slider, show labels from getIntensityLevels():
    - “Microdose · 1–3 mg”
    - “Strong (Therapeutic) · 20–30 mg”
    - etc.
  - When level changes, show a small text explanation under it:
    - Example: “Heroic — very intense, high risk of overwhelming experiences.”

“Advanced Factors” collapsible card

- Toggled by a bold “ADVANCED” label in all caps.
- Inside:
  - Column “Body & Pharmacology”:
    - Numeric input: “Body weight (kg)”
    - Checkbox: “Use weight-based adjustment (not recommended for 49–113 kg per Garcia-Romeu 2021)”
    - Checkbox: “I am currently on an MAOI” (with inline red warning icon).
  - Column “Tolerance”:
    - Numeric input: “Last psilocybin-equivalent dose (mg)”
    - Numeric input: “Days since last session”
    - Below, dynamically display:
      - tolerancePercent and recommendation from estimateToleranceStatus()
  - Column “Material Quality”:
    - Select: Drying quality → Optimal / Average / Poor
    - Slider or numeric input: “Estimated storage potency loss (%)”
      - 0–50%, default 0

Bottom of input panel:

- A single, wide “CALCULATE DOSE” button using the accent color.
- Button should feel like a big slab / block, with clear pressed state.

2. OUTPUT PANEL (right column)

---

“Recommended Dose” card (dominant, big type)

- Large, bold readout:
  - If unit = "g":
    - “Dose range (grams of material)”
    - On three lines:
      - MIN: 1.23 g
      - MEDIAN: 1.65 g
      - MAX: 2.10 g
  - If unit = "mg" (synthetics):
    - “Dose range (mg of compound)”
    - Same min/median/max structure.
- Directly underneath:
  - “Psilocybin-equivalent (mg)” with min / median / max in a more compact row.

“Model Insight” card

- Small, structured table using the calculationBreakdown fields:
  - Target intensity: e.g. “Strong · 20–30 mg”
  - Base target mg
  - After weight adjustment
  - After tolerance (with multiplier shown, e.g. “×1.30”)
  - After MAOI
  - Effective potency mg/g (min / median / max)
- Show “Confidence level” badge based on result.confidence:
  - HIGH / MODERATE / LOW / VERY LOW
  - Color-coded strip (e.g., green / yellow / orange / red) but still flat.

“Warnings & Notes” card

- Vertical stack of pills or blocks for each Warning:
  - Color-coded by severity:
    - info = grey
    - caution = yellow
    - warning = orange
    - danger = red
  - Short, direct copy from result.warnings.message.
- Below, a simple bulleted list for:
  - result.notes (species info, drying/storage notes, set & setting reminder).

“References” card (can be collapsible)

- Display result.citations:
  - “Garcia-Romeu et al. (2021) — Optimal dosing for psilocybin pharmacotherapy – Relevance: …”
  - Keep typographic hierarchy simple: authors/year bold, title regular, relevance smaller.

========================================
COMPONENT BREAKDOWN (FOR REACT)
========================================

Aim for components that map cleanly to the TS API:

- <AppShell>
  - <Header />
  - <MainLayout>
    - <InputPanel
        speciesOptions={getSpeciesList()}
        syntheticOptions={getSyntheticList()}
        intensityLevels={getIntensityLevels()}
        onCalculate={(input: DosageInput) => calculateDosage(input)}
      />
    - <ResultPanel result={DosageResult | null} />
  - <FooterDisclaimer />

Key subcomponents:

- <SubstanceSelector />
- <IntensitySelector />
- <AdvancedSettings />
- <DoseSummary />
- <BreakdownTable />
- <WarningsList />
- <NotesList />
- <CitationList />

========================================
STYLE TOKENS
========================================

Define a small design system:

Colors:

- background: #f5f5f5 (light mode) or #101010 (dark mode)
- text: #000000 in light, #f8f8f8 in dark
- accent: pick one, e.g. #00ff88
- borders: #000000 at 2–3px
- severity colors:
  - info: #9e9e9e
  - caution: #ffd600
  - warning: #ff9800
  - danger: #f44336

Typography:

- Display: grotesk / sans-serif, very bold, tight uppercase
- Body: same family, regular weight
- Huge title size: 48–72px
- Section titles: 20–24px, uppercase
- Body text: 14–16px

Spacing:

- Base unit: 8px
- Cards: 24px padding
- Grid gutters: 24px

Component styling:

- All panels have thick (2–3px) black borders, square corners.
- Hover states: slight background change, maybe 5% darker or lighter.
- No drop shadows, no gradients.

========================================
COPY & MICROCOPY
========================================

Use direct, calm, harm-reduction oriented language. Examples:

- Intensity helper text:

  - “Strong (Therapeutic): similar to doses used in clinical depression trials.”
  - “Heroic: high risk and not recommended without extensive experience.”

- Tolerance section hint:

  - “Tolerance builds quickly and usually resets over ~14 days.”

- Global disclaimer (footer):
  - “This tool is for educational and harm-reduction purposes only. It is not medical advice. Illicit drug use is illegal in many jurisdictions.”

OUTPUT:
Return:

1. A concise description of the final screen design
2. A React component hierarchy suggestion (names only)
3. Visual styling details (colors, typography, spacing)
   All oriented around the existing TypeScript dosage API described above.
