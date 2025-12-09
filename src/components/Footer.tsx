import { TriangleAlert, Sun, Moon, Monitor } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme, type ColorTheme, type Mode } from "@/hooks/useTheme";

const COLOR_THEMES: { value: ColorTheme; label: string; color: string }[] = [
  { value: "teal", label: "Teal", color: "#00d6bd" },
  { value: "purple", label: "Purple", color: "#ca7aff" },
  { value: "yellow", label: "Yellow", color: "#facc00" },
  { value: "lime", label: "Lime", color: "#8ae500" },
];

const MODES: { value: Mode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function Footer() {
  const { colorTheme, mode, setColorTheme, setMode } = useTheme();

  return (
    <footer className="border-foreground mt-8 flex w-full flex-col items-start justify-between gap-4 border-t-3 pt-6 sm:flex-row sm:items-center">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-base font-medium tracking-wide">
          <TriangleAlert className="inline-block size-4" /> This tool is for{" "}
          <span className="text-main font-bold">
            educational and harm-reduction purposes
          </span>{" "}
          only. It is not medical advice. Psychoactive substance use carries
          inherent risks and may be illegal in your jurisdiction.
        </p>
      </div>
      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
        {/* Color Theme Selector */}
        <Select
          value={colorTheme}
          onValueChange={(v) => setColorTheme(v as ColorTheme)}
        >
          <SelectTrigger className="w-full sm:w-[130px]">
            {/* <Palette className="mr-2 size-4" /> */}
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Color Theme</SelectLabel>
              {COLOR_THEMES.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  <span className="flex items-center gap-2">
                    <span
                      className="border-foreground/20 inline-block size-3 rounded-full border"
                      style={{
                        backgroundColor: theme.color,
                        borderColor: `var(--background)`,
                      }}
                    />
                    {theme.label}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Mode Selector */}
        <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Appearance</SelectLabel>
              {MODES.map((m) => {
                const Icon = m.icon;
                return (
                  <SelectItem key={m.value} value={m.value}>
                    <span className="flex items-center gap-2">
                      <Icon className="size-4" />
                      {m.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </footer>
  );
}
