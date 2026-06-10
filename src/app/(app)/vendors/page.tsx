import { vendors, neighborhoods } from "@/data/mock"
import { VendorsView } from "@/components/vendors/VendorsView"

export default function VendorsPage() {
  const activeCount = vendors.filter((v) => v.active).length
  const categories = new Set(vendors.map((v) => v.category)).size

  return (
    <div className="px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Vendors</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {activeCount} active · {vendors.length - activeCount} inactive · {categories} categories · {neighborhoods.length} neighborhoods
        </p>
      </div>

      <VendorsView vendors={vendors} neighborhoods={neighborhoods} />
    </div>
  )
}
