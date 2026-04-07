import type { Metadata } from "next";
import { Playfair_Display, Crimson_Text, JetBrains_Mono, Special_Elite } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const crimsonText = Crimson_Text({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "A lo Profundo — MLB Scores, Stats & Picks",
    template: "%s | A lo Profundo",
  },
  description: "Tu fuente de béisbol: scores en vivo, estadísticas avanzadas, picks de apuestas y sistema de rachas. Estilo vintage, datos profundos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${crimsonText.variable} ${jetbrainsMono.variable} ${specialElite.variable} dark`} suppressHydrationWarning>
      <head>
        <AdSenseScript />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased diamond-pattern">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
