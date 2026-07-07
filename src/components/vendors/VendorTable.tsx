import type { Vendor, Neighborhood } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { categoryColor } from "@/lib/utils"

type Props = {
  vendors: Vendor[]
  neighborhoods: Neighborhood[]
}

export function VendorTable({ vendors, neighborhoods }: Props) {
  const neighborhoodMap = Object.fromEntries(neighborhoods.map((n) => [n.id, n]))

  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100">
        <h2 className="text-sm font-semibold text-zinc-900">Vendors</h2>
        <p className="text-xs text-zinc-400 mt-0.5">{vendors.length} total</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Neighborhood</th>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-left">Rating</th>
              <th className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-zinc-900">{vendor.name}</td>
                <td className="px-5 py-3.5 text-zinc-500">
                  {neighborhoodMap[vendor.neighborhood_id]?.name ?? "—"}
                </td>
                <td className="px-5 py-3.5">
                  <Badge label={vendor.category} className={categoryColor(vendor.category)} />
                </td>
                <td className="px-5 py-3.5 text-zinc-700 font-medium">
                  <span className="text-amber-500">★</span> {vendor.rating.toFixed(1)}
                </td>
                <td className="px-5 py-3.5">
                  <Badge
                    label={vendor.active ? "Active" : "Inactive"}
                    className={vendor.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
