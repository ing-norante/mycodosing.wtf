export function Header() {
  return (
    <header className="border-foreground mb-8 w-full border-b-3 pb-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Left side - Title */}
        <div className="flex-1">
          <h1 className="mb-2 text-5xl leading-none font-black tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-primary">MYCO</span>METRIC
          </h1>
          <p className="text-lg font-medium tracking-wide sm:text-xl">
            Research-informed psychedelic dosage calculator
          </p>
          <p className="border-primary mt-2 border-l-4 pl-3 text-sm">
            Educational tool — not medical advice
          </p>
        </div>
      </div>
    </header>
  );
}
