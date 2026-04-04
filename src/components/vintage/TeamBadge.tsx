import { cn } from "@/lib/utils";

interface TeamBadgeProps {
  abbreviation: string;
  primaryColor: string;
  secondaryColor: string;
  size?: "sm" | "default" | "lg";
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  default: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

export default function TeamBadge({
  abbreviation,
  primaryColor,
  secondaryColor,
  size = "default",
}: TeamBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white shrink-0",
        "bg-gradient-to-b from-white/20 via-transparent to-black/20",
        "shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2)]",
        sizeStyles[size]
      )}
      style={{
        backgroundColor: primaryColor,
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: secondaryColor,
      }}
    >
      {abbreviation}
    </div>
  );
}
