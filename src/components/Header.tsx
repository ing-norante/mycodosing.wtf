import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const KEY_CITATIONS = [
  {
    authors: "Garcia-Romeu et al.",
    year: 2021,
    title: "Optimal dosing for psilocybin pharmacotherapy",
  },
  {
    authors: "Gotvaldová et al.",
    year: 2021,
    title: "LC-MS/MS potency analysis of psilocybin mushrooms",
  },
  {
    authors: "Buchborn et al.",
    year: 2016,
    title: "5-HT2A receptor tolerance kinetics",
  },
];

export function Header() {
  const [showCitations, setShowCitations] = useState(false);

  return (
    <header className="w-full border-b-3 border-foreground pb-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        {/* Left side - Title */}
        <div className="flex-1">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-2">
            <span className="text-primary">MYCO</span>METRIC
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium tracking-wide">
            Research-informed psychedelic dosage calculator
          </p>
          <p className="text-sm text-muted-foreground mt-2 border-l-4 border-primary pl-3">
            Educational tool — not medical advice
          </p>
        </div>

        {/* Right side - Citations box */}
        <div className="lg:max-w-sm w-full">
          <button
            onClick={() => setShowCitations(!showCitations)}
            className="w-full brutalist-card flex items-center justify-between gap-2 hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="text-left">
              <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">
                About the model
              </span>
              <span className="font-bold">Scientific foundations</span>
            </div>
            {showCitations ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {showCitations && (
            <div className="brutalist-card border-t-0 space-y-3">
              {KEY_CITATIONS.map((cite, i) => (
                <div key={i} className="text-sm">
                  <span className="font-bold text-primary">
                    {cite.authors} ({cite.year})
                  </span>
                  <br />
                  <span className="text-muted-foreground">{cite.title}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                Full citations included in calculation results
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

