export function Footer() {
  return (
    <footer className="w-full border-t-3 border-foreground pt-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <p className="text-sm text-muted-foreground max-w-2xl">
          <span className="text-severity-warning font-bold">⚠</span>{" "}
          This tool is for{" "}
          <span className="font-bold">educational and harm-reduction purposes</span>{" "}
          only. It is not medical advice. Psychoactive substance use carries inherent
          risks and may be illegal in your jurisdiction.
        </p>
        <div className="text-xs text-muted-foreground font-mono">
          v3.0 · 2024
        </div>
      </div>
    </footer>
  );
}

