"use client"

import { useState } from "react"
import type { Customer, Neighborhood, Subscription } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { EmptyState } from "@/components/ui/EmptyState"
import { tierColor, tierLabel } from "@/lib/utils"

type Props = {
  customers: Customer[]
  neighborhoods: Neighborhood[]
  subscriptions: Subscription[]
}

export function CustomersView({ customers, neighborhoods, subscriptions }: Props) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all")
  const [selectedTier, setSelectedTier] = useState("all")
  const [activeOnly, setActiveOnly] = useState(false)

  const neighborhoodMap = Object.fromEntries(neighborhoods.map((n) => [n.id, n]))
  const subMap = Object.fromEntries(subscriptions.map((s) => [s.customer_id, s]))

  const filtered = customers.filter((c) => {
    if (activeOnly && !c.active) return false
    if (selectedNeighborhood !== "all" && c.neighborhood_id !== selectedNeighborhood) return false
    if (selectedTier !== "all" && c.subscription_tier !== selectedTier) return false
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
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="all">All Tiers</option>
          <option value="explorer">Explorer</option>
          <option value="regular">Regular</option>
          <option value="connoisseur">Connoisseur</option>
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

        <span className="text-xs text-zinc-400 ml-auto">{filtered.length} customer{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Neighborhood</th>
                <th className="px-5 py-3 text-left">Tier</th>
                <th className="px-5 py-3 text-left">Frequency</th>
                <th className="px-5 py-3 text-left">Sub Status</th>
                <th className="px-5 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((customer) => {
                const sub = subMap[customer.id]
                return (
                  <tr key={customer.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-medium text-zinc-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 text-xs">{customer.email}</td>
                    <td className="px-5 py-3.5 text-zinc-500">
                      {neighborhoodMap[customer.neighborhood_id]?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge label={tierLabel(customer.subscription_tier)} className={tierColor(customer.subscription_tier)} />
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 capitalize">{sub?.frequency ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      {sub ? (
                        <Badge
                          label={sub.status}
                          className={
                            sub.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : sub.status === "paused"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-zinc-100 text-zinc-500"
                          }
                        />
                      ) : (
                        <span className="text-zinc-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 text-xs">{customer.joined_at}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <EmptyState title="No customers found" message="No customers match the current filters. Try adjusting or clearing them." />
        )}
      </div>
    </div>
  )
}
