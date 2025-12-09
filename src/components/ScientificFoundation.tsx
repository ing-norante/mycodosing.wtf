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

interface CitationWithLink {
  authors: string;
  year: number;
  title: string;
  link: string;
  relevance?: string;
}

interface CitationsListProps {
  citations: CitationWithLink[];
  title?: string;
  className?: string;
}

export function CitationsList({
  citations,
  title = "References",
  className = "w-full max-w-xl",
}: CitationsListProps) {
  if (citations.length === 0) return null;

  return (
    <Accordion type="single" collapsible className={className}>
      <div className="text-foreground mb-2 flex items-center justify-between text-xs tracking-widest uppercase">
        <span className="text-foreground mb-2 text-xs tracking-widest uppercase">
          {title}
        </span>
        <span className="text-foreground mb-2 text-right text-xs tracking-widest uppercase">
          {`(${citations.length})`}
        </span>
      </div>

      {citations.map((citation, index) => (
        <AccordionItem
          key={`${citation.title}-${index}`}
          value={citation.title}
        >
          <AccordionTrigger className="cursor-pointer">
            {citation.authors} ({citation.year})
          </AccordionTrigger>
          <AccordionContent className="bg-background">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-foreground text-sm">{citation.title}</p>
                {citation.link && (
                  <a
                    href={citation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground text-xs"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              {citation.relevance && (
                <p className="border-border mt-1 border-l-2 pl-4 text-xs">
                  Relevance: {citation.relevance}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ScientificFoundation() {
  return (
    <CitationsList citations={KEY_CITATIONS} title="Scientific foundations" />
  );
}
