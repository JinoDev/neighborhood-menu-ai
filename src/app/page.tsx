import Link from "next/link"
import Image from "next/image"

function VendorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M5 9v10h14V9" />
      <path d="M9 19v-6h6v6" />
    </svg>
  )
}

function TiersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function AnalyticsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="20" x2="4" y2="12" />
      <line x1="10" y1="20" x2="10" y2="6" />
      <line x1="16" y1="20" x2="16" y2="14" />
      <line x1="20" y1="20" x2="4" y2="20" />
    </svg>
  )
}

const highlights = [
  { label: "Vendor Network", icon: <VendorIcon /> },
  { label: "Subscription Tiers", icon: <TiersIcon /> },
  { label: "Operations Analytics", icon: <AnalyticsIcon /> },
  { label: "AI Insights", icon: <span className="text-[13px] leading-none">✦</span> },
]

export default function LandingPage() {
  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-white text-zinc-900">
      <nav className="shrink-0 border-b border-zinc-100">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-5 pb-2.5 max-w-7xl mx-auto w-full">
          <Link href="/" className="min-w-0 hover:opacity-80 transition-opacity">
            <span className="text-amber-600 text-xs font-semibold uppercase tracking-widest">Neighborhood</span>
            <span className="text-zinc-900 font-bold text-base ml-1.5">Tasting Menu AI</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors shrink-0 inline-flex items-center gap-1"
          >
            Dashboard <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative flex-1 min-h-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(45% 60% at 15% 30%, rgba(245,158,11,0.08), transparent 70%)",
          }}
        />
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col lg:flex-row items-center gap-7 lg:gap-12">
          {/* Copy */}
          <div className="w-full lg:w-[42%] shrink-0 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              For local food subscription businesses
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.12] mb-4 text-zinc-900">
              Local food subscriptions,
              <br />
              <span className="text-amber-500">streamlined by AI</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-500 max-w-md mb-6 leading-relaxed">
              Connect vendors and subscribers, track performance by neighborhood, and get AI-driven insights — all in one dashboard.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-7">
              <Link
                href="/dashboard"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                View Dashboard
              </Link>
              <Link
                href="/vendors"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors inline-flex items-center gap-1"
              >
                Explore vendors <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {highlights.map((h) => (
                <span
                  key={h.label}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-full px-2.5 py-1"
                >
                  <span className="text-amber-500">{h.icon}</span>
                  {h.label}
                </span>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="w-full flex-1 min-h-[160px] lg:min-h-0 lg:h-full flex items-center justify-center">
            <div className="relative w-full h-[68%] min-h-[110px] rounded-2xl overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-200/60">
              <Image
                src="https://images.unsplash.com/photo-1643944471768-2d2eac3afb6d?w=1920&q=80&fm=jpg&fit=crop"
                alt="Fresh pastries and croissants displayed in a neighborhood bakery case"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="shrink-0 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <p className="text-xs text-zinc-400">© 2026 Neighborhood Tasting Menu AI</p>
          <p className="text-xs text-zinc-400">NYC · Hyper-local food subscriptions</p>
        </div>
      </footer>
    </div>
  )
}
