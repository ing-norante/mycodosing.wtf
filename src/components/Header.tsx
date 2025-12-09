import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { HowItWorks } from "@/components/HowItWorks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePostHog } from "posthog-js/react";
import { TriangleAlert } from "lucide-react";

export function Header() {
  const posthog = usePostHog();
  return (
    <header className="border-foreground mb-8 w-full border-b-3 pb-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Left side - Title */}
        <div className="flex-1">
          <h1 className="mb-2 text-4xl leading-none font-black tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-main">MYCO</span>DOSING.
            <span className="text-main">WTF</span>
          </h1>
          <p className="text-lg font-medium tracking-wide sm:text-xl">
            Research-informed psychedelic dosage calculator
          </p>
          <div className="border-main mt-2 border-l-4 pl-3 text-sm">
            <p className="text-base font-medium tracking-wide">
              <TriangleAlert className="inline-block size-4" /> This tool is for{" "}
              <span className="text-main font-bold">educational purposes</span>{" "}
              only. It is not medical advice. Psychoactive substance use carries
              inherent risks and may be illegal in your jurisdiction.
            </p>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild className="cursor-pointer">
            <Button
              onClick={() =>
                posthog.capture("how_it_works_button_clicked", {
                  how_it_works_button_clicked: "how_it_works_button_clicked",
                })
              }
            >
              How It Works
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>How It Works</SheetTitle>
            </SheetHeader>
            <ScrollArea>
              <HowItWorks />
            </ScrollArea>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="neutral">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
