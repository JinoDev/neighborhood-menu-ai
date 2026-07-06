"use client"

import { useState } from "react"
import type { Customer, Neighborhood, Subscription } from "@/types"
import type { SubscriptionPlan } from "@/data/mock"
import { Badge } from "@/components/ui/Badge"
import { KPICard } from "@/components/ui/KPICard"
import { MRRTrendChart } from "@/components/subscriptions/MRRTrendChart"
import {
  formatCurrency,
  monthlyValue,
  nextRenewalDate,
  subscriptionStatusColor,
  tierColor,
  tierLabel,
} from "@/lib/utils"

type MonthlyTierCounts = { month: string; explorer: number; regular: number; connoisseur: number }

type Props = {
  subscriptions: Subscription[]
  customers: Customer[]
  neighborhoods: Neighborhood[]
  plans: SubscriptionPlan[]
  growth: MonthlyTierCounts[]
}

// Representative monthly billing multiplier per tier, used only to project
// the historical subscriber-count trend into an estimated MRR trend.
const TIER_MONTHLY_MULTIPLIER = { explorer: 1, regular: 26 / 12, connoisseur: 52 / 12 }

export function SubscriptionsView({ subscriptions, customers, neighborhoods, plans, growth }: Props) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")

  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c]))
  const neighborhoodMap = Object.fromEntries(neighborhoods.map((n) => [n.id, n]))

  const activeSubs = subscriptions.filter((s) => s.status === "active")
  const pausedSubs = subscriptions.filter((s) => s.status === "paused")
  const cancelledSubs = subscriptions.filter((s) => s.status === "cancelled")

  const mrr = activeSubs.reduce((sum, s) => sum + monthlyValue(s), 0)
  const churnRate = (cancelledSubs.length / subscriptions.length) * 100
  const retentionRate = 100 - churnRate

  const filtered = subscriptions.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false
    if (tierFilter !== "all" && s.tier !== tierFilter) return false
    return true
  })

  const priceByTier = Object.fromEntries(plans.map((p) => [p.tier, p.price]))
  const mrrTrend = growth.map((m) => ({
    month: m.month,
    explorer: m.explorer * priceByTier.explorer * TIER_MONTHLY_MULTIPLIER.explorer,
    regular: m.regular * priceByTier.regular * TIER_MONTHLY_MULTIPLIER.regular,
    connoisseur: m.connoisseur * priceByTier.connoisseur * TIER_MONTHLY_MULTIPLIER.connoisseur,
  }))

  return (
    <div>
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="MRR"
          value={formatCurrency(mrr)}
          subtext={`from ${activeSubs.length} active subscriptions`}
          accentClass="border-l-amber-500"
        />
        <KPICard
          label="Active Subscriptions"
          value={activeSubs.length}
          subtext={`${((activeSubs.length / subscriptions.length) * 100).toFixed(0)}% of ${subscriptions.length} total`}
          accentClass="border-l-emerald-500"
        />
        <KPICard
          label="Churn Rate"
          value={`${churnRate.toFixed(1)}%`}
          subtext={`${cancelledSubs.length} cancelled all-time`}
          accentClass="border-l-red-500"
        />
        <KPICard
          label="Retention Rate"
          value={`${retentionRate.toFixed(1)}%`}
          subtext="active + paused vs. total"
          accentClass="border-l-blue-500"
        />
      </div>

      {/* MRR trend */}
      <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-900">MRR Trend</h2>
        <p className="text-xs text-zinc-400 mt-0.5 mb-4">Estimated monthly recurring revenue by plan · Jan – Jun 2024</p>
        <MRRTrendChart data={mrrTrend} />
      </div>

      {/* Plans */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-zinc-900 mb-3">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const subsForTier = activeSubs.filter((s) => s.tier === plan.tier)
            const pct = activeSubs.length ? (subsForTier.length / activeSubs.length) * 100 : 0
            return (
              <div
                key={plan.tier}
                className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge label={tierLabel(plan.tier)} className={tierColor(plan.tier)} />
                  <span className="text-xs text-zinc-400">{subsForTier.length} active</span>
                </div>

                <div>
                  <p className="text-2xl font-bold text-zinc-900">{formatCurrency(plan.price)}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{plan.frequency}</p>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed">{plan.description}</p>

                <div className="mt-auto pt-2 border-t border-zinc-50">
                  <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5">{pct.toFixed(0)}% of active subscribers</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Churn & retention summary */}
      <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-900">Churn & Retention Summary</h2>
        <p className="text-xs text-zinc-400 mt-0.5 mb-4">Subscription status breakdown · all time</p>

        <div className="flex h-2.5 rounded-full overflow-hidden bg-zinc-100 mb-5">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${(activeSubs.length / subscriptions.length) * 100}%` }}
          />
          <div
            className="h-full bg-yellow-400"
            style={{ width: `${(pausedSubs.length / subscriptions.length) * 100}%` }}
          />
          <div
            className="h-full bg-zinc-400"
            style={{ width: `${(cancelledSubs.length / subscriptions.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-emerald-600">{activeSubs.length}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Active</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-600">{pausedSubs.length}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Paused</p>
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-500">{cancelledSubs.length}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="all">All Plans</option>
          <option value="explorer">Explorer</option>
          <option value="regular">Regular</option>
          <option value="connoisseur">Connoisseur</option>
        </select>

        <span className="text-xs text-zinc-400 ml-auto">
          {filtered.length} subscription{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">Neighborhood</th>
              <th className="px-5 py-3 text-left">Plan</th>
              <th className="px-5 py-3 text-left">Frequency</th>
              <th className="px-5 py-3 text-right">Price</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Started</th>
              <th className="px-5 py-3 text-left">Renews</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filtered.map((sub) => {
              const customer = customerMap[sub.customer_id]
              const neighborhood = customer ? neighborhoodMap[customer.neighborhood_id] : undefined
              return (
                <tr key={sub.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {customer?.name.charAt(0) ?? "?"}
                      </div>
                      <span className="font-medium text-zinc-900">{customer?.name ?? "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500">{neighborhood?.name ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <Badge label={tierLabel(sub.tier)} className={tierColor(sub.tier)} />
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 capitalize">{sub.frequency}</td>
                  <td className="px-5 py-3.5 text-right text-zinc-700 font-medium">
                    {formatCurrency(sub.price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge label={sub.status} className={subscriptionStatusColor(sub.status)} />
                  </td>
                  <td className="px-5 py-3.5 text-zinc-400 text-xs">{sub.started_at}</td>
                  <td className="px-5 py-3.5 text-zinc-500 text-xs">
                    {sub.status === "cancelled" ? "—" : sub.status === "paused" ? "Paused" : nextRenewalDate(sub)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-400 text-sm">
            No subscriptions match the current filters.
          </div>
        )}
      </div>
    </div>
  )
}
