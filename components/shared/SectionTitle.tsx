import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  variant?: "dark" | "light";
  className?: string;
  align?: "left" | "center";
  badge?: {
    icon?: LucideIcon;
    label: string;
  };
}

export function SectionTitle({
  children,
  variant = "dark",
  className,
  align = "center",
  badge,
}: SectionTitleProps) {
  // Define colors based on variant
  const colors = {
    dark: {
      bg: "hsl(220, 30%, 12%)",
      text: "#62674c",
    },
    light: {
      bg: "#62674c",
      text: "hsl(220, 30%, 12%)",
    },
  };

  const currentColors = colors[variant];

  return (
    <div
      className={cn("py-16 px-4", className)}
      style={{ backgroundColor: currentColors.bg }}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto",
          align === "center" && "text-center"
        )}
      >
        {/* Badge ou Intel Label */}
        {badge ? (
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 border mb-6"
            style={{ 
              backgroundColor: `${currentColors.text}20`,
              borderColor: `${currentColors.text}40`
            }}
          >
            {badge.icon && (
              <badge.icon className="w-4 h-4" style={{ color: currentColors.text }} />
            )}
            <span 
              className="text-xs font-orbitron tracking-widest uppercase"
              style={{ color: currentColors.text }}
            >
              {badge.label}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-0.5" style={{ backgroundColor: currentColors.text }} />
            <span 
              className="text-xs font-orbitron tracking-[0.3em] uppercase"
              style={{ color: currentColors.text }}
            >
              Intel
            </span>
            <div className="w-8 h-0.5" style={{ backgroundColor: currentColors.text }} />
          </div>
        )}

        {/* Children Content */}
        <div style={{ color: currentColors.text }}>
          {children}
        </div>
      </div>
    </div>
  );
}
