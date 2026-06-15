"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"

type Props = {
  data: { month: string; explorer: number; regular: number; connoisseur: number }[]
}

export function SubscriptionGrowthChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barSize={18}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="explorer"    name="Explorer"    fill="#10b981" radius={[3, 3, 0, 0]} stackId="a" />
        <Bar dataKey="regular"     name="Regular"     fill="#6366f1" radius={[0, 0, 0, 0]} stackId="a" />
        <Bar dataKey="connoisseur" name="Connoisseur" fill="#f59e0b" radius={[3, 3, 0, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  )
}
