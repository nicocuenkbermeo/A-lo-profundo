import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface VintageCardProps {
  children: ReactNode;
  className?: string;
  variant?: "cream" | "navy" | "red";
  withCorners?: boolean;
  withShadow?: boolean;
}

const variantStyles = {
  cream: "bg-[#FDF6E3] text-[#3D2B1F] border-[#8B7355]",
  navy: "bg-[#0D2240] text-[#FDF6E3] border-[#8B7355]",
  red: "bg-[#C41E3A] text-[#FDF6E3] border-[#8B7355]",
};

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const base = "absolute w-4 h-4 pointer-events-none";
  const posMap = {
    tl: "top-2 left-2 border-t-2 border-l-2",
    tr: "top-2 right-2 border-t-2 border-r-2",
    bl: "bottom-2 left-2 border-b-2 border-l-2",
    br: "bottom-2 right-2 border-b-2 border-r-2",
  };
  return <div className={cn(base, posMap[position], "border-[#8B7355]")} />;
}

export default function VintageCard({
  children,
  className,
  variant = "cream",
  withCorners = true,
  withShadow = true,
}: VintageCardProps) {
  return (
    <div
      className={cn(
        "relative border-[3px] p-6 transition-all duration-200",
        variantStyles[variant],
        withShadow && "shadow-[4px_4px_0px_#5C4A32] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#5C4A32]",
        "bg-gradient-to-br from-transparent via-[rgba(139,115,85,0.03)] to-transparent",
        className
      )}
    >
      {withCorners && (
        <>
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
