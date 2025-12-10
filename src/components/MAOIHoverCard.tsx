import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePostHog } from "posthog-js/react";
import { CircleQuestionMark } from "lucide-react";

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
      <HoverCard openDelay={0} closeDelay={100}>
        <HoverCardTrigger asChild className="cursor-pointer">
          <button
            type="button"
            className="focus-visible:ring-ring inline text-sm underline hover:no-underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-label="Learn more about MAOI"
          >
            <CircleQuestionMark className="size-4" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col gap-2 text-sm">
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
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
