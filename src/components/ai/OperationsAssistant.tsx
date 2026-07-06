"use client"

import { useState, useRef, useEffect } from "react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  isError?: boolean
}

const SUGGESTED_PROMPTS = [
  "Which neighborhood is performing best?",
  "Which vendor needs attention?",
  "How can we reduce food waste?",
  "What should we prioritize next week?",
]

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
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sendMessage = async (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          { id: `e-${Date.now()}`, role: "assistant", content: data.error ?? "Something went wrong.", isError: true },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: data.answer },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", content: "Could not reach the AI service. Check your connection.", isError: true },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-semibold text-zinc-900">Operations Assistant</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Powered by your platform data</p>
        </div>
        <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium border border-amber-200">
          Claude API · Live
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
              <div className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center mr-3 mt-0.5 shrink-0 ${msg.isError ? "bg-red-400" : "bg-amber-500"}`}>
                {msg.isError ? "!" : "✦"}
              </div>
            )}
            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-amber-500 text-white text-sm font-medium ml-12"
                  : msg.isError
                  ? "bg-red-50 border border-red-100 shadow-sm"
                  : "bg-white border border-zinc-100 shadow-sm space-y-1"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm">{msg.content}</p>
              ) : msg.isError ? (
                <p className="text-sm text-red-600">{msg.content}</p>
              ) : (
                <div className="space-y-1">{renderContent(msg.content)}</div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
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

      {/* Suggested prompts + input */}
      <div className="px-6 py-3 border-t border-zinc-100 bg-white shrink-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              disabled={isLoading}
              className="text-xs bg-zinc-50 hover:bg-amber-50 border border-zinc-200 hover:border-amber-300 text-zinc-600 hover:text-amber-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus-within:border-amber-300 focus-within:bg-white transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask about vendors, revenue, fulfillment, food waste…"
            className="flex-1 bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 outline-none disabled:cursor-not-allowed"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
