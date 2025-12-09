import { Button } from "@/components/ui/button";
import type { MaterialForm } from "@/lib/calculator";
import { cn } from "@/lib/utils";
import freshImage from "@/assets/fresh.png";
import driedImage from "@/assets/dried.png";
import { LazyImage } from "@/components/ui/lazy-image";
import { usePostHog } from "posthog-js/react";

interface FormSelectorProps {
  value: MaterialForm;
  onChange: (form: MaterialForm) => void;
}

export function FormSelector({ value, onChange }: FormSelectorProps) {
  const posthog = usePostHog();
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          onChange("dried");
          posthog.capture("form_changed", { form: "dried" });
        }}
        className={cn(
          "flex-1 cursor-pointer font-semibold transition-colors",
          value !== "dried" && "bg-transparent",
        )}
      >
        <LazyImage
          loader={() => Promise.resolve(driedImage)}
          alt="Dried form"
          className="size-5"
          loadKey="dried"
        />
        DRIED
      </Button>
      <Button
        onClick={() => {
          onChange("fresh");
          posthog.capture("form_changed", { form: "fresh" });
        }}
        className={cn(
          "flex-1 cursor-pointer font-semibold transition-colors",
          value !== "fresh" && "bg-transparent",
        )}
      >
        <LazyImage
          loader={() => Promise.resolve(freshImage)}
          alt="Fresh form"
          className="size-5"
          loadKey="fresh"
        />
        FRESH
      </Button>
    </div>
  );
}
