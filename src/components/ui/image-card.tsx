import { cn } from "@/lib/utils";

type Props = {
  imageUrl: string;
  caption: string;
  className?: string;
};

export default function ImageCard({ imageUrl, caption, className }: Props) {
  return (
    <figure
      className={cn(
        "rounded-base border-border bg-main font-base shadow-shadow w-full overflow-hidden border-2",
        className,
      )}
    >
      <img className="aspect-square w-full" src={imageUrl} alt={caption} />
      <figcaption className="text-main-foreground border-border border-t-2 p-4">
        {caption}
      </figcaption>
    </figure>
  );
}
