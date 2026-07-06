import type { Subscription, SubscriptionTier } from "@/types"

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

export function tierLabel(tier: SubscriptionTier): string {
  return { explorer: "Explorer", regular: "Regular", connoisseur: "Connoisseur" }[tier]
}

export function tierColor(tier: SubscriptionTier): string {
  return {
    explorer: "bg-emerald-100 text-emerald-800",
    regular: "bg-blue-100 text-blue-800",
    connoisseur: "bg-purple-100 text-purple-800",
  }[tier]
}

// The mock platform's data only covers Jan–Jun 2024, so renewal dates are
// projected forward from this date rather than the real-world current date.
export const MOCK_TODAY = new Date("2024-06-30")

const FREQUENCY_TO_MONTHLY: Record<Subscription["frequency"], number> = {
  weekly: 52 / 12,
  biweekly: 26 / 12,
  monthly: 1,
}

export function monthlyValue(sub: Subscription): number {
  return sub.price * FREQUENCY_TO_MONTHLY[sub.frequency]
}

const FREQUENCY_TO_DAYS: Record<Subscription["frequency"], number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
}

export function nextRenewalDate(sub: Subscription, asOf: Date = MOCK_TODAY): string {
  const intervalMs = FREQUENCY_TO_DAYS[sub.frequency] * 24 * 60 * 60 * 1000
  let next = new Date(sub.started_at)
  while (next.getTime() <= asOf.getTime()) {
    next = new Date(next.getTime() + intervalMs)
  }
  return next.toISOString().slice(0, 10)
}

export function subscriptionStatusColor(status: Subscription["status"]): string {
  return {
    active: "bg-emerald-100 text-emerald-700",
    paused: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-zinc-100 text-zinc-500",
  }[status]
}

export function categoryColor(category: string): string {
  const map: Record<string, string> = {
    bakery: "bg-amber-100 text-amber-800",
    butcher: "bg-red-100 text-red-800",
    cheese: "bg-yellow-100 text-yellow-800",
    produce: "bg-green-100 text-green-800",
    seafood: "bg-cyan-100 text-cyan-800",
    pantry: "bg-stone-100 text-stone-800",
  }
  return map[category] ?? "bg-gray-100 text-gray-800"
}
