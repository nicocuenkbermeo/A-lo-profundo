"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface StatsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
}

export function StatsTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Buscar...",
}: StatsTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize: 10 } },
  })

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="relative max-w-sm">
          <input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
            className="w-full bg-[#FDF6E3] border-2 border-[#8B7355] text-[#3D2B1F] placeholder-[#8B7355]/60 font-[family-name:var(--font-sans)] text-sm px-4 py-2.5 rounded-sm shadow-[2px_2px_0px_#5C4A32] focus:outline-none focus:border-[#0D2240] transition-colors"
          />
        </div>
      )}

      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[#0D2240]">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "text-[#F5C842] font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-3 py-3 text-left border-b-2 border-[#8B7355] whitespace-nowrap",
                        header.column.getCanSort() && "cursor-pointer select-none hover:text-white transition-colors"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-[#F5C842]/50 text-[10px]">
                            {header.column.getIsSorted() === "asc"
                              ? "▲"
                              : header.column.getIsSorted() === "desc"
                                ? "▼"
                                : "▲▼"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition-colors hover:bg-[#EDD9B3] border-b border-[#8B7355]/20",
                      idx % 2 === 0 ? "bg-[#FDF6E3]" : "bg-[#F5E6C8]"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="text-[#3D2B1F] text-sm px-3 py-2.5 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center text-[#8B7355] font-[family-name:var(--font-display)] text-sm">
                    Sin resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#0D2240] border-t-2 border-[#8B7355]">
            <span className="text-[#FDF6E3]/60 text-xs font-[family-name:var(--font-display)]">
              Pag. {currentPage + 1} de {pageCount}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-2.5 py-1 text-xs font-[family-name:var(--font-mono)] bg-[#0D2240] text-[#F5C842] border border-[#F5C842]/30 rounded-sm hover:bg-[#F5C842] hover:text-[#0D2240] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#F5C842] transition-colors"
              >
                « Ant.
              </button>
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                let pageIdx = i
                if (pageCount > 5) {
                  const start = Math.max(0, Math.min(currentPage - 2, pageCount - 5))
                  pageIdx = start + i
                }
                return (
                  <button
                    key={pageIdx}
                    onClick={() => table.setPageIndex(pageIdx)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-[family-name:var(--font-mono)] border rounded-sm transition-colors",
                      pageIdx === currentPage
                        ? "bg-[#F5C842] text-[#0D2240] border-[#F5C842] font-bold"
                        : "bg-[#0D2240] text-[#F5C842] border-[#F5C842]/30 hover:bg-[#F5C842]/20"
                    )}
                  >
                    {pageIdx + 1}
                  </button>
                )
              })}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-2.5 py-1 text-xs font-[family-name:var(--font-mono)] bg-[#0D2240] text-[#F5C842] border border-[#F5C842]/30 rounded-sm hover:bg-[#F5C842] hover:text-[#0D2240] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#F5C842] transition-colors"
              >
                Sig. »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
