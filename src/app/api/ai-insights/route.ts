import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null
const MAX_QUESTION_LENGTH = 2000

const SYSTEM_PROMPT = `You are an operations assistant for Neighborhood Tasting Menu AI, a hyper-local NYC food subscription platform. You have access to real-time platform data below. Answer questions concisely and provide actionable business recommendations.

== PLATFORM DATA ==

NEIGHBORHOODS:
- East Village (Manhattan): nbh-001
- Bed-Stuy (Brooklyn): nbh-002
- Astoria (Queens): nbh-003

VENDORS:
- Bien Cuit | East Village | bakery | ★4.9 | active | 48 orders
- Fleisher's Craft Butchery | East Village | butcher | ★4.8 | active | 41 orders
- Crown Finish Caves | Bed-Stuy | cheese | ★4.7 | active | 35 orders
- Stinky Bklyn | Bed-Stuy | cheese | ★4.6 | active | 29 orders
- Phillips Farms Stand | Astoria | produce | ★4.5 | active | 31 orders
- Astoria Seafood | Astoria | seafood | ★4.8 | INACTIVE | 22 orders

CUSTOMERS (10 total):
- Maya Torres | East Village | connoisseur | active
- James Okafor | East Village | regular | active
- Priya Nair | Bed-Stuy | explorer | active
- Leo Vasquez | Bed-Stuy | connoisseur | active
- Simone Park | Astoria | regular | PAUSED subscription
- Omar Khalil | Astoria | explorer | active
- Dana Reeves | East Village | regular | active
- Tasha Williams | Bed-Stuy | explorer | active
- Finn Larsen | Astoria | connoisseur | active
- Aisha Grant | Bed-Stuy | regular | CANCELLED subscription

SUBSCRIPTIONS:
- Connoisseur: $120/week (Maya Torres, Leo Vasquez, Finn Larsen — all weekly)
- Regular: $65/biweekly or weekly (James Okafor biweekly, Dana Reeves weekly, Simone Park biweekly PAUSED, Aisha Grant biweekly CANCELLED)
- Explorer: $35/month (Priya Nair, Omar Khalil, Tasha Williams — all monthly)

MONTHLY REVENUE (Jan–Jun 2024):
- Jan: East Village $1,800 | Bed-Stuy $1,100 | Astoria $680 | Total $3,580
- Feb: East Village $2,100 | Bed-Stuy $1,350 | Astoria $820 | Total $4,270
- Mar: East Village $2,450 | Bed-Stuy $1,600 | Astoria $1,050 | Total $5,100
- Apr: East Village $2,800 | Bed-Stuy $1,900 | Astoria $1,280 | Total $5,980
- May: East Village $3,200 | Bed-Stuy $2,200 | Astoria $1,520 | Total $6,920
- Jun: East Village $3,540 | Bed-Stuy $2,490 | Astoria $1,740 | Total $7,770

FULFILLMENT METRICS:
- East Village: 97% fulfillment | 94% on-time | 3.1% food waste | 5.2 avg items/box
- Bed-Stuy: 95% fulfillment | 91% on-time | 4.4% food waste | 4.8 avg items/box
- Astoria: 93% fulfillment | 88% on-time | 5.2% food waste | 4.5 avg items/box

FOOD WASTE vs. TRADITIONAL RETAIL (platform avg 4.2% vs ~30% retail):
Jan: 5.1% vs 31% | Feb: 4.8% vs 30.5% | Mar: 4.5% vs 30.2% | Apr: 4.3% vs 29.8% | May: 4.1% vs 29.5% | Jun: 4.2% vs 29.3%

== FORMATTING GUIDELINES ==
- Use **bold** for key names, numbers, and section headers
- Use bullet points (•) for lists
- Keep responses focused and under 400 words unless the question genuinely requires depth
- Lead with the most actionable insight`

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
