import { cn } from "@/lib/utils";
import { LazyImage } from "./lazy-image";

interface LazyImageCardProps {
  /** Async function that returns the image URL */
  loader: () => Promise<string>;
  /** Caption text displayed below the image */
  caption: string;
  /** Additional CSS classes */
  className?: string;
  /** Key to trigger reload when changed (e.g., species + form) */
  loadKey?: string;
}

/**
 * ImageCard with lazy-loaded image support.
 * Shows a skeleton while loading, then fades in the image.
 */
export function LazyImageCard({
  loader,
  caption,
  className,
  loadKey,
}: LazyImageCardProps) {
  return (
    <figure
      className={cn(
        "rounded-base border-border bg-main font-base shadow-shadow w-full overflow-hidden border-2",
        className,
      )}
    >
      <LazyImage
        loader={loader}
        alt={caption}
        loadKey={loadKey}
        className="aspect-square w-full"
      />
      <figcaption className="text-main-foreground border-border border-t-2 p-4">
        {caption}
      </figcaption>
    </figure>
  );
}
