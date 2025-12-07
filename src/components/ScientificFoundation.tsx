import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";

const KEY_CITATIONS = [
  {
    authors:
      "Garcia-Romeu, A., Barrett, F. S., Carbonaro, T. M., Johnson, M. W., & Griffiths, R. R. (2021)",
    year: 2021,
    title: "Optimal dosing for psilocybin pharmacotherapy",
    link: "https://pubmed.ncbi.nlm.nih.gov/33611977/",
  },
  {
    authors: "Kolaczynska, K. E., Liechti, M. E., & Duthaler, U. (2021)",
    year: 2021,
    title: "LC-MS/MS potency analysis of psilocybin mushrooms",
    link: "https://pubmed.ncbi.nlm.nih.gov/33485158/",
  },
  {
    authors:
      "Buchborn, T., Grecksch, G., Dieterich, D. C., & Höllt, V. (2016).",
    year: 2016,
    title: "5-HT2A receptor tolerance kinetics",
    link: "https://www.sciencedirect.com/science/article/abs/pii/B9780128002124000790",
  },
];

export function ScientificFoundation() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-xl">
      <div className="text-foreground mb-2 flex items-center justify-between text-xs tracking-widest uppercase">
        <span className="text-foreground mb-2 text-xs tracking-widest uppercase">
          Scientific foundations
        </span>
        <span className="text-foreground mb-2 text-right text-xs tracking-widest uppercase">
          {`(${KEY_CITATIONS.length})`}
        </span>
      </div>

      {KEY_CITATIONS.map((citation) => (
        <AccordionItem key={citation.title} value={citation.title}>
          <AccordionTrigger>
            {citation.authors} ({citation.year})
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between">
              <p className="text-foreground text-sm">{citation.title}</p>
              <a
                href={citation.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground text-xs"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
