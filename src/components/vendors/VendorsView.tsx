"use client"

import { useState } from "react"
import type { Vendor, Neighborhood } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { categoryColor } from "@/lib/utils"

type Props = {
  vendors: Vendor[]
  neighborhoods: Neighborhood[]
}

export function VendorsView({ vendors, neighborhoods }: Props) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeOnly, setActiveOnly] = useState(false)

  const neighborhoodMap = Object.fromEntries(neighborhoods.map((n) => [n.id, n]))
  const categories = Array.from(new Set(vendors.map((v) => v.category))).sort()

  const filtered = vendors.filter((v) => {
    if (activeOnly && !v.active) return false
    if (selectedNeighborhood !== "all" && v.neighborhood_id !== selectedNeighborhood) return false
    if (selectedCategory !== "all" && v.category !== selectedCategory) return false
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={selectedNeighborhood}
          onChange={(e) => setSelectedNeighborhood(e.target.value)}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="all">All Neighborhoods</option>
          {neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="rounded border-zinc-300 text-amber-500 focus:ring-amber-400"
          />
          Active only
        </label>

        <span className="text-xs text-zinc-400 ml-auto">{filtered.length} vendor{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 flex flex-col gap-3 hover:border-zinc-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-zinc-900 text-sm leading-snug">{vendor.name}</h3>
              <Badge
                label={vendor.active ? "Active" : "Inactive"}
                className={vendor.active ? "bg-emerald-100 text-emerald-700 shrink-0" : "bg-zinc-100 text-zinc-500 shrink-0"}
              />
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">{vendor.description}</p>

            <div className="flex items-center gap-2 flex-wrap mt-auto pt-2 border-t border-zinc-50">
              <Badge label={vendor.category} className={categoryColor(vendor.category)} />
              <span className="text-xs text-zinc-400">
                {neighborhoodMap[vendor.neighborhood_id]?.name}
              </span>
              <span className="ml-auto text-xs font-semibold text-amber-500">
                ★ {vendor.rating.toFixed(1)}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-zinc-400 text-sm">
            No vendors match the current filters.
          </div>
        )}
      </div>
    </div>
  )
}
