// Simple styles for the Neobrutalist look
const styles = {
  container: "max-w-4xl mx-auto p-6 font-sans text-black",
  header: "mb-12 border-b-4 border-black pb-6",
  title: "text-5xl font-black uppercase tracking-tighter mb-4",
  subtitle: "text-xl font-medium text-gray-700 leading-relaxed",
  section: "mb-12",
  sectionTitle:
    "text-2xl font-bold uppercase bg-black text-white inline-block px-2 py-1 mb-4",
  card: "border-2 border-black p-6 mb-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
  formula:
    "font-mono text-lg md:text-xl bg-gray-100 p-4 border border-black my-4 text-center font-bold",
  list: "list-disc list-inside space-y-2 ml-4",
  highlight: "bg-yellow-300 px-1 font-bold",
};

export const HowItWorks = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>The Algorithm</h1>
        <p className={styles.subtitle}>
          MycoDosing.WTF moves beyond simple "gram-counting." We calculate
          dosages based on pharmacology, total alkaloid content, and biological
          decay rates. Here is exactly how your number is generated.
        </p>
      </header>

      {/* THE CORE LOGIC */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Master Formula</h2>
        <div className={styles.card}>
          <p>At its heart, the calculator solves one specific equation:</p>
          <div className={styles.formula}>
            (Target Intensity Mg × Biological Factors) ÷ Material Potency = Your
            Dose
          </div>
          <p className="mt-4">
            We don't just guess grams. We determine how many milligrams of
            active compound you need for a specific effect, then calculate how
            much material is required to reach that number.
          </p>
        </div>
      </section>

      {/* STEP 1: INTENSITY */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Step 1: The Target</h2>
        <div className={styles.card}>
          <p className="mb-4">
            We convert subjective intensity (e.g., "Strong") into a specific
            milligram target of <strong>Psilocybin-Equivalent</strong>.
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Microdose:</strong> 1-3 mg
            </li>
            <li>
              <strong>Threshold:</strong> 3-6 mg
            </li>
            <li>
              <strong>Light:</strong> 6-12 mg
            </li>
            <li>
              <strong>Moderate:</strong> 12-20 mg
            </li>
            <li>
              <strong>Strong:</strong> 20-30 mg (Based on Johns Hopkins &
              COMPASS trials)
            </li>
            <li>
              <strong>Heroic:</strong> 35-50 mg
            </li>
          </ul>
        </div>
      </section>

      {/* STEP 2: CHEMISTRY */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Step 2: The Material</h2>
        <div className={styles.card}>
          <h3 className="mb-2 text-lg font-bold">Total Alkaloid Calculation</h3>
          <p className="mb-4">
            Not all mushrooms are the same. We calculate the "Effective Potency"
            of your specific species using this weighted formula:
          </p>
          <div className="mb-4 border-l-4 border-black bg-gray-100 p-3 font-mono text-sm">
            Potency = Psilocybin + (Psilocin × 1.4) + (Baeocystin × 0.5)
          </div>
          <p>
            <em>Why?</em> Psilocin is chemically lighter and faster-acting than
            Psilocybin, making it approx. 1.4x more potent by weight.
          </p>

          <h3 className="mt-6 mb-2 text-lg font-bold">Degradation Factors</h3>
          <p>
            We then subtract potency based on your storage method. Poor drying
            (e.g., oven) can destroy up to 30% of active compounds instantly.
          </p>
        </div>
      </section>

      {/* STEP 3: BIOLOGY */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Step 3: Biological Adjustments</h2>
        <div className={styles.card}>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-bold">Weight Adjustment</h3>
              <p className="text-sm">
                <strong>Default: Off.</strong> Clinical data (Garcia-Romeu et
                al., 2021) suggests body weight has minimal impact on intensity
                for adults between 49-113kg. If enabled, we clamp the adjustment
                to avoid dangerous overdoses for heavier users.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold">Tolerance Modeling</h3>
              <p className="text-sm">
                We use an <strong>exponential decay model</strong> based on the
                half-life of 5-HT2A receptor downregulation (~2.8 days).
                Tolerance is calculated based on both{" "}
                <em>time since last dose</em> and the{" "}
                <em>strength of that dose</em>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 4: UNCERTAINTY */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why the Range?</h2>
        <div className="border-2 border-black bg-black p-6 text-white shadow-[8px_8px_0px_0px_#22c55e]">
          <h3 className="mb-2 text-xl font-bold text-[#22c55e]">
            Nature is Chaotic
          </h3>
          <p className="mb-4">
            Even within the same grow kit, two mushrooms can vary in potency. We
            apply an{" "}
            <span className="font-bold text-[#22c55e]">Uncertainty Factor</span>{" "}
            unique to each species.
          </p>
          <ul className="list-inside list-disc space-y-1 text-gray-300">
            <li>
              <strong>P. Cubensis:</strong> High variance (±40%)
            </li>
            <li>
              <strong>Sclerotia:</strong> Low variance (±25%)
            </li>
            <li>
              <strong>Synthetics (4-AcO):</strong> Minimal variance (±15%)
            </li>
          </ul>
          <p className="mt-4 font-medium text-[#22c55e]">
            This is why we provide a Min, Median, and Max. Always start with the
            Minimum.
          </p>
        </div>
      </section>

      <footer className="border-foreground/80 text-foreground/80 mt-12 border-t pt-6 text-sm">
        <p>
          Based on research by Garcia-Romeu et al. (2021), Gotvaldová et al.
          (2021), and Buchborn et al. (2016).
        </p>
      </footer>
    </div>
  );
};
