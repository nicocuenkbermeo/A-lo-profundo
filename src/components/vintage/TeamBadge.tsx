import Image from "next/image";
import { cn } from "@/lib/utils";

interface TeamBadgeProps {
  abbreviation: string;
  primaryColor?: string;
  secondaryColor?: string;
  size?: "sm" | "default" | "lg" | "xl";
}

const sizeStyles = {
  sm: "w-8 h-8",
  default: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const sizePx = {
  sm: 32,
  default: 48,
  lg: 64,
  xl: 96,
};

export default function TeamBadge({
  abbreviation,
  size = "default",
}: TeamBadgeProps) {
  const px = sizePx[size];
  return (
    <div
      className={cn(
        "relative shrink-0 flex items-center justify-center",
        sizeStyles[size]
      )}
      title={abbreviation}
    >
      <Image
        src={`/logos/${abbreviation}.png`}
        alt={abbreviation}
        width={px}
        height={px}
        className="object-contain drop-shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
      />
    </div>
  );
}
