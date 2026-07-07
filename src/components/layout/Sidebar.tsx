"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

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
  const [isOpen, setIsOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)

  // Close the mobile drawer whenever navigation happens. Adjusting state
  // during render (rather than in an effect) avoids an extra render pass.
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-zinc-900 text-white border-b border-zinc-800 shrink-0">
        <Link href="/" className="hover:opacity-80 transition-opacity" aria-label="Go to home page">
          <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest leading-none">Neighborhood</p>
          <p className="text-sm font-bold text-white mt-0.5 leading-tight">Tasting Menu AI</p>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="p-2 -mr-2 text-zinc-300 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Backdrop, mobile only, shown while drawer is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-60 bg-zinc-900 text-white flex flex-col h-screen shrink-0 z-50 fixed md:sticky top-0 left-0 transition-transform duration-200 ease-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity" aria-label="Go to home page">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Neighborhood</p>
            <p className="text-base font-bold text-white mt-0.5 leading-tight">Tasting Menu AI</p>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="md:hidden p-1 text-zinc-400 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors">
            ← Back to home
          </Link>
        </div>
      </aside>
    </>
  )
}
