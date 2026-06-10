export type Neighborhood = {
  id: string
  name: string
  borough: string
  lat: number
  lng: number
}

export type VendorCategory = "bakery" | "butcher" | "cheese" | "produce" | "seafood" | "pantry"

export type Vendor = {
  id: string
  name: string
  neighborhood_id: string
  category: VendorCategory
  description: string
  rating: number
  active: boolean
  joined_at: string
}

export type SubscriptionTier = "explorer" | "regular" | "connoisseur"

export type Customer = {
  id: string
  name: string
  email: string
  neighborhood_id: string
  subscription_tier: SubscriptionTier
  active: boolean
  joined_at: string
}

export type Subscription = {
  id: string
  customer_id: string
  tier: SubscriptionTier
  frequency: "weekly" | "biweekly" | "monthly"
  price: number
  status: "active" | "paused" | "cancelled"
  started_at: string
}

export type BoxItem = {
  vendor_id: string
  product_name: string
  quantity: number
  unit_price: number
}

export type Box = {
  id: string
  subscription_id: string
  vendor_items: BoxItem[]
  delivered_at: string
  rating: number | null
}

export type NeighborhoodMetrics = {
  neighborhood_id: string
  week: string
  active_subscribers: number
  revenue: number
  top_vendor_id: string
  avg_box_rating: number
}
