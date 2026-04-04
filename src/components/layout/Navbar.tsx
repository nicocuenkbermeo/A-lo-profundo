"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const navLinks = [
  { href: "/scores", label: "Scores" },
  { href: "/estadisticas", label: "Estadisticas" },
  { href: "/picks", label: "Picks" },
  { href: "/rachas", label: "Rachas" },
  { href: "/tendencias", label: "Tendencias" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden lg:block border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-2xl">&#9918;</span>
          <span className="text-lg font-bold tracking-tight text-primary">
            A LO PROFUNDO
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <Button variant="outline" size="sm" className="gap-2">
          <LogIn className="h-4 w-4" />
          Iniciar sesion
        </Button>
      </div>
    </header>
  );
}
