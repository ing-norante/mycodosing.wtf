import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { InputPanel } from "./components/InputPanel";
import { ResultPanel } from "./components/ResultPanel";
import type { DosageResult } from "./lib/calculator";
import "./index.css";

function App() {
  const [result, setResult] = useState<DosageResult | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Panel */}
          <div>
            <InputPanel onResult={setResult} />
          </div>

          {/* Result Panel */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ResultPanel result={result} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
