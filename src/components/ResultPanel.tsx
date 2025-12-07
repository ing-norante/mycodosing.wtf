import { cn } from "@/lib/utils";
import type { DosageResult, ConfidenceLevel } from "@/lib/calculator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// ============================================================================
// Dose Summary Component
// ============================================================================

function DoseSummary({ result }: { result: DosageResult }) {
  const { amount, unit, psilocybinEquivalentMg } = result;

  return (
    <div className="brutalist-card">
      <h3 className="text-muted-foreground mb-4 text-xs tracking-widest uppercase">
        Recommended Dose
      </h3>

      <div className="text-muted-foreground mb-2 text-sm">
        Dose range ({unit === "g" ? "grams of material" : "mg of compound"})
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            Min
          </div>
          <div className="text-muted-foreground font-mono text-3xl font-black sm:text-4xl">
            {amount.min}
          </div>
          <div className="font-mono text-sm">{unit}</div>
        </div>
        <div className="border-main border-x-3 text-center">
          <div className="text-main mb-1 text-xs uppercase">Median</div>
          <div className="text-main font-mono text-4xl font-black sm:text-5xl">
            {amount.median}
          </div>
          <div className="text-main font-mono text-sm">{unit}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            Max
          </div>
          <div className="text-muted-foreground font-mono text-3xl font-black sm:text-4xl">
            {amount.max}
          </div>
          <div className="font-mono text-sm">{unit}</div>
        </div>
      </div>

      {/* Psilocybin Equivalent */}
      <div className="border-border border-t-3 pt-4">
        <div className="text-muted-foreground mb-2 text-xs uppercase">
          Psilocybin-equivalent (mg)
        </div>
        <div className="flex items-baseline gap-4 font-mono">
          <span className="text-muted-foreground">
            {psilocybinEquivalentMg.min}
          </span>
          <span className="text-main text-lg font-bold">
            {psilocybinEquivalentMg.median}
          </span>
          <span className="text-muted-foreground">
            {psilocybinEquivalentMg.max}
          </span>
          <span className="text-muted-foreground text-xs">mg</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Breakdown Table Component
// ============================================================================

const CONFIDENCE_STYLES: Record<
  ConfidenceLevel,
  { bg: string; text: string; label: string }
> = {
  high: {
    bg: "bg-confidence-high/20",
    text: "text-confidence-high",
    label: "HIGH",
  },
  moderate: {
    bg: "bg-severity-caution/20",
    text: "text-severity-caution",
    label: "MODERATE",
  },
  low: {
    bg: "bg-severity-warning/20",
    text: "text-severity-warning",
    label: "LOW",
  },
  very_low: {
    bg: "bg-severity-danger/20",
    text: "text-severity-danger",
    label: "VERY LOW",
  },
};

function BreakdownTable({ result }: { result: DosageResult }) {
  const { calculationBreakdown, toleranceMultiplier, confidence } = result;
  const {
    baseTargetMg,
    afterWeightAdjustment,
    afterTolerance,
    afterMAOI,
    potencyMgPerG,
  } = calculationBreakdown;

  const confidenceStyle = CONFIDENCE_STYLES[confidence];

  return (
    <div className="brutalist-card">
      <h3 className="text-muted-foreground mb-4 text-xs tracking-widest uppercase">
        Model Insight
      </h3>

      <table className="w-full text-sm">
        <tbody className="divide-border divide-y">
          <tr>
            <td className="text-muted-foreground py-2">Base target</td>
            <td className="py-2 text-right font-mono font-bold">
              {baseTargetMg} mg
            </td>
          </tr>
          <tr>
            <td className="text-muted-foreground py-2">After weight adjust</td>
            <td className="py-2 text-right font-mono">
              {afterWeightAdjustment} mg
            </td>
          </tr>
          <tr>
            <td className="text-muted-foreground py-2">
              After tolerance{" "}
              {toleranceMultiplier > 1 && (
                <span className="text-severity-warning">
                  (×{toleranceMultiplier.toFixed(2)})
                </span>
              )}
            </td>
            <td className="py-2 text-right font-mono">{afterTolerance} mg</td>
          </tr>
          <tr>
            <td className="text-muted-foreground py-2">After MAOI</td>
            <td className="text-main py-2 text-right font-mono font-bold">
              {afterMAOI} mg
            </td>
          </tr>
          <tr>
            <td className="text-muted-foreground py-2">Effective potency</td>
            <td className="py-2 text-right font-mono text-xs">
              {potencyMgPerG.min}–{potencyMgPerG.max} mg/g
            </td>
          </tr>
        </tbody>
      </table>

      {/* Confidence Badge */}
      <div className="border-border mt-4 border-t pt-4">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs uppercase">
            Confidence:
          </span>
          <span
            className={cn(
              "border-2 border-current px-3 py-1 text-sm font-bold",
              confidenceStyle.bg,
              confidenceStyle.text,
            )}
          >
            {confidenceStyle.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Warnings List Component
// ============================================================================

const SEVERITY_STYLES = {
  info: {
    bg: "bg-severity-info/20",
    border: "border-severity-info",
    icon: "ℹ",
  },
  caution: {
    bg: "bg-severity-caution/20",
    border: "border-severity-caution",
    icon: "⚡",
  },
  warning: {
    bg: "bg-severity-warning/20",
    border: "border-severity-warning",
    icon: "⚠",
  },
  danger: {
    bg: "bg-severity-danger/20",
    border: "border-severity-danger",
    icon: "🚨",
  },
};

function WarningsList({ result }: { result: DosageResult }) {
  const { warnings, notes } = result;

  if (warnings.length === 0 && notes.length === 0) return null;

  return (
    <div className="brutalist-card">
      <h3 className="text-muted-foreground mb-4 text-xs tracking-widest uppercase">
        Warnings & Notes
      </h3>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-4 space-y-2">
          {warnings.map((warning, i) => {
            const style = SEVERITY_STYLES[warning.severity];
            return (
              <div
                key={i}
                className={cn("border-l-4 p-3 text-sm", style.bg, style.border)}
              >
                <span className="mr-2">{style.icon}</span>
                {warning.message}
              </div>
            );
          })}
        </div>
      )}

      {/* Notes */}
      {notes.length > 0 && (
        <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// Citations List Component
// ============================================================================

function CitationsList({ result }: { result: DosageResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const { citations } = result;

  if (citations.length === 0) return null;

  return (
    <div className="brutalist-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between"
      >
        <h3 className="text-muted-foreground text-xs tracking-widest uppercase">
          References ({citations.length})
        </h3>
        {isOpen ? (
          <ChevronUp className="text-muted-foreground h-4 w-4" />
        ) : (
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {citations.map((cite, i) => (
            <div key={i} className="text-sm">
              <span className="font-bold">
                {cite.authors} ({cite.year})
              </span>
              <span className="text-muted-foreground"> — {cite.title}</span>
              <p className="text-muted-foreground border-border mt-1 border-l-2 pl-4 text-xs">
                Relevance: {cite.relevance}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Result Panel Component
// ============================================================================

interface ResultPanelProps {
  result: DosageResult | null;
}

export function ResultPanel({ result }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="brutalist-card flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl opacity-30">🍄</div>
        <h3 className="mb-2 text-xl font-bold uppercase">
          Configure your session
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Select a substance, choose your intensity, and click "Calculate Dose"
          to see personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DoseSummary result={result} />
      <BreakdownTable result={result} />
      <WarningsList result={result} />
      <CitationsList result={result} />
    </div>
  );
}
