import type { Neighborhood, Customer, Vendor, NeighborhoodMetrics } from "@/types"
import { formatCurrency } from "@/lib/utils"

type Props = {
  neighborhoods: Neighborhood[]
  customers: Customer[]
  vendors: Vendor[]
  metrics: NeighborhoodMetrics[]
}

export function NeighborhoodTable({ neighborhoods, customers, vendors, metrics }: Props) {
  const rows = neighborhoods.map((nbh) => {
    const activeCustomers = customers.filter((c) => c.neighborhood_id === nbh.id && c.active).length
    const activeVendors = vendors.filter((v) => v.neighborhood_id === nbh.id && v.active).length
    const latestMetric = metrics
      .filter((m) => m.neighborhood_id === nbh.id)
      .sort((a, b) => b.week.localeCompare(a.week))[0]

    return {
      id: nbh.id,
      name: nbh.name,
      borough: nbh.borough,
      activeCustomers,
      activeVendors,
      weeklyRevenue: latestMetric?.revenue ?? 0,
      avgRating: latestMetric?.avg_box_rating ?? null,
    }
  })

  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100">
        <h2 className="text-sm font-semibold text-zinc-900">Neighborhoods</h2>
        <p className="text-xs text-zinc-400 mt-0.5">{neighborhoods.length} active zones</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <th className="px-5 py-3 text-left">Neighborhood</th>
            <th className="px-5 py-3 text-left">Borough</th>
            <th className="px-5 py-3 text-right">Customers</th>
            <th className="px-5 py-3 text-right">Vendors</th>
            <th className="px-5 py-3 text-right">Weekly Revenue</th>
            <th className="px-5 py-3 text-right">Avg Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
              <td className="px-5 py-3.5 font-medium text-zinc-900">{row.name}</td>
              <td className="px-5 py-3.5 text-zinc-500">{row.borough}</td>
              <td className="px-5 py-3.5 text-right text-zinc-700">{row.activeCustomers}</td>
              <td className="px-5 py-3.5 text-right text-zinc-700">{row.activeVendors}</td>
              <td className="px-5 py-3.5 text-right font-medium text-zinc-900">
                {formatCurrency(row.weeklyRevenue)}
              </td>
              <td className="px-5 py-3.5 text-right">
                {row.avgRating !== null ? (
                  <span className="text-amber-500 font-medium">★ {row.avgRating.toFixed(1)}</span>
                ) : (
                  <span className="text-zinc-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
