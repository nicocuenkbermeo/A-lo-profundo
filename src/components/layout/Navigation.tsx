"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_CATEGORIES, STANDALONE_LINKS, type NavCategory, type NavItem } from "@/lib/navigation";
import { Ticker } from "./Ticker";

// ---------------------------------------------------------------------------
// Desktop dropdown
// ---------------------------------------------------------------------------

function DesktopDropdown({ category, pathname }: { category: NavCategory; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasActive = category.items.some(
    (i) => pathname === i.href || pathname?.startsWith(i.href + "/"),
  );

  const handleEnter = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "font-display uppercase tracking-wider text-sm pb-1 border-b-2 transition-colors flex items-center gap-1",
          hasActive
            ? "text-[#F5C842] border-[#F5C842]"
            : "text-[#8FBCE6] border-transparent hover:text-[#FDF6E3]",
        )}
      >
        {category.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={cn("transition-transform", open && "rotate-180")}
        >
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-[#0D2240] border-2 border-[#8B7355] rounded-sm shadow-[4px_4px_0px_#5C4A32] min-w-[220px] py-1 z-50">
          {category.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "text-[#F5C842] bg-[#F5C842]/10"
                    : "text-[#8FBCE6] hover:text-[#FDF6E3] hover:bg-[#FDF6E3]/5",
                )}
              >
                <span className="text-base leading-none w-5 text-center">{item.icon}</span>
                <span className="font-display tracking-wider">{item.label}</span>
                {item.isNew && (
                  <span className="ml-auto font-display text-[9px] uppercase tracking-wider bg-[#C41E3A] text-white px-1.5 py-0.5 rounded-sm">
                    Nuevo
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile overlay menu
// ---------------------------------------------------------------------------

function MobileOverlay({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-[300px] max-w-[85vw] bg-[#0D2240] border-l-2 border-[#8B7355] transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#8B7355]/30">
          <Image
            src="/logo.png"
            alt="A lo Profundo"
            width={120}
            height={60}
            className="h-[40px] w-auto"
          />
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="w-12 h-12 flex items-center justify-center text-[#FDF6E3] hover:text-[#F5C842] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable links */}
        <div className="overflow-y-auto h-[calc(100%-140px)] px-4 py-4">
          {/* Home */}
          <OverlayLink
            href="/"
            icon="🏟️"
            label="Inicio"
            isActive={pathname === "/"}
            onClose={onClose}
          />

          {/* Categories */}
          {NAV_CATEGORIES.map((cat) => (
            <div key={cat.key} className="mt-5">
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[#8B7355] font-bold mb-2">
                {cat.label}
              </p>
              {cat.items.map((item) => (
                <OverlayLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isNew={item.isNew}
                  isActive={pathname === item.href || pathname?.startsWith(item.href + "/")}
                  onClose={onClose}
                />
              ))}
            </div>
          ))}

          {/* Standalone */}
          <div className="mt-5">
            {STANDALONE_LINKS.map((item) => (
              <OverlayLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isNew={item.isNew}
                isActive={pathname === item.href || pathname?.startsWith(item.href + "/")}
                onClose={onClose}
              />
            ))}
          </div>

          {/* Login */}
          <div className="mt-6">
            <Link
              href="/auth/login"
              onClick={onClose}
              className="block w-full text-center font-display uppercase tracking-wider text-sm bg-[#F5C842] text-[#3D2B1F] px-4 py-3 rounded-sm font-bold"
            >
              Entrar
            </Link>
          </div>
        </div>

        {/* Footer links */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-[#8B7355]/30 flex gap-3 text-[10px] font-display uppercase tracking-wider text-[#8B7355]">
          <Link href="/about" onClick={onClose} className="hover:text-[#FDF6E3]">Sobre Nosotros</Link>
          <Link href="/contact" onClick={onClose} className="hover:text-[#FDF6E3]">Contacto</Link>
          <Link href="/terms" onClick={onClose} className="hover:text-[#FDF6E3]">Términos</Link>
        </div>
      </div>
    </>
  );
}

function OverlayLink({
  href,
  icon,
  label,
  isNew,
  isActive,
  onClose,
}: {
  href: string;
  icon: string;
  label: string;
  isNew?: boolean;
  isActive: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 py-3 border-b border-[#8B7355]/10 transition-colors min-h-[52px]",
        isActive ? "text-[#F5C842]" : "text-[#8FBCE6] hover:text-[#FDF6E3]",
      )}
    >
      <span className="text-lg leading-none w-6 text-center shrink-0">{icon}</span>
      <span className="font-sans text-base flex-1">{label}</span>
      {isNew && (
        <span className="font-display text-[9px] uppercase tracking-wider bg-[#C41E3A] text-white px-1.5 py-0.5 rounded-sm shrink-0">
          Nuevo
        </span>
      )}
      <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#8B7355] shrink-0">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main Navigation component
// ---------------------------------------------------------------------------

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const openMenu = useCallback(() => setMobileOpen(true), []);
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  return (
    <header className="sticky top-0 z-50 bg-[#0D2240]/95 backdrop-blur-sm border-b-[3px] border-[#8B7355]">
      <div className="flex items-center justify-between px-4 py-3 gap-4 min-h-[64px] lg:min-h-[80px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo.png"
            alt="A lo Profundo"
            width={240}
            height={120}
            priority
            className="h-[48px] lg:h-[64px] w-auto drop-shadow-[3px_3px_0px_rgba(0,0,0,0.5)] shrink-0"
          />
        </Link>

        {/* Desktop nav — dropdowns */}
        <nav className="hidden lg:flex items-center gap-5">
          {NAV_CATEGORIES.map((cat) => (
            <DesktopDropdown key={cat.key} category={cat} pathname={pathname} />
          ))}
          {STANDALONE_LINKS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-display uppercase tracking-wider text-sm pb-1 border-b-2 transition-colors flex items-center gap-1",
                  isActive
                    ? "text-[#F5C842] border-[#F5C842]"
                    : "text-[#8FBCE6] border-transparent hover:text-[#FDF6E3]",
                )}
              >
                {item.label}
                {item.isNew && (
                  <span className="font-display text-[8px] uppercase tracking-wider bg-[#C41E3A] text-white px-1 py-0.5 rounded-sm">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop login + Mobile hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden lg:block font-display uppercase tracking-wider text-sm bg-[#F5C842] text-[#3D2B1F] px-4 py-1.5 rounded-sm font-bold hover:bg-[#F5C842]/90 transition-colors"
          >
            Entrar
          </Link>

          <button
            className="lg:hidden text-[#FDF6E3] p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={openMenu}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <Ticker />

      {/* Mobile overlay */}
      <MobileOverlay open={mobileOpen} onClose={closeMenu} pathname={pathname} />
    </header>
  );
}
