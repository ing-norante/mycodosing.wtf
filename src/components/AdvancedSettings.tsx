import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToleranceSection } from "@/components/ToleranceSection";
import { MaterialQualitySection } from "@/components/MaterialQualitySection";
import { usePostHog } from "posthog-js/react";

interface AdvancedSettingsProps {
  showMaterialQuality: boolean;
}

export function AdvancedSettings({
  showMaterialQuality,
}: AdvancedSettingsProps) {
  const posthog = usePostHog();

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger
          className="bg-background cursor-pointer"
          onClick={() =>
            posthog.capture("advanced_settings_accordion_opened", {
              value: "advanced_settings",
            })
          }
        >
          Advanced Factors
        </AccordionTrigger>
        <AccordionContent className="bg-background">
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {showMaterialQuality && <MaterialQualitySection />}
            </div>
            <ToleranceSection />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
