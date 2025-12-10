import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CircleQuestionMark } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MAOIHoverCardProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function MAOIHoverCard({
  checked,
  onCheckedChange,
}: MAOIHoverCardProps) {
  const posthog = usePostHog();
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={checked}
        className="cursor-pointer"
        onCheckedChange={(checked) => {
          onCheckedChange(checked as boolean);
          posthog.capture("on_maoi_changed", {
            onMAOI: checked as boolean,
          });
        }}
        id="maoi-checkbox"
      />
      <Label
        htmlFor="maoi-checkbox"
        className="cursor-pointer text-sm font-semibold"
      >
        Currently on Anti-depressant
      </Label>
      <Popover>
        <PopoverTrigger>
          <CircleQuestionMark
            className="size-4"
            aria-label="Learn more about MAOI"
          />
        </PopoverTrigger>
        <PopoverContent className="bg-main text-main-foreground flex flex-col gap-2 rounded-none text-sm">
          <p>
            MAOI (Monoamine Oxidase Inhibitor) are a class of older
            antidepressant drugs that work by blocking the enzyme monoamine
            oxidase, which breaks down mood-regulating neurotransmitters like
            serotonin, dopamine, and norepinephrine, increasing their levels in
            the brain to improve mood.
          </p>
          <div className="shadow-shadow rounded-none border-2 border-red-600 bg-red-600/10 px-4 py-3 text-sm">
            <AlertTriangle className="size-4" />
            Dangerous interaction — dose halved automatically
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
