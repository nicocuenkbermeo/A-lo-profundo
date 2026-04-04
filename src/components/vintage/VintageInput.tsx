import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface VintageInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function VintageInput({ label, className, id, ...props }: VintageInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="font-[family-name:var(--font-display)] uppercase tracking-wider text-xs text-[#3D2B1F]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "bg-[#FDF6E3] border-2 border-[#8B7355] text-[#3D2B1F] px-3 py-2 text-sm",
          "placeholder:text-[#8B7355]/60",
          "focus:outline-none focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]",
          "transition-all duration-150",
          className
        )}
        {...props}
      />
    </div>
  );
}
