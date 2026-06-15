"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"

type Props = {
  data: { name: string; orders: number; rating: number; fulfillmentRate: number }[]
}

const COLORS = ["#f59e0b", "#6366f1", "#10b981", "#f97316", "#8b5cf6", "#06b6d4"]

export function VendorPerformanceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} domain={[0, 55]} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#52525b" }} axisLine={false} tickLine={false} width={130} />
        <Tooltip
          formatter={(v, name) => [v, name === "orders" ? "Total Orders" : name]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }}
        />
        <Bar dataKey="orders" name="orders" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
