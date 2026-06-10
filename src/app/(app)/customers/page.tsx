import { customers, neighborhoods, subscriptions } from "@/data/mock"
import { CustomersView } from "@/components/customers/CustomersView"

export default function CustomersPage() {
  const activeCount = customers.filter((c) => c.active).length
  const tierCounts = customers.reduce<Record<string, number>>((acc, c) => {
    acc[c.subscription_tier] = (acc[c.subscription_tier] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Customers</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {activeCount} active · {tierCounts.explorer ?? 0} Explorer · {tierCounts.regular ?? 0} Regular · {tierCounts.connoisseur ?? 0} Connoisseur
        </p>
      </div>

      <CustomersView
        customers={customers}
        neighborhoods={neighborhoods}
        subscriptions={subscriptions}
      />
    </div>
  )
}
