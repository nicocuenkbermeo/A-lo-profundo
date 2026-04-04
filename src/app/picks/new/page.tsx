import type { Metadata } from "next"
import Link from "next/link"
import { PickForm } from "@/components/picks/PickForm"

export const metadata: Metadata = {
  title: "Nuevo Pick",
  description: "Crea un nuevo pick de apuestas MLB.",
}

export default function NewPickPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-[#8B7355]">
        <Link href="/picks" className="hover:text-[#F5C842] transition-colors">
          Picks
        </Link>
        <span className="text-[#8B7355]/50">&gt;</span>
        <span className="text-[#FDF6E3]">Nuevo Pick</span>
      </nav>

      <PickForm />
    </div>
  )
}
