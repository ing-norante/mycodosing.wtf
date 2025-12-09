import { NumberInput } from "./NumberInput";
import { SectionHeader } from "./SectionHeader";
import { ToleranceStatusBadge } from "./ToleranceStatusBadge";
import { estimateToleranceStatus } from "@/lib/calculator";
import { useDosageStore } from "@/stores/useDosageStore";

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

      <p className="text-xs font-semibold">
        Tolerance builds quickly and usually resets over ~14 days.
      </p>
    </div>
  );
}
