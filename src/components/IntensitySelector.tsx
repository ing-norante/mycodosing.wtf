import { cn } from "@/lib/utils";
import type { IntensityLevel } from "@/lib/calculator";
import { getIntensityLevels } from "@/lib/calculator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const INTENSITY_DESCRIPTIONS: Record<IntensityLevel, string> = {
  microdose: "Sub-perceptual. Fadiman protocol. No impairment expected.",
  threshold: "Barely perceptible effects. Mild mood lift, enhanced colors.",
  light: "Mild psychedelic effects. Enhanced senses, light visuals.",
  moderate: "Clear psychedelic state. Noticeable visuals, introspection.",
  strong: "Similar to doses used in clinical depression/anxiety trials.",
  heroic:
    "Very intense. High risk of overwhelming experiences. Sitter mandatory.",
};

interface IntensitySelectorProps {
  value: IntensityLevel;
  onChange: (intensity: IntensityLevel) => void;
}

export function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  const levels = getIntensityLevels();
  const currentIndex = levels.findIndex((l) => l.level === value);

  return (
    <div className="space-y-4">
      <Label
        htmlFor="intensity-level"
        className="mb-2 block text-xs tracking-widest uppercase"
      >
        Intensity Level
      </Label>

      {/* Current Level Display */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-main text-3xl font-black sm:text-4xl">
          {levels[currentIndex]?.label.toUpperCase()}
        </span>
        <span className="text-foreground font-mono text-lg">
          {levels[currentIndex]?.rangeDescription}
        </span>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Slider
          max={levels.length - 1}
          step={1}
          value={[currentIndex]}
          onValueChange={(value) => onChange(levels[value[0]].level)}
        />

        {/* Level markers */}
        <div className="flex justify-between">
          {levels.map((level, i) => (
            <button
              key={level.level}
              onClick={() => onChange(level.level)}
              className={cn(
                "cursor-pointer px-1 text-xs font-bold uppercase transition-colors",
                i === currentIndex
                  ? "text-main"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {level.level.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div
        className={cn(
          "border-border shadow-shadow rounded-none border-2 px-4 py-3 text-sm",
          value === "heroic" && "border-red-600 bg-red-600/10",
          value === "strong" && "border-yellow-500 bg-yellow-500/10",
        )}
      >
        <span
          className={cn(
            "font-bold",
            value === "heroic" && "text-red-600",
            value === "strong" && "text-yellow-600",
          )}
        >
          {value === "heroic" && "⚠ "}
          {value === "strong" && "⚡ "}
        </span>
        {INTENSITY_DESCRIPTIONS[value]}
      </div>
    </div>
  );
}
