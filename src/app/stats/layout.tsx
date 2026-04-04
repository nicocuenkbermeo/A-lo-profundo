export default function StatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Vintage header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-[#F5C842] text-3xl font-bold tracking-tight">
          ESTADISTICAS
        </h1>
        <div className="mt-1 h-1 w-24 bg-[#C41E3A] rounded-full" />
      </div>
      {children}
    </div>
  )
}
