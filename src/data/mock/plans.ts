import type { SubscriptionTier } from "@/types"

export type SubscriptionPlan = {
  tier: SubscriptionTier
  price: number
  frequency: string
  description: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    tier: "explorer",
    price: 35,
    frequency: "Monthly",
    description: "A low-commitment taste of the neighborhood — one curated box a month.",
  },
  {
    tier: "regular",
    price: 65,
    frequency: "Weekly or biweekly",
    description: "A steady rotation of vendor boxes, delivered on a schedule that fits your kitchen.",
  },
  {
    tier: "connoisseur",
    price: 120,
    frequency: "Weekly",
    description: "Premium weekly boxes with priority access to the platform's top-rated vendors.",
  },
]
