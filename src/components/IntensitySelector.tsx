import { cn } from "@/lib/utils";
import type { IntensityLevel } from "@/lib/calculator";
import { getIntensityLevels } from "@/lib/calculator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useDosageStore } from "@/stores/useDosageStore";

const INTENSITY_DESCRIPTIONS: Record<IntensityLevel, string> = {
  microdose: "Sub-perceptual. Fadiman protocol. No impairment expected.",
  threshold: "Barely perceptible effects. Mild mood lift, enhanced colors.",
  light: "Mild psychedelic effects. Enhanced senses, light visuals.",
  moderate: "Clear psychedelic state. Noticeable visuals, introspection.",
  strong: "Similar to doses used in clinical depression/anxiety trials.",
  heroic:
    "Very intense. High risk of overwhelming experiences. Sitter mandatory.",
};

export function IntensitySelector() {
  const { intensity, setIntensity } = useDosageStore();

  const levels = getIntensityLevels();
  const currentIndex = levels.findIndex((l) => l.level === intensity);

  return (
    <div className="space-y-4">
      <Label
        htmlFor="intensity-level"
        className="mb-2 block text-xs tracking-widest uppercase"
      >
        Intensity Level
      </Label>

      {/* Current Level Display */}
      <div className="flex flex-col items-baseline justify-between gap-3 lg:flex-row">
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
          onValueChange={(value) => setIntensity(levels[value[0]].level)}
        />

        {/* Level markers */}
        <div className="flex justify-between">
          {levels.map((level, i) => (
            <button
              key={level.level}
              onClick={() => setIntensity(level.level)}
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
          intensity === "heroic" && "border-red-600 bg-red-600/10",
          intensity === "strong" && "border-yellow-500 bg-yellow-500/10",
        )}
      >
        <span
          className={cn(
            "font-bold",
            intensity === "heroic" && "text-red-600",
            intensity === "strong" && "text-yellow-600",
          )}
        >
          {intensity === "heroic" && "⚠ "}
          {intensity === "strong" && "⚡ "}
        </span>
        {INTENSITY_DESCRIPTIONS[intensity]}
      </div>
    </div>
  );
}
