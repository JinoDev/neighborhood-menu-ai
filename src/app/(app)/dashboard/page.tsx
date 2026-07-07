import { customers, vendors, subscriptions, neighborhoods, metrics } from "@/data/mock"
import { KPICard } from "@/components/ui/KPICard"
import { VendorTable } from "@/components/vendors/VendorTable"
import { NeighborhoodTable } from "@/components/analytics/NeighborhoodTable"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active")
  const activeCustomers = customers.filter((c) => c.active)
  const activeVendors = vendors.filter((v) => v.active)

  const monthlyRevenue = activeSubscriptions.reduce((sum, sub) => {
    const multiplier = sub.frequency === "weekly" ? 4 : sub.frequency === "biweekly" ? 2 : 1
    return sum + sub.price * multiplier
  }, 0)

  const avgRating =
    activeVendors.reduce((sum, v) => sum + v.rating, 0) / (activeVendors.length || 1)

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of the Neighborhood Tasting Menu platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="Active Customers"
          value={activeCustomers.length}
          subtext={`${customers.length} total`}
          accentClass="border-l-amber-500"
        />
        <KPICard
          label="Active Subscriptions"
          value={activeSubscriptions.length}
          subtext={`${subscriptions.length} total`}
          accentClass="border-l-blue-500"
        />
        <KPICard
          label="Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          subtext="from active subs"
          accentClass="border-l-emerald-500"
        />
        <KPICard
          label="Avg Vendor Rating"
          value={`★ ${avgRating.toFixed(1)}`}
          subtext={`${activeVendors.length} active vendors`}
          accentClass="border-l-purple-500"
        />
      </div>

      <div className="space-y-6">
        <VendorTable vendors={vendors} neighborhoods={neighborhoods} />
        <NeighborhoodTable
          neighborhoods={neighborhoods}
          customers={customers}
          vendors={vendors}
          metrics={metrics}
        />
      </div>
    </div>
  )
}
