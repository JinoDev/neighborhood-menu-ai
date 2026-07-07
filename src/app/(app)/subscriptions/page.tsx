import { subscriptions, customers, neighborhoods, subscriptionPlans, subscriptionGrowth } from "@/data/mock"
import { SubscriptionsView } from "@/components/subscriptions/SubscriptionsView"

export default function SubscriptionsPage() {
  const activeCount = subscriptions.filter((s) => s.status === "active").length
  const pausedCount = subscriptions.filter((s) => s.status === "paused").length
  const cancelledCount = subscriptions.filter((s) => s.status === "cancelled").length

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Subscriptions</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {activeCount} active · {pausedCount} paused · {cancelledCount} cancelled
        </p>
      </div>

      <SubscriptionsView
        subscriptions={subscriptions}
        customers={customers}
        neighborhoods={neighborhoods}
        plans={subscriptionPlans}
        growth={subscriptionGrowth}
      />
    </div>
  )
}
