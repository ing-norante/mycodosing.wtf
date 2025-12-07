import { cn } from "@/lib/utils";
import type { estimateToleranceStatus } from "@/lib/calculator";

type ToleranceStatus = ReturnType<typeof estimateToleranceStatus>;

interface ToleranceStatusBadgeProps {
  status: ToleranceStatus;
}

export function ToleranceStatusBadge({ status }: ToleranceStatusBadgeProps) {
  return (
    <div
      className={cn(
        "border-3 p-3 text-sm",
        status.tolerancePercent <= 5
          ? "border-green-600 bg-green-100"
          : status.tolerancePercent <= 20
            ? "border-yellow-500 bg-yellow-100"
            : "border-red-600 bg-red-100",
      )}
    >
      <div className="font-mono font-bold">
        {status.tolerancePercent}% tolerance
      </div>
      <div className="mt-1 text-xs">{status.recommendation}</div>
      {status.daysToFullReset > 0 && (
        <div className="mt-1 text-xs">
          Full reset in {status.daysToFullReset} days
        </div>
      )}
    </div>
  );
}
