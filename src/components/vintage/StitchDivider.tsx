import { cn } from "@/lib/utils";

interface StitchDividerProps {
  className?: string;
}

export default function StitchDivider({ className }: StitchDividerProps) {
  return (
    <div className={cn("w-full h-5 flex items-center justify-center overflow-hidden", className)}>
      <svg
        viewBox="0 0 400 20"
        className="w-full h-5"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,10 Q10,2 20,10 Q30,18 40,10 Q50,2 60,10 Q70,18 80,10 Q90,2 100,10 Q110,18 120,10 Q130,2 140,10 Q150,18 160,10 Q170,2 180,10 Q190,18 200,10 Q210,2 220,10 Q230,18 240,10 Q250,2 260,10 Q270,18 280,10 Q290,2 300,10 Q310,18 320,10 Q330,2 340,10 Q350,18 360,10 Q370,2 380,10 Q390,18 400,10"
          fill="none"
          stroke="#C41E3A"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
