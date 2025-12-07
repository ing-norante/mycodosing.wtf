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
    <div className="bg-background prose-h4:xl:text-2xl prose-h4:lg:text-xl prose-h4:text-lg min-h-dvh bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-size-[70px_70px] px-2 lg:px-5 lg:pt-[70px]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        <main className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Input Panel */}

          <InputPanel onResult={setResult} />

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
