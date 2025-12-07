import { ScientificFoundation } from "@/components/ScientificFoundation";
export function Footer() {
  return (
    <footer className="border-foreground mt-8 w-full border-t-3 pt-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-muted-foreground max-w-2xl text-sm">
          <span className="text-severity-warning font-bold">⚠</span> This tool
          is for{" "}
          <span className="font-bold">
            educational and harm-reduction purposes
          </span>{" "}
          only. It is not medical advice. Psychoactive substance use carries
          inherent risks and may be illegal in your jurisdiction.
        </p>
        <div className="w-full lg:max-w-sm">
          <ScientificFoundation />
        </div>
      </div>
    </footer>
  );
}
