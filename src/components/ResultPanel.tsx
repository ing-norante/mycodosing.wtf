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
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
        Recommended Dose
      </h3>

      <div className="text-sm text-muted-foreground mb-2">
        Dose range ({unit === "g" ? "grams of material" : "mg of compound"})
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-xs uppercase text-muted-foreground mb-1">Min</div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-muted-foreground">
            {amount.min}
          </div>
          <div className="text-sm font-mono">{unit}</div>
        </div>
        <div className="text-center border-x-3 border-primary">
          <div className="text-xs uppercase text-primary mb-1">Median</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-primary">
            {amount.median}
          </div>
          <div className="text-sm font-mono text-primary">{unit}</div>
        </div>
        <div className="text-center">
          <div className="text-xs uppercase text-muted-foreground mb-1">Max</div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-muted-foreground">
            {amount.max}
          </div>
          <div className="text-sm font-mono">{unit}</div>
        </div>
      </div>

      {/* Psilocybin Equivalent */}
      <div className="border-t-3 border-border pt-4">
        <div className="text-xs uppercase text-muted-foreground mb-2">
          Psilocybin-equivalent (mg)
        </div>
        <div className="flex items-baseline gap-4 font-mono">
          <span className="text-muted-foreground">
            {psilocybinEquivalentMg.min}
          </span>
          <span className="text-lg font-bold text-primary">
            {psilocybinEquivalentMg.median}
          </span>
          <span className="text-muted-foreground">
            {psilocybinEquivalentMg.max}
          </span>
          <span className="text-xs text-muted-foreground">mg</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Breakdown Table Component
// ============================================================================

const CONFIDENCE_STYLES: Record<ConfidenceLevel, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-confidence-high/20", text: "text-confidence-high", label: "HIGH" },
  moderate: { bg: "bg-severity-caution/20", text: "text-severity-caution", label: "MODERATE" },
  low: { bg: "bg-severity-warning/20", text: "text-severity-warning", label: "LOW" },
  very_low: { bg: "bg-severity-danger/20", text: "text-severity-danger", label: "VERY LOW" },
};

function BreakdownTable({ result }: { result: DosageResult }) {
  const { calculationBreakdown, toleranceMultiplier, confidence } = result;
  const { baseTargetMg, afterWeightAdjustment, afterTolerance, afterMAOI, potencyMgPerG } =
    calculationBreakdown;

  const confidenceStyle = CONFIDENCE_STYLES[confidence];

  return (
    <div className="brutalist-card">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
        Model Insight
      </h3>

      <table className="w-full text-sm">
        <tbody className="divide-y divide-border">
          <tr>
            <td className="py-2 text-muted-foreground">Base target</td>
            <td className="py-2 text-right font-mono font-bold">
              {baseTargetMg} mg
            </td>
          </tr>
          <tr>
            <td className="py-2 text-muted-foreground">After weight adjust</td>
            <td className="py-2 text-right font-mono">
              {afterWeightAdjustment} mg
            </td>
          </tr>
          <tr>
            <td className="py-2 text-muted-foreground">
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
            <td className="py-2 text-muted-foreground">After MAOI</td>
            <td className="py-2 text-right font-mono font-bold text-primary">
              {afterMAOI} mg
            </td>
          </tr>
          <tr>
            <td className="py-2 text-muted-foreground">Effective potency</td>
            <td className="py-2 text-right font-mono text-xs">
              {potencyMgPerG.min}–{potencyMgPerG.max} mg/g
            </td>
          </tr>
        </tbody>
      </table>

      {/* Confidence Badge */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase text-muted-foreground">
            Confidence:
          </span>
          <span
            className={cn(
              "px-3 py-1 font-bold text-sm border-2 border-current",
              confidenceStyle.bg,
              confidenceStyle.text
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
  info: { bg: "bg-severity-info/20", border: "border-severity-info", icon: "ℹ" },
  caution: { bg: "bg-severity-caution/20", border: "border-severity-caution", icon: "⚡" },
  warning: { bg: "bg-severity-warning/20", border: "border-severity-warning", icon: "⚠" },
  danger: { bg: "bg-severity-danger/20", border: "border-severity-danger", icon: "🚨" },
};

function WarningsList({ result }: { result: DosageResult }) {
  const { warnings, notes } = result;

  if (warnings.length === 0 && notes.length === 0) return null;

  return (
    <div className="brutalist-card">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
        Warnings & Notes
      </h3>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2 mb-4">
          {warnings.map((warning, i) => {
            const style = SEVERITY_STYLES[warning.severity];
            return (
              <div
                key={i}
                className={cn(
                  "p-3 border-l-4 text-sm",
                  style.bg,
                  style.border
                )}
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
        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
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
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
          References ({citations.length})
        </h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
              <p className="text-xs text-muted-foreground mt-1 pl-4 border-l-2 border-border">
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
      <div className="brutalist-card flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4 opacity-30">🍄</div>
        <h3 className="text-xl font-bold uppercase mb-2">
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

