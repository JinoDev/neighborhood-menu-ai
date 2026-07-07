import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  neighborhoods,
  vendors,
  customers,
  subscriptions,
  monthlyRevenue,
  fulfillmentMetrics,
  wasteVsRetail,
} from "@/data/mock"
import { formatCurrency, tierLabel } from "@/lib/utils"

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null
const MAX_QUESTION_LENGTH = 2000

// Built from the same mock data that powers the dashboard, so the assistant's
// answers stay consistent with what's rendered on the Vendors/Customers/Subscriptions pages.
function buildSystemPrompt(): string {
  const neighborhoodMap = Object.fromEntries(neighborhoods.map((n) => [n.id, n]))
  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c]))

  const neighborhoodLines = neighborhoods
    .map((n) => `- ${n.name} (${n.borough}): ${n.id}`)
    .join("\n")

  const vendorLines = vendors
    .map((v) => {
      const hood = neighborhoodMap[v.neighborhood_id]?.name ?? "—"
      return `- ${v.name} | ${hood} | ${v.category} | ★${v.rating.toFixed(1)} | ${v.active ? "active" : "INACTIVE"}`
    })
    .join("\n")

  const activeSubCount = subscriptions.filter((s) => s.status === "active").length
  const subscriptionLines = subscriptions
    .map((s) => {
      const customer = customerMap[s.customer_id]
      const hood = customer ? neighborhoodMap[customer.neighborhood_id]?.name : undefined
      const flag = s.status === "active" ? "" : ` — ${s.status.toUpperCase()}`
      return `- ${customer?.name ?? "Unknown"} | ${hood ?? "—"} | ${tierLabel(s.tier)} | ${formatCurrency(s.price)}/${s.frequency}${flag}`
    })
    .join("\n")

  const revenueLines = monthlyRevenue
    .map(
      (m) =>
        `- ${m.month}: East Village ${formatCurrency(m.eastVillage)} | Bed-Stuy ${formatCurrency(m.bedStuy)} | Astoria ${formatCurrency(m.astoria)} | Total ${formatCurrency(m.total)}`
    )
    .join("\n")

  const fulfillmentLines = fulfillmentMetrics
    .map(
      (f) =>
        `- ${f.neighborhood}: ${f.fulfillmentRate}% fulfillment | ${f.onTimeRate}% on-time | ${f.wastePercent}% food waste | ${f.avgItemsPerBox} avg items/box`
    )
    .join("\n")

  const wasteLines = wasteVsRetail
    .map((w) => `${w.month}: platform ${w.platform}% vs. retail ${w.traditional}%`)
    .join(" | ")

  return `You are an operations assistant for Neighborhood Tasting Menu AI, a hyper-local NYC food subscription platform. You have access to real-time platform data below. Answer questions concisely and provide actionable business recommendations.

== PLATFORM DATA ==

NEIGHBORHOODS:
${neighborhoodLines}

VENDORS:
${vendorLines}

SUBSCRIPTIONS (${subscriptions.length} total, ${activeSubCount} active):
${subscriptionLines}

MONTHLY REVENUE (Jan–Jun 2024):
${revenueLines}

FULFILLMENT METRICS:
${fulfillmentLines}

FOOD WASTE vs. TRADITIONAL RETAIL (% by month):
${wasteLines}

== FORMATTING GUIDELINES ==
- Respond in clean, standard Markdown: "##" for section headers, "**bold**" for key names and numbers, "-" for bullet lists, and Markdown tables where a table is genuinely clearer than prose.
- Keep responses focused and under 400 words unless the question genuinely requires depth.
- Lead with the most actionable insight.`
}

const SYSTEM_PROMPT = buildSystemPrompt()

export async function POST(req: NextRequest) {
  if (!client) {
    return NextResponse.json(
      { error: "AI service is not configured. Add ANTHROPIC_API_KEY to .env.local." },
      { status: 503 }
    )
  }

  let question: string
  try {
    const body = await req.json()
    question = (body.question ?? "").trim()
    if (!question) {
      return NextResponse.json({ error: "No question provided." }, { status: 400 })
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        { error: `Question too long (max ${MAX_QUESTION_LENGTH} characters).` },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    })

    const textBlock = message.content.find((b) => b.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Unexpected response from AI." }, { status: 502 })
    }

    return NextResponse.json({ answer: textBlock.text })
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limit reached. Please try again in a moment." },
        { status: 429 }
      )
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "AI service authentication failed. Check your API key." },
        { status: 503 }
      )
    }
    console.error("[ai-insights]", err)
    return NextResponse.json({ error: "AI request failed. Please try again." }, { status: 502 })
  }
}
