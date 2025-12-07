import { cn } from "@/lib/utils";
import type { IntensityLevel } from "@/lib/calculator";
import { getIntensityLevels } from "@/lib/calculator";

const INTENSITY_DESCRIPTIONS: Record<IntensityLevel, string> = {
  microdose: "Sub-perceptual. Fadiman protocol. No impairment expected.",
  threshold: "Barely perceptible effects. Mild mood lift, enhanced colors.",
  light: "Mild psychedelic effects. Enhanced senses, light visuals.",
  moderate: "Clear psychedelic state. Noticeable visuals, introspection.",
  strong: "Similar to doses used in clinical depression/anxiety trials.",
  heroic: "Very intense. High risk of overwhelming experiences. Sitter mandatory.",
};

interface IntensitySelectorProps {
  value: IntensityLevel;
  onChange: (intensity: IntensityLevel) => void;
}

export function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  const levels = getIntensityLevels();
  const currentIndex = levels.findIndex((l) => l.level === value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    onChange(levels[index].level);
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs uppercase tracking-widest text-muted-foreground">
        Intensity Level
      </label>

      {/* Current Level Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-black text-primary">
          {levels[currentIndex]?.label.toUpperCase()}
        </span>
        <span className="text-lg text-muted-foreground font-mono">
          {levels[currentIndex]?.rangeDescription}
        </span>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={levels.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-8"
        />

        {/* Level markers */}
        <div className="flex justify-between">
          {levels.map((level, i) => (
            <button
              key={level.level}
              onClick={() => onChange(level.level)}
              className={cn(
                "text-xs font-bold uppercase cursor-pointer transition-colors px-1",
                i === currentIndex
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
          "brutalist-card text-sm",
          value === "heroic" && "border-severity-danger bg-severity-danger/10",
          value === "strong" && "border-severity-warning bg-severity-warning/10"
        )}
      >
        <span
          className={cn(
            "font-bold",
            value === "heroic" && "text-severity-danger",
            value === "strong" && "text-severity-warning"
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

