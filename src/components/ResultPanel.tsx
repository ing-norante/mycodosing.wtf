import { cn } from "@/lib/utils";
import type { DosageResult, ConfidenceLevel } from "@/lib/calculator";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CitationsList } from "@/components/ScientificFoundation";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Cell,
  Pie,
  PieChart,
  Area,
  AreaChart,
} from "recharts";
import { getSpeciesComposition } from "@/lib/calculator";
import type { DosageInput } from "@/lib/calculator";

// ============================================================================
// Dose Summary Component
// ============================================================================

function DoseSummary({
  result,
  input,
}: {
  result: DosageResult;
  input?: DosageInput;
}) {
  const { amount, unit, psilocybinEquivalentMg } = result;

  // Prepare data for bar chart
  const chartData = [
    {
      label: "Min",
      value: amount.min,
      psilocybin: psilocybinEquivalentMg.min,
      isMedian: false,
    },
    {
      label: "Median",
      value: amount.median,
      psilocybin: psilocybinEquivalentMg.median,
      isMedian: true,
    },
    {
      label: "Max",
      value: amount.max,
      psilocybin: psilocybinEquivalentMg.max,
      isMedian: false,
    },
  ];

  const chartConfig = {
    value: {
      label: `Dose (${unit})`,
      color: "var(--chart-1)",
    },
    median: {
      label: `Dose (${unit}) - Median`,
      color: "var(--chart-2)",
    },
    psilocybin: {
      label: "Psilocybin (mg)",
      color: "var(--chart-3)",
    },
  };

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-xs tracking-widest uppercase">
        Recommended Dose
      </h3>

      <div className="mb-4 text-sm">
        Dose range ({unit === "g" ? "grams of material" : "mg of compound"})
      </div>

      {/* Bar Chart */}
      <div className="mb-6">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="value" radius={[0, 0, 0, 0]} strokeWidth={3}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isMedian ? "var(--chart-1)" : "var(--background)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      {/* Numerical values for reference */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="mb-1 text-xs uppercase">Min</div>
          <div className="font-mono text-2xl font-black sm:text-4xl">
            {amount.min}
          </div>
          <div className="font-mono text-sm">{unit}</div>
        </div>
        <div className="border-main border-x-3 text-center">
          <div className="text-main mb-1 text-xs uppercase">Median</div>
          <div className="text-main font-mono text-3xl font-black sm:text-5xl">
            {amount.median}
          </div>
          <div className="text-main font-mono text-sm">{unit}</div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-xs uppercase">Max</div>
          <div className="font-mono text-2xl font-black sm:text-4xl">
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

      {/* Potency Composition Donut Chart */}
      {input &&
        input.substance.type !== "synthetic" &&
        (() => {
          const composition = getSpeciesComposition(input.substance.species);
          if (!composition) return null;

          const total =
            composition.psilocybin +
            composition.psilocin +
            composition.baeocystin;
          if (total === 0) return null;

          const pieData = [
            {
              name: "Psilocybin",
              value: composition.psilocybin,
              percentage: ((composition.psilocybin / total) * 100).toFixed(1),
            },
            {
              name: "Psilocin",
              value: composition.psilocin,
              percentage: ((composition.psilocin / total) * 100).toFixed(1),
            },
            {
              name: "Baeocystin",
              value: composition.baeocystin,
              percentage: ((composition.baeocystin / total) * 100).toFixed(1),
            },
          ].filter((item) => item.value > 0);

          const pieConfig = {
            psilocybin: {
              label: "Psilocybin",
              color: "var(--chart-1)",
            },
            psilocin: {
              label: "Psilocin",
              color: "var(--chart-2)",
            },
            baeocystin: {
              label: "Baeocystin",
              color: "var(--chart-3)",
            },
          };

          return (
            <div className="border-border mt-4 border-t-3 pt-4">
              <h4 className="mb-3 text-xs tracking-widest uppercase">
                Chemical Composition
              </h4>
              <ChartContainer config={pieConfig} className="h-[200px] w-full">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    strokeWidth={3}
                    stroke="hsl(var(--border))"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`var(--color-${entry.name.toLowerCase()})`}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="border-border bg-background rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
                          <div className="font-bold">{data.name}</div>
                          <div className="text-muted-foreground">
                            {data.value.toFixed(2)} mg/g
                          </div>
                          <div className="text-muted-foreground">
                            {data.percentage}%
                          </div>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ChartContainer>
              <div className="mt-2 text-center text-xs">
                <span className="font-mono">
                  {composition.name} (dried material)
                </span>
              </div>
            </div>
          );
        })()}

      {/* Uncertainty Range Area Chart */}
      <div className="border-border mt-4 border-t-3 pt-4">
        <h4 className="mb-3 text-xs tracking-widest uppercase">
          Uncertainty Range
        </h4>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <AreaChart
            data={[
              { label: "Min", value: amount.min },
              { label: "Median", value: amount.median },
              { label: "Max", value: amount.max },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <defs>
              <linearGradient id="fillUncertainty" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={3}
              fill="url(#fillUncertainty)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
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

  // Prepare data for line chart
  const chartData = [
    { step: "Base", value: baseTargetMg },
    { step: "Weight", value: afterWeightAdjustment },
    { step: "Tolerance", value: afterTolerance },
    { step: "MAOI", value: afterMAOI },
  ];

  const chartConfig = {
    value: {
      label: "Dose (mg)",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-xs tracking-widest uppercase">Model Insight</h3>

      {/* Calculation Breakdown Line Chart */}
      <div className="mb-6">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="step"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={{ fill: "var(--chart-1)", r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>

      <Table className="w-full text-sm">
        <TableBody className="divide-border divide-y">
          <TableRow className="bg-transparent">
            <TableCell className="py-2">Base target</TableCell>
            <TableCell className="py-2 text-right font-mono font-bold">
              {baseTargetMg} mg
            </TableCell>
          </TableRow>
          <TableRow className="bg-transparent">
            <TableCell className="py-2">After weight adjust</TableCell>
            <TableCell className="py-2 text-right font-mono">
              {afterWeightAdjustment} mg
            </TableCell>
          </TableRow>
          <TableRow className="bg-transparent">
            <TableCell className="py-2">
              After tolerance{" "}
              {toleranceMultiplier > 1 && (
                <span className="text-main">
                  (<X className="text-main inline-block size-3" />
                  {toleranceMultiplier.toFixed(2)})
                </span>
              )}
            </TableCell>
            <TableCell className="py-2 text-right font-mono">
              {afterTolerance} mg
            </TableCell>
          </TableRow>
          <TableRow className="bg-transparent">
            <TableCell className="py-2">After MAOI</TableCell>
            <TableCell className="text-main py-2 text-right font-mono font-bold">
              {afterMAOI} mg
            </TableCell>
          </TableRow>
          <TableRow className="bg-transparent">
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
    <Card className="p-4">
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
  input?: DosageInput;
}

export function ResultPanel({ result, input }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="space-y-4">
        <p className="border-foreground border-l-4 pl-4 text-xl leading-relaxed font-medium">
          No accounts, no servers. <br />
          <span className="bg-yellow-300 px-1 font-bold text-black dark:bg-yellow-400">
            100% client-side.
          </span>
          <br />
          Nothing leaves your browser.
        </p>
        <Card className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
          <div className="mb-4 text-6xl opacity-50">🍄</div>
          <h3 className="mb-2 text-xl font-bold uppercase">
            Configure your session
          </h3>
          <p className="max-w-sm">
            Select a substance, choose your intensity, and click "Calculate
            Dose" to see personalized recommendations.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DoseSummary result={result} input={input} />
      <BreakdownTable result={result} />
      <WarningsList result={result} />
      <ResultCitationsList result={result} />
    </div>
  );
}
