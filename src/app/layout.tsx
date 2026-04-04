import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "A lo Profundo — MLB Scores, Stats & Picks",
    template: "%s | A lo Profundo",
  },
  description:
    "Plataforma de beisbol con scores en vivo, estadisticas avanzadas, picks de apuestas y sistema de rachas.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
