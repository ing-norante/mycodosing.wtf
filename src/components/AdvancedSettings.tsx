import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BodyPharmacologySection } from "./BodyPharmacologySection";
import { ToleranceSection } from "./ToleranceSection";
import { MaterialQualitySection } from "./MaterialQualitySection";

interface AdvancedSettingsProps {
  showMaterialQuality: boolean;
}

export function AdvancedSettings({
  showMaterialQuality,
}: AdvancedSettingsProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-background">
          Advanced Factors
        </AccordionTrigger>
        <AccordionContent className="bg-background">
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <BodyPharmacologySection />
              <ToleranceSection />
              {showMaterialQuality && <MaterialQualitySection />}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
