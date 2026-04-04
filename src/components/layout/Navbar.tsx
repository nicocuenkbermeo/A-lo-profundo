"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Ticker } from "./Ticker";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/scores", label: "Scores" },
  { href: "/stats", label: "Estadísticas" },
  { href: "/picks", label: "Picks" },
  { href: "/rachas", label: "Rachas" },
  { href: "/trends", label: "Tendencias" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5">
      <span className="text-xl">⚾</span>
      <span className="font-heading text-[#F5C842] text-xl font-bold tracking-tight">
        A LO
      </span>
      <span className="font-heading text-[#C41E3A] text-xl font-bold italic -ml-0.5">
        PROFUNDO
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0D2240] border-b-[3px] border-[#8B7355]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Logo />

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-display uppercase tracking-wider text-sm pb-1 border-b-2 transition-colors",
                    isActive
                      ? "text-[#F5C842] border-[#F5C842]"
                      : "text-[#8FBCE6] border-transparent hover:text-[#FDF6E3]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden lg:block font-display uppercase tracking-wider text-sm bg-[#F5C842] text-[#3D2B1F] px-4 py-1.5 rounded-sm font-bold hover:bg-[#F5C842]/90 transition-colors"
            >
              Entrar
            </Link>

            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger
                  className="lg:hidden text-[#FDF6E3] p-1"
                  aria-label="Abrir menú"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0D2240] border-l-2 border-[#8B7355] w-64 p-0">
                <div className="flex flex-col pt-12 px-6 gap-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "font-display uppercase tracking-wider text-sm py-3 border-b border-[#8B7355]/30 transition-colors",
                          isActive ? "text-[#F5C842]" : "text-[#8FBCE6] hover:text-[#FDF6E3]"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <Link
                    href="/login"
                    className="mt-4 font-display uppercase tracking-wider text-sm bg-[#F5C842] text-[#3D2B1F] px-4 py-2 rounded-sm font-bold text-center"
                  >
                    Entrar
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Ticker below navbar */}
        <Ticker />
      </header>
    </>
  );
}
