import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
}: SectionTitleProps) {
  return (
    <div
      className={cn("mb-12", align === "center" && "text-center", className)}
    >
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-8 h-0.5 bg-sand" />
        <span className="text-xs font-orbitron tracking-[0.3em] text-sand uppercase">
          Intel
        </span>
        <div className="w-8 h-0.5 bg-sand" />
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-foreground mb-4 tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
