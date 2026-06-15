"use client"

import { useState, useRef, useEffect } from "react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_PROMPTS = [
  "Which neighborhood is performing best?",
  "Which vendor needs attention?",
  "How can we reduce food waste?",
  "What should we prioritize next week?",
]

const MOCK_RESPONSES: Record<string, string> = {
  "Which neighborhood is performing best?":
    `Based on current platform data, **East Village** is your top-performing neighborhood across all key metrics.

**Revenue:** $3,540 in June — the highest of the three zones and growing 10.6% month-over-month. YTD contribution is approximately 46% of total platform revenue.

**Subscribers:** 3 active customers (Maya Torres, James Okafor, Dana Reeves), with the highest proportion of Connoisseur-tier accounts. Weekly delivery cadence means revenue per customer is the highest on the platform.

**Vendors:** Bien Cuit (★4.9) and Fleisher's Craft Butchery (★4.8) are your two highest-rated vendors — both located in East Village. This quality concentration gives the neighborhood a strong retention advantage.

**Fulfillment:** 97% fulfillment rate and 94% on-time delivery — the best operational performance across all zones.

**Recommendation:** East Village is ready for subscriber expansion. Adding a 4th vendor — a pantry or specialty goods partner — would support Connoisseur box differentiation without stressing current vendor capacity.`,

  "Which vendor needs attention?":
    `Two vendors warrant attention right now:

**1. Astoria Seafood — Currently Inactive**
This vendor has a strong ★4.8 rating and 22 historical orders, but is currently marked inactive. It's your only seafood option on the platform, and its absence directly reduces box quality for Astoria subscribers, particularly Finn Larsen (Connoisseur, weekly). Reactivation is the highest-impact single action available this week.

**2. Phillips Farms Stand — Lowest Rating & Fulfillment**
With a ★4.5 rating and a 94% fulfillment rate — the lowest on the platform — Phillips Farms Stand is underperforming relative to peers. The gap may reflect seasonal sourcing constraints or logistics friction with the Astoria zone.

**Suggested action:** Prioritize Astoria Seafood reactivation this week. Schedule a performance review with Phillips Farms Stand within the next two weeks to surface root causes before subscriber satisfaction is affected.`,

  "How can we reduce food waste?":
    `Your platform already averages **4.2% food waste** — roughly 7x better than the ~30% traditional retail benchmark. However, there is meaningful room to improve, particularly in Astoria.

**Current waste by neighborhood:**
• East Village: 3.1% — on target
• Bed-Stuy: 4.4% — watch zone
• Astoria: 5.2% — needs action

Astoria's higher rate likely reflects lower subscriber density (fewer boxes to absorb perishable inventory) combined with Astoria Seafood's inactive status creating gaps in box composition planning.

**Three recommendations:**

**1. Dynamic box sizing**
Let customers set portion preferences at subscription setup. Reducing over-packing in Monthly-tier boxes — Explorer customers like Omar Khalil and Priya Nair typically order less frequently — could cut waste by 15–20% in Astoria.

**2. Cross-neighborhood surplus redistribution**
Excess produce from Phillips Farms Stand can be redistributed across Bed-Stuy boxes when Astoria volume is low. A simple inventory-sharing rule between zones would reduce last-mile surplus.

**3. Demand signaling with vendors**
Share weekly subscriber counts with vendors 48 hours before fulfillment so they can right-size their prep quantities. Bien Cuit and Crown Finish Caves are strong candidates for this pilot given their volume and ratings.`,

  "What should we prioritize next week?":
    `Based on current platform state, here are the top 3 priorities for next week:

**1. Re-engage paused and cancelled subscribers**
Simone Park (Regular, Astoria, Biweekly) has a paused subscription. Aisha Grant (Regular, Bed-Stuy, Biweekly) cancelled. Together they represent ~$130/month in recoverable MRR. A personalized outreach — with a one-box credit or a delivery skip option — is a high-ROI action given your strong vendor ratings and low churn history.

**2. Reactivate Astoria Seafood**
Your Astoria Connoisseur subscriber (Finn Larsen, weekly at $120) and Explorer subscriber (Omar Khalil, monthly at $35) currently receive boxes without a seafood component. Reactivating Astoria Seafood restores full box quality and reduces waste in that zone simultaneously.

**3. Plan East Village vendor expansion**
East Village is your highest-revenue zone with 10.6% month-over-month growth and a 97% fulfillment rate — it has capacity headroom. Identifying a pantry or specialty goods vendor would let you increase average box value for Connoisseur subscribers without stressing Bien Cuit or Fleisher's.

**Estimated revenue impact if all three are executed:** +$340–$480/month.`,
}

function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    if (line === "") return <div key={i} className="h-2" />

    const parts = line.split(/(\*\*[^*]+\*\*)/)
    const rendered = parts.map((part, j) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={j} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      )
    )

    if (line.startsWith("•")) {
      return (
        <p key={i} className="flex gap-2 text-zinc-600 text-sm leading-relaxed">
          <span className="text-amber-500 mt-0.5 shrink-0">•</span>
          <span>{rendered}</span>
        </p>
      )
    }

    return (
      <p key={i} className="text-zinc-600 text-sm leading-relaxed">
        {rendered}
      </p>
    )
  })
}

export function OperationsAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const handlePrompt = (prompt: string) => {
    if (isTyping) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: prompt }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      const content = MOCK_RESPONSES[prompt] ?? "I don't have a response for that prompt yet."
      const aiMsg: Message = { id: `a-${Date.now()}`, role: "assistant", content }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 900)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-semibold text-zinc-900">Operations Assistant</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Powered by your platform data</p>
        </div>
        <span className="text-xs bg-zinc-100 text-zinc-400 px-2.5 py-1 rounded-full font-medium border border-zinc-200">
          Claude API · Coming Soon
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center pb-24">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
              <span className="text-2xl">✦</span>
            </div>
            <h2 className="text-zinc-800 font-semibold text-lg mb-1">How can I help?</h2>
            <p className="text-zinc-400 text-sm max-w-xs">
              Ask a question about your platform or choose a suggested prompt below.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mr-3 mt-0.5 shrink-0">
                ✦
              </div>
            )}
            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-amber-500 text-white text-sm font-medium ml-12"
                  : "bg-white border border-zinc-100 shadow-sm space-y-1"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm">{msg.content}</p>
              ) : (
                <div className="space-y-1">{renderContent(msg.content)}</div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mr-3 mt-0.5 shrink-0">
              ✦
            </div>
            <div className="bg-white border border-zinc-100 shadow-sm rounded-2xl px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-6 py-3 border-t border-zinc-100 bg-white shrink-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePrompt(prompt)}
              disabled={isTyping}
              className="text-xs bg-zinc-50 hover:bg-amber-50 border border-zinc-200 hover:border-amber-300 text-zinc-600 hover:text-amber-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5">
          <input
            type="text"
            disabled
            placeholder="Claude API integration coming soon…"
            className="flex-1 bg-transparent text-sm text-zinc-400 placeholder:text-zinc-300 outline-none cursor-not-allowed"
          />
          <button
            disabled
            className="text-xs bg-zinc-200 text-zinc-400 px-3 py-1.5 rounded-lg font-medium cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
