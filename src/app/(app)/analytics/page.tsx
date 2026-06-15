import { monthlyRevenue, subscriptionGrowth, vendorPerformance, fulfillmentMetrics, wasteVsRetail } from "@/data/mock"
import { KPICard } from "@/components/ui/KPICard"
import { RevenueChart } from "@/components/analytics/RevenueChart"
import { SubscriptionGrowthChart } from "@/components/analytics/SubscriptionGrowthChart"
import { VendorPerformanceChart } from "@/components/analytics/VendorPerformanceChart"
import { WasteChart } from "@/components/analytics/WasteChart"
import { formatCurrency } from "@/lib/utils"

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      {subtitle && <p className="text-xs text-zinc-400 mt-0.5 mb-4">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default function AnalyticsPage() {
  const latestRevenue = monthlyRevenue[monthlyRevenue.length - 1]
  const prevRevenue = monthlyRevenue[monthlyRevenue.length - 2]
  const revenueGrowth = (((latestRevenue.total - prevRevenue.total) / prevRevenue.total) * 100).toFixed(1)

  const latestSubs = subscriptionGrowth[subscriptionGrowth.length - 1]
  const prevSubs = subscriptionGrowth[subscriptionGrowth.length - 2]
  const subGrowth = (((latestSubs.total - prevSubs.total) / prevSubs.total) * 100).toFixed(1)

  const avgFulfillment = (fulfillmentMetrics.reduce((s, m) => s + m.fulfillmentRate, 0) / fulfillmentMetrics.length).toFixed(1)
  const avgWaste = (fulfillmentMetrics.reduce((s, m) => s + m.wastePercent, 0) / fulfillmentMetrics.length).toFixed(1)

  const ytdRevenue = monthlyRevenue.reduce((s, m) => s + m.total, 0)

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-1">Business operations overview · Jan – Jun 2024</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="YTD Revenue"
          value={formatCurrency(ytdRevenue)}
          subtext="Jan – Jun 2024"
          accentClass="border-l-amber-500"
        />
        <KPICard
          label="Revenue Growth"
          value={`+${revenueGrowth}%`}
          subtext="vs. prior month"
          accentClass="border-l-emerald-500"
        />
        <KPICard
          label="Avg Fulfillment Rate"
          value={`${avgFulfillment}%`}
          subtext="across all neighborhoods"
          accentClass="border-l-blue-500"
        />
        <KPICard
          label="Avg Food Waste"
          value={`${avgWaste}%`}
          subtext="vs. 30% retail avg"
          accentClass="border-l-purple-500"
        />
      </div>

      {/* Revenue + Growth charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Monthly Revenue by Neighborhood" subtitle="Stacked area — USD per month">
          <RevenueChart data={monthlyRevenue} />
        </ChartCard>
        <ChartCard title="Subscription Growth" subtitle="Stacked by tier — active subscribers per month">
          <SubscriptionGrowthChart data={subscriptionGrowth} />
        </ChartCard>
      </div>

      {/* Vendor performance + Waste charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Vendor Order Volume" subtitle="Total orders fulfilled per vendor · all time">
          <VendorPerformanceChart data={vendorPerformance} />
        </ChartCard>
        <ChartCard title="Food Waste Rate" subtitle="Platform vs. traditional retail (%) — lower is better">
          <WasteChart data={wasteVsRetail} />
        </ChartCard>
      </div>

      {/* Fulfillment metrics table */}
      <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">Fulfillment Metrics by Neighborhood</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Operational health across delivery zones</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Neighborhood</th>
              <th className="px-5 py-3 text-right">Fulfillment Rate</th>
              <th className="px-5 py-3 text-right">On-Time Rate</th>
              <th className="px-5 py-3 text-right">Food Waste</th>
              <th className="px-5 py-3 text-right">Avg Items / Box</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {fulfillmentMetrics.map((row) => (
              <tr key={row.neighborhood} className="hover:bg-zinc-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-zinc-900">{row.neighborhood}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`font-medium ${row.fulfillmentRate >= 96 ? "text-emerald-600" : row.fulfillmentRate >= 93 ? "text-amber-600" : "text-red-500"}`}>
                    {row.fulfillmentRate}%
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`font-medium ${row.onTimeRate >= 93 ? "text-emerald-600" : row.onTimeRate >= 90 ? "text-amber-600" : "text-red-500"}`}>
                    {row.onTimeRate}%
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`font-medium ${row.wastePercent <= 3.5 ? "text-emerald-600" : row.wastePercent <= 4.5 ? "text-amber-600" : "text-red-500"}`}>
                    {row.wastePercent}%
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-zinc-700">{row.avgItemsPerBox}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100">
          <p className="text-xs text-zinc-400">
            Color coding: <span className="text-emerald-600 font-medium">green</span> = on target · <span className="text-amber-600 font-medium">amber</span> = watch · <span className="text-red-500 font-medium">red</span> = action needed
          </p>
        </div>
      </div>
    </div>
  )
}
