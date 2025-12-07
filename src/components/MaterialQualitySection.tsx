import { Label } from "@/components/ui/label";
import { SectionHeader } from "./SectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface MaterialQualitySectionProps {
  dryingQuality: "optimal" | "average" | "poor";
  storageDegradation: number;
  onDryingQualityChange: (quality: "optimal" | "average" | "poor") => void;
  onStorageDegradationChange: (degradation: number) => void;
}

export function MaterialQualitySection({
  dryingQuality,
  storageDegradation,
  onDryingQualityChange,
  onStorageDegradationChange,
}: MaterialQualitySectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Material Quality" />

      <div>
        <Label
          htmlFor="drying-quality"
          className="mb-2 block text-xs font-semibold"
        >
          Drying quality
        </Label>
        <Select
          value={dryingQuality}
          onValueChange={(value) =>
            onDryingQualityChange(value as "optimal" | "average" | "poor")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select drying quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="optimal">
              Optimal{" "}
              <span className="text-xs font-normal">(freeze/fan-dried)</span>
            </SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="poor">
              Poor{" "}
              <span className="text-xs font-normal">(oven/slow-dried)</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold">
          Estimated storage potency loss (%)
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            key={`storage-${dryingQuality}`}
            min={0}
            max={50}
            step={1}
            value={[Math.round(storageDegradation * 100)]}
            onValueChange={(value) => {
              const newValue =
                Array.isArray(value) && value.length > 0
                  ? Number(value[0]) / 100
                  : 0;
              onStorageDegradationChange(newValue);
            }}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono font-bold">
            {Math.round(storageDegradation * 100)}%
          </span>
        </div>
        <p className="text-xs font-semibold">
          Old or improperly stored material loses potency
        </p>
      </div>
    </div>
  );
}
