import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface TacticalCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export function TacticalCard({
  children,
  className,
  hover = true,
  style,
}: TacticalCardProps) {
  return (
    <div
      className={cn(
        "relative bg-card border border-border p-6 transition-all duration-300",
        hover && "hover:border-sand/50 hover:shadow-lg hover:shadow-sand/5",
        className
      )}
      style={style}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sand/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sand/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sand/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sand/50" />
      {children}
    </div>
  );
}
