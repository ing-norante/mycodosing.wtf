interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h3 className="text-muted-foreground border-border border-b pb-2 text-xs tracking-widest uppercase">
      {title}
    </h3>
  );
}
