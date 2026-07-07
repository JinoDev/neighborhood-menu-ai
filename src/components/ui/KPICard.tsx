type KPICardProps = {
  label: string
  value: string | number
  subtext?: string
  accentClass?: string
}

export function KPICard({ label, value, subtext, accentClass = "border-l-amber-500" }: KPICardProps) {
  return (
    <div className={`bg-white rounded-xl p-4 sm:p-5 border border-zinc-100 shadow-sm border-l-4 ${accentClass}`}>
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider truncate">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-2 truncate">{value}</p>
      {subtext && <p className="text-xs text-zinc-400 mt-1.5">{subtext}</p>}
    </div>
  )
}
