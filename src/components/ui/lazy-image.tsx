import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  /** Async function that returns the image URL */
  loader: () => Promise<string>;
  /** Alt text for the image */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Key to trigger reload when changed */
  loadKey?: string;
}

/**
 * LazyImage component that loads images dynamically using a loader function.
 * Shows a skeleton placeholder while loading with a fade-in transition.
 */
export function LazyImage({ loader, alt, className, loadKey }: LazyImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const currentKeyRef = useRef<string | undefined>(loadKey);
  const hasLoadedRef = useRef(false);

  // Trigger load on mount and key change
  useEffect(() => {
    // Skip if already loaded for this key
    if (currentKeyRef.current === loadKey && hasLoadedRef.current) {
      return;
    }

    currentKeyRef.current = loadKey;
    hasLoadedRef.current = true;

    // Use setTimeout to defer state updates and avoid synchronous setState in effect
    const timeoutId = setTimeout(() => {
      setIsLoading(true);
      setError(false);
    }, 0);

    // Load the image asynchronously
    loader()
      .then((url) => {
        // Only update if the key hasn't changed during loading
        if (currentKeyRef.current === loadKey) {
          setImageUrl(url);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (currentKeyRef.current === loadKey) {
          setError(true);
          setIsLoading(false);
        }
      });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [loadKey, loader]);

  if (error) {
    return (
      <div
        className={cn(
          "bg-secondary-background/20 text-muted-foreground flex items-center justify-center",
          className,
        )}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Skeleton placeholder */}
      {isLoading && (
        <div
          className={cn(
            "bg-secondary-background/30 absolute inset-0 animate-pulse",
            className,
          )}
        />
      )}

      {/* Actual image with fade-in */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
          )}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
}
