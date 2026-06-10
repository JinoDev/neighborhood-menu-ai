import type { SubscriptionTier } from "@/types"

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
