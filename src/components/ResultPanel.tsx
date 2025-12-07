import { cn } from "@/lib/utils";
import type { DosageResult, ConfidenceLevel } from "@/lib/calculator";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CitationsList } from "@/components/ScientificFoundation";

// ============================================================================
// Dose Summary Component
// ============================================================================

function DoseSummary({ result }: { result: DosageResult }) {
  const { amount, unit, psilocybinEquivalentMg } = result;

  return (
    <div className="brutalist-card">
      <h3 className="mb-4 text-xs tracking-widest uppercase">
        Recommended Dose
      </h3>

      <div className="mb-2 text-sm">
        Dose range ({unit === "g" ? "grams of material" : "mg of compound"})
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="mb-1 text-xs uppercase">Min</div>
          <div className="font-mono text-3xl font-black sm:text-4xl">
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
          <div className="mb-1 text-xs uppercase">Max</div>
          <div className="font-mono text-3xl font-black sm:text-4xl">
            {amount.max}
          </div>
          <div className="font-mono text-sm">{unit}</div>
        </div>
      </div>

      {/* Psilocybin Equivalent */}
      <div className="border-border border-t-3 pt-4">
        <div className="mb-2 text-xs uppercase">Psilocybin-equivalent (mg)</div>
        <div className="flex items-baseline gap-4 font-mono">
          <span>{psilocybinEquivalentMg.min}</span>
          <span className="text-main text-lg font-bold">
            {psilocybinEquivalentMg.median}
          </span>
          <span>{psilocybinEquivalentMg.max}</span>
          <span className="text-xs">mg</span>
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
    bg: "bg-green-100",
    text: "text-green-600",
    label: "HIGH",
  },
  moderate: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    label: "MODERATE",
  },
  low: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    label: "LOW",
  },
  very_low: {
    bg: "bg-red-100",
    text: "text-red-600",
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
    <Card className="p-2">
      <h3 className="text-xs tracking-widest uppercase">Model Insight</h3>

      <Table className="w-full text-sm">
        <TableBody className="divide-border divide-y">
          <TableRow>
            <TableCell className="py-2">Base target</TableCell>
            <TableCell className="py-2 text-right font-mono font-bold">
              {baseTargetMg} mg
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-2">After weight adjust</TableCell>
            <TableCell className="py-2 text-right font-mono">
              {afterWeightAdjustment} mg
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-2">
              After tolerance{" "}
              {toleranceMultiplier > 1 && (
                <span className="text-background">
                  (<X className="text-background inline-block size-3" />
                  {toleranceMultiplier.toFixed(2)})
                </span>
              )}
            </TableCell>
            <TableCell className="py-2 text-right font-mono">
              {afterTolerance} mg
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-2">After MAOI</TableCell>
            <TableCell className="text-main py-2 text-right font-mono font-bold">
              {afterMAOI} mg
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-2">Effective potency</TableCell>
            <TableCell className="py-2 text-right font-mono text-xs">
              {potencyMgPerG.min}-{potencyMgPerG.max} mg/g
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Confidence Badge */}
      <div className="border-border mt-4 border-t pt-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase">Confidence:</span>
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
    </Card>
  );
}

// ============================================================================
// Warnings List Component
// ============================================================================

const SEVERITY_STYLES = {
  info: {
    bg: "bg-sky-100",
    border: "border-sky-400",
    icon: "i",
  },
  caution: {
    bg: "bg-yellow-100",
    border: "border-yellow-400",
    icon: "⚡",
  },
  warning: {
    bg: "bg-orange-100",
    border: "border-orange-400",
    icon: "⚠",
  },
  danger: {
    bg: "bg-red-100",
    border: "border-red-500",
    icon: "🚨",
  },
};

function WarningsList({ result }: { result: DosageResult }) {
  const { warnings, notes } = result;

  if (warnings.length === 0 && notes.length === 0) return null;

  return (
    <Card className="p-2">
      <h3 className="mb-4 text-xs tracking-widest uppercase">
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
        <ul className="list-inside list-disc space-y-1 text-sm">
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ============================================================================
// Citations List Component
// ============================================================================

function ResultCitationsList({ result }: { result: DosageResult }) {
  const { citations } = result;

  return <CitationsList citations={citations} title="References" />;
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
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl opacity-30">🍄</div>
        <h3 className="mb-2 text-xl font-bold uppercase">
          Configure your session
        </h3>
        <p className="max-w-sm">
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
      <ResultCitationsList result={result} />
    </div>
  );
}
