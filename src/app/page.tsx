import Link from "next/link"

const features = [
  {
    title: "Vendor Network",
    description: "Connect hyper-local NYC vendors — bakeries, butchers, cheese caves, and produce farms — into curated neighborhood zones.",
  },
  {
    title: "Subscription Tiers",
    description: "Explorer, Regular, and Connoisseur tiers with weekly, biweekly, and monthly delivery cadences tailored to each neighborhood.",
  },
  {
    title: "Operations Analytics",
    description: "Real-time KPIs across neighborhoods — revenue, retention, box ratings, and vendor performance in one dashboard.",
  },
  {
    title: "AI Insights",
    description: "Claude-powered Q&A over live platform data: demand forecasting, vendor recommendations, and subscriber churn signals.",
  },
]

const stack = ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Claude API"]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800 max-w-6xl mx-auto w-full">
        <div>
          <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Neighborhood</span>
          <span className="text-white font-bold text-base ml-1.5">Tasting Menu AI</span>
        </div>
        <Link
          href="/dashboard"
          className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Open Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-8">
        <div className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
            Portfolio Project · Systems Analysis &amp; Design · NYC
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6">
            Hyper-local food subscriptions,
            <br />
            <span className="text-amber-400">powered by AI</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A full-stack platform connecting NYC neighborhoods to local vendors through curated
            tasting menu subscriptions — with real-time analytics and AI-driven insights.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm inline-block"
            >
              View Dashboard
            </Link>
            <Link
              href="/vendors"
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm inline-block"
            >
              Browse Vendors
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-16">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
            >
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">Built for target roles: Solutions Engineer · Technical Consultant · Systems Analyst</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {stack.map((tech) => (
              <span
                key={tech}
                className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
