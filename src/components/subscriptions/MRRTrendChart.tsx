"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"

type Props = {
  data: { month: string; explorer: number; regular: number; connoisseur: number }[]
}

const fmt = (v: number) => `$${Math.round(v).toLocaleString()}`

export function MRRTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="mrr-explorer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="mrr-regular" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="mrr-connoisseur" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} width={64} />
        <Tooltip formatter={(v) => (typeof v === "number" ? fmt(v) : v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="explorer" name="Explorer" stackId="mrr" stroke="#10b981" fill="url(#mrr-explorer)" strokeWidth={2} dot={false} />
        <Area type="monotone" dataKey="regular" name="Regular" stackId="mrr" stroke="#6366f1" fill="url(#mrr-regular)" strokeWidth={2} dot={false} />
        <Area type="monotone" dataKey="connoisseur" name="Connoisseur" stackId="mrr" stroke="#f59e0b" fill="url(#mrr-connoisseur)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
