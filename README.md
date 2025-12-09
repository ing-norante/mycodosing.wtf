# mycodosing – Psilocybin Dosage Calculator

A research-informed psychedelic dosage calculator that provides accurate, science-based dosing recommendations for psilocybin-containing mushrooms, sclerotia (truffles), and synthetic compounds.

## Overview

**mycodosing** is an educational tool designed to help users make informed decisions about psilocybin dosing. The calculator synthesizes data from peer-reviewed research to account for:

- Species-specific potency variations
- Fresh vs. dried material
- Tolerance from previous sessions
- Body weight adjustments (with research-backed defaults)
- MAOI interactions
- Storage degradation and drying quality
- Uncertainty ranges for biological variability

The interface features a neobrutalist design with high contrast, bold typography, and a clean, clinical aesthetic that emphasizes safety and transparency.

## Features

### Core Functionality

- **Multi-substance support**: Calculate doses for 14+ mushroom species, sclerotia (truffles), and synthetic compounds (4-AcO-DMT, 4-HO-MET, 4-AcO-MET)
- **Intensity levels**: Six preset levels from microdose to heroic, each with research-backed psilocybin-equivalent ranges
- **Tolerance modeling**: Dose-dependent tolerance calculation based on 5-HT2A receptor downregulation kinetics
- **Uncertainty ranges**: Min/median/max dose ranges that account for biological variability
- **Confidence levels**: High/moderate/low/very_low confidence indicators based on data quality

### Advanced Features

- **Body weight adjustment**: Optional weight-based dosing (defaults to fixed-dose per Garcia-Romeu 2021)
- **MAOI warnings**: Automatic dose reduction and safety warnings for MAOI interactions
- **Material quality**: Adjustments for drying quality and storage degradation
- **Calculation breakdown**: Transparent view of how the dose was calculated
- **Scientific citations**: References to peer-reviewed research supporting each calculation
- **Warnings system**: Color-coded safety warnings (info/caution/warning/danger)

## Installation

### Prerequisites

- Node.js 18+ (or Bun)
- pnpm (recommended) or npm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mycodosing
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

## Usage

### Basic Workflow

1. **Select Substance**: Choose between Mushrooms, Sclerotia, or Synthetic compounds
2. **Choose Species/Compound**: Select the specific species or compound from the dropdown
3. **Select Form**: For natural materials, choose Fresh or Dried
4. **Set Intensity**: Use the slider to select your desired intensity level
5. **Calculate**: Click "CALCULATE DOSE" to see recommendations

### Advanced Options

Expand the "ADVANCED" section to adjust:

- **Body & Pharmacology**: Body weight and weight-based adjustment toggle
- **Tolerance**: Last dose amount and days since last session
- **Material Quality**: Drying quality and storage degradation percentage

### Understanding Results

The calculator provides:

- **Dose Range**: Min/median/max amounts in grams (mushrooms/sclerotia) or milligrams (synthetics)
- **Psilocybin Equivalent**: The calculated psilocybin-equivalent dose range
- **Confidence Level**: How reliable the calculation is based on data quality
- **Warnings**: Safety alerts specific to your substance and settings
- **Calculation Breakdown**: Step-by-step view of how adjustments were applied
- **Citations**: Scientific references supporting the calculations

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite (with Rolldown)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **Charts**: Recharts

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI primitives (Radix-based)
│   ├── InputPanel.tsx  # Main input interface
│   ├── ResultPanel.tsx # Results display
│   └── ...
├── lib/
│   ├── calculator.ts   # Core calculation logic
│   └── utils.ts        # Utility functions
├── stores/
│   └── useDosageStore.ts # Zustand state management
├── hooks/
│   └── useTheme.ts     # Theme management
└── assets/             # Images for species/compounds
```

## Scientific Foundation

The calculator is based on peer-reviewed research:

- **Garcia-Romeu et al. (2021)**: Fixed dosing vs. weight-adjusted dosing for psilocybin pharmacotherapy
- **Gotvaldová et al. (2021)**: LC-MS/MS analysis of psilocybin/psilocin content across species
- **Buchborn et al. (2016)**: 5-HT2A receptor tolerance kinetics and cross-tolerance

### Key Scientific Principles

1. **Uncertainty Ranges**: All calculations include min/median/max ranges to account for biological variability (strain differences, growing conditions, individual metabolism)

2. **Tolerance Model**: Dose-dependent tolerance with exponential decay based on 5-HT2A receptor downregulation. Full reset typically occurs around 14 days.

3. **Potency Calculations**: Accounts for psilocybin, psilocin (1.4x more potent), and baeocystin (0.5x potency) content

4. **Weight Adjustment**: Defaults to fixed-dose protocol per Garcia-Romeu 2021, which found no significant relationship between body weight (49-113kg) and subjective effects

## Disclaimer

**This tool is for educational and harm-reduction purposes only. It is not medical advice.**

- Illicit drug use is illegal in many jurisdictions
- Psychedelics can cause serious adverse reactions, especially in individuals with pre-existing mental health conditions
- Always practice harm reduction: test your substances, use in safe settings, and have a sober sitter for higher doses
- This calculator cannot account for all individual factors (genetics, medications, health conditions, etc.)

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting (with Tailwind plugin)
- React Compiler enabled for optimizations

### Key Design Decisions

- **Neobrutalist UI**: High contrast, bold typography, flat design with thick borders
- **State Persistence**: User preferences (substance, body weight) persist across sessions
- **Safety First**: Dangerous settings (MAOI, tolerance) are not persisted to prevent accidental application
- **Transparency**: All calculations are visible in the breakdown table

## Contributing

Contributions are welcome! Please ensure that:

- Any new species/compounds are backed by peer-reviewed research
- Potency data includes uncertainty factors
- Warnings are added for known risks
- Citations are properly formatted

## License

MIT License
