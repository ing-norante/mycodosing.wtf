import { NumberInput } from "./NumberInput";
import { SectionHeader } from "./SectionHeader";
import { ToleranceStatusBadge } from "./ToleranceStatusBadge";
import { estimateToleranceStatus } from "@/lib/calculator";

interface ToleranceSectionProps {
  lastDosePsilocybinMg: number | undefined;
  daysSinceLastDose: number | undefined;
  onLastDoseChange: (mg: number | undefined) => void;
  onDaysSinceChange: (days: number | undefined) => void;
}

export function ToleranceSection({
  lastDosePsilocybinMg,
  daysSinceLastDose,
  onLastDoseChange,
  onDaysSinceChange,
}: ToleranceSectionProps) {
  const toleranceStatus =
    daysSinceLastDose !== undefined
      ? estimateToleranceStatus(daysSinceLastDose)
      : null;

  return (
    <div className="space-y-4">
      <SectionHeader title="Tolerance" />

      <NumberInput
        id="last-dose"
        label="Last psilocybin-equivalent dose (mg)"
        value={lastDosePsilocybinMg}
        onChange={onLastDoseChange}
        placeholder="25"
      />

      <NumberInput
        id="days-since-last-session"
        label="Days since last session"
        value={daysSinceLastDose}
        onChange={onDaysSinceChange}
        placeholder="14"
      />

      {toleranceStatus && <ToleranceStatusBadge status={toleranceStatus} />}

      <p className="text-xs font-semibold">
        Tolerance builds quickly and usually resets over ~14 days.
      </p>
    </div>
  );
}
