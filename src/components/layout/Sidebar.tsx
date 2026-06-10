"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/vendors", label: "Vendors" },
  { href: "/customers", label: "Customers" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/analytics", label: "Analytics" },
  { href: "/ai", label: "AI Insights" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-zinc-900 text-white flex flex-col h-screen sticky top-0 shrink-0">
      <div className="px-6 py-5 border-b border-zinc-800">
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Neighborhood</p>
        <p className="text-base font-bold text-white mt-0.5 leading-tight">Tasting Menu AI</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-amber-500 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 font-medium">Portfolio Project</p>
        <p className="text-xs text-zinc-600 mt-0.5">NYC · Systems Analysis & Design</p>
      </div>
    </aside>
  )
}
