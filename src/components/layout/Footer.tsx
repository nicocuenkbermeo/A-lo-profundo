import Link from "next/link";

export function Footer() {
  return (
    <footer className="hidden lg:block border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} A lo Profundo. Todos los derechos
          reservados.
        </p>
        <nav className="flex items-center gap-6">
          <Link
            href="/sobre-nosotros"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sobre nosotros
          </Link>
          <Link
            href="/terminos"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terminos
          </Link>
          <Link
            href="/contacto"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </footer>
  );
}
