import { TriangleAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-foreground mt-8 w-full border-t-3 pt-6">
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
    </footer>
  );
}
