import type { Subscription } from "@/types"

export const subscriptions: Subscription[] = [
  { id: "sub-001", customer_id: "cst-001", tier: "connoisseur", frequency: "weekly",   price: 120, status: "active",    started_at: "2024-02-10" },
  { id: "sub-002", customer_id: "cst-002", tier: "regular",     frequency: "biweekly", price: 65,  status: "active",    started_at: "2024-03-01" },
  { id: "sub-003", customer_id: "cst-003", tier: "explorer",    frequency: "monthly",  price: 35,  status: "active",    started_at: "2024-03-15" },
  { id: "sub-004", customer_id: "cst-004", tier: "connoisseur", frequency: "weekly",   price: 120, status: "active",    started_at: "2024-04-01" },
  { id: "sub-005", customer_id: "cst-005", tier: "regular",     frequency: "biweekly", price: 65,  status: "paused",    started_at: "2024-04-10" },
  { id: "sub-006", customer_id: "cst-006", tier: "explorer",    frequency: "monthly",  price: 35,  status: "active",    started_at: "2024-05-01" },
  { id: "sub-007", customer_id: "cst-007", tier: "regular",     frequency: "weekly",   price: 65,  status: "active",    started_at: "2024-05-12" },
  { id: "sub-008", customer_id: "cst-008", tier: "explorer",    frequency: "monthly",  price: 35,  status: "active",    started_at: "2024-05-20" },
  { id: "sub-009", customer_id: "cst-009", tier: "connoisseur", frequency: "weekly",   price: 120, status: "active",    started_at: "2024-06-01" },
  { id: "sub-010", customer_id: "cst-010", tier: "regular",     frequency: "biweekly", price: 65,  status: "cancelled", started_at: "2024-06-15" },
]
