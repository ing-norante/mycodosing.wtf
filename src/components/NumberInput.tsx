import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePostHog } from "posthog-js/react";

interface NumberInputProps {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  min = 0,
}: NumberInputProps) {
  const posthog = usePostHog();
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block text-xs font-semibold">
        {label}
      </Label>
      <Input
        type="number"
        id={id}
        placeholder={placeholder}
        min={min}
        className="border-foreground bg-input w-full border-3 px-3 py-2 font-mono"
        value={value ?? ""}
        onChange={(e) => {
          onChange(e.target.value ? Number(e.target.value) : undefined);
          posthog.capture("number_input_changed", {
            id,
            value: e.target.value ? Number(e.target.value) : undefined,
          });
        }}
      />
    </div>
  );
}
