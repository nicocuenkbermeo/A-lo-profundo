import type { Metadata } from "next"
import Link from "next/link"
import { PickForm } from "@/components/picks/PickForm"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Nuevo Pick",
  description: "Crea un nuevo pick de apuestas MLB.",
}

export default function NewPickPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/picks" className="hover:text-foreground transition-colors">
          Picks
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Nuevo Pick</span>
      </nav>

      <PickForm />
    </div>
  )
}
