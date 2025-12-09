import { NumberInput } from "@/components/NumberInput";
import { SectionHeader } from "@/components/SectionHeader";
import { ToleranceStatusBadge } from "@/components/ToleranceStatusBadge";
import { estimateToleranceStatus } from "@/lib/calculator";
import { useDosageStore } from "@/stores/useDosageStore";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

// Helper function to calculate tolerance multiplier for a given day
function calculateToleranceForDay(
  lastDoseMg: number,
  daysSince: number,
): number {
  if (daysSince >= 14) return 1.0;
  if (daysSince <= 0) return 2.5;

  const doseImpact = Math.max(0.2, Math.min(2.0, lastDoseMg / 25));
  const HALF_LIFE_DAYS = 2.8;
  const DECAY_CONSTANT = Math.LN2 / HALF_LIFE_DAYS;
  const PEAK_TOLERANCE = 1.2;

  const toleranceRemaining =
    PEAK_TOLERANCE * doseImpact * Math.exp(-DECAY_CONSTANT * daysSince);

  return Math.max(1.0, Math.min(2.5, 1 + toleranceRemaining));
}

export function ToleranceSection() {
  const {
    lastDosePsilocybinMg,
    setLastDosePsilocybinMg,
    daysSinceLastDose,
    setDaysSinceLastDose,
  } = useDosageStore();

  const toleranceStatus =
    daysSinceLastDose !== undefined
      ? estimateToleranceStatus(daysSinceLastDose)
      : null;

  // Generate tolerance recovery curve data (14 days)
  const referenceDose = lastDosePsilocybinMg ?? 25;
  const chartData = Array.from({ length: 15 }, (_, i) => ({
    day: i,
    multiplier: calculateToleranceForDay(referenceDose, i),
    tolerancePercent: Math.round(
      (calculateToleranceForDay(referenceDose, i) - 1) * 100,
    ),
  }));

  const currentDay = daysSinceLastDose !== undefined ? daysSinceLastDose : null;
  const currentMultiplier =
    currentDay !== null
      ? calculateToleranceForDay(referenceDose, currentDay)
      : null;

  const chartConfig = {
    multiplier: {
      label: "Dose Multiplier",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Tolerance" />

      <NumberInput
        id="last-dose"
        label="Last psilocybin-equivalent dose (mg)"
        value={lastDosePsilocybinMg}
        onChange={setLastDosePsilocybinMg}
        placeholder="25"
      />

      <NumberInput
        id="days-since-last-session"
        label="Days since last session"
        value={daysSinceLastDose}
        onChange={setDaysSinceLastDose}
        placeholder="14"
      />

      {toleranceStatus && <ToleranceStatusBadge status={toleranceStatus} />}

      {/* Tolerance Recovery Timeline Chart */}
      {(lastDosePsilocybinMg !== undefined ||
        daysSinceLastDose !== undefined) && (
        <div className="border-border rounded-none border-2 p-4">
          <h4 className="mb-3 text-xs tracking-widest uppercase">
            Tolerance Recovery Timeline
          </h4>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillMultiplier" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-multiplier)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-multiplier)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--foreground))" }}
                label={{
                  value: "Days Since Last Dose",
                  position: "insideBottom",
                  offset: -5,
                  style: { fill: "hsl(var(--foreground))" },
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--foreground))" }}
                domain={[0.8, 2.6]}
                label={{
                  value: "Multiplier",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "hsl(var(--foreground))" },
                }}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="border-border bg-background rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
                      <div className="font-bold">Day {data.day}</div>
                      <div className="text-muted-foreground">
                        Multiplier: {data.multiplier.toFixed(2)}x
                      </div>
                      <div className="text-muted-foreground">
                        Tolerance: {data.tolerancePercent}%
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="multiplier"
                stroke="var(--color-multiplier)"
                strokeWidth={3}
                fill="url(#fillMultiplier)"
                activeDot={{
                  r: 6,
                  fill: "hsl(var(--main))",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
              {/* Current position indicator */}
              {currentDay !== null && (
                <ReferenceLine
                  x={currentDay}
                  stroke="hsl(var(--main))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: "Today",
                    position: "top",
                    fill: "hsl(var(--main))",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                />
              )}
            </AreaChart>
          </ChartContainer>
          {currentDay !== null && currentMultiplier !== null && (
            <div className="mt-2 text-center text-xs">
              <span className="font-mono font-bold">
                Day {currentDay}: {currentMultiplier.toFixed(2)}x multiplier
              </span>
            </div>
          )}
        </div>
      )}

      <p className="text-xs font-semibold">
        Tolerance builds quickly and usually resets over ~14 days.
      </p>
    </div>
  );
}
