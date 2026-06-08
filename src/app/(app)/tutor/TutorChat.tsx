"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Card, Badge, ErrorBanner } from "@/components/ui";
import type { TutorMessage } from "@/lib/types";

export function TutorChat({
  lessonId,
  lessonTitle,
  initialMessages,
}: {
  lessonId?: string;
  lessonTitle?: string;
  initialMessages: TutorMessage[];
}) {
  const [messages, setMessages] = useState<TutorMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    setError(null);
    setSending(true);
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, lesson_id: lessonId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "The tutor could not respond.");
      }
      const data = (await res.json()) as { reply: string; source: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      // Roll back the optimistic user message context cue is kept; surface error.
    } finally {
      setSending(false);
    }
  }

  const starters = lessonId
    ? [
        "Explain this lesson in simple terms.",
        "Give me an example for my situation.",
        "I'm stuck on the practice task - help?",
      ]
    : [
        "What should I focus on first?",
        "Explain my weakest skill simply.",
        "How do I use my 7-day plan?",
      ];

  return (
    <Card className="flex h-[60vh] min-h-[420px] flex-col">
      <div className="mb-3 flex items-center justify-between border-b-3 border-border pb-3">
        <div>
          <span className="neo-tag text-secondary">AI Tutor</span>
          <p className="text-sm font-semibold">
            {lessonTitle ? `Lesson: ${lessonTitle}` : "General coaching"}
          </p>
        </div>
        {lessonId && <Badge tone="secondary">Lesson context on</Badge>}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1" aria-live="polite">
        {messages.length === 0 && (
          <div className="rounded-neo border-3 border-dashed border-border bg-surface-sunken p-4 text-sm text-ink-soft">
            Ask anything about your goal or this lesson. The tutor knows your
            skill scores and adapts to your language and accessibility settings.
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-neo border-3 border-border px-4 py-2 text-sm shadow-neo-sm ${
                m.role === "user"
                  ? "bg-secondary text-secondary-fg"
                  : "bg-surface-raised text-ink"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-neo border-3 border-border bg-surface-raised px-4 py-2 text-sm shadow-neo-sm">
              <span className="neo-spinner h-4 w-4 text-secondary" aria-hidden="true" />
              Tutor is thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="mt-3">
          <ErrorBanner message={error} />
        </div>
      )}

      {messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInput(s)}
              className="rounded-neo-sm border-3 border-border bg-surface px-3 py-1 text-xs font-semibold shadow-neo-sm hover:bg-surface-sunken"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={send} className="mt-3 flex items-end gap-2">
        <div className="flex-1">
          <label htmlFor="tutor-input" className="sr-only">
            Your question for the tutor
          </label>
          <input
            id="tutor-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the tutor a question…"
            className="w-full rounded-neo border-3 border-border bg-surface-raised px-4 py-2.5 text-base shadow-neo-sm focus:shadow-neo focus-visible:outline-none"
          />
        </div>
        <Button type="submit" loading={sending} loadingText="Sending…" disabled={!input.trim()}>
          Ask tutor
        </Button>
      </form>
    </Card>
  );
}
