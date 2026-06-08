"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Badge, Progress, ErrorBanner } from "@/components/ui";
import type { Goal } from "@/lib/types";

interface PublicQuestion {
  id: string;
  skill_name: string;
  prompt: string;
  options: { index: number; label: string }[];
}

export function Quiz({
  goal,
  questions,
}: {
  goal: Goal;
  questions: PublicQuestion[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = questions[current];
  const selected = answers[q.id];
  const answeredCount = Object.keys(answers).length;
  const isLast = current === questions.length - 1;
  const progress = ((current + 1) / questions.length) * 100;

  function choose(index: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: index }));
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/submit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          answers: questions.map((question) => ({
            question_id: question.id,
            selected_index: answers[question.id],
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not submit your answers.");
      }
      router.push("/report");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-1 flex items-center justify-between text-sm font-semibold">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span className="font-mono">{answeredCount} answered</span>
        </div>
        <Progress value={progress} showValue={false} tone="primary" label="" />
      </div>

      {error && <ErrorBanner message={error} />}

      <Card accent="secondary">
        <Badge tone="secondary">{q.skill_name}</Badge>
        <h2 className="mt-3 text-lg">{q.prompt}</h2>

        <fieldset className="mt-4 flex flex-col gap-3">
          <legend className="sr-only">{q.prompt}</legend>
          {q.options.map((opt) => {
            const isSelected = selected === opt.index;
            return (
              <label
                key={opt.index}
                className={`flex cursor-pointer items-center gap-3 rounded-neo border-3 border-border px-4 py-3 font-medium shadow-neo-sm transition-transform hover:-translate-y-0.5 ${
                  isSelected
                    ? "bg-primary text-primary-fg"
                    : "bg-surface-raised"
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.index}
                  checked={isSelected}
                  onChange={() => choose(opt.index)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-3 border-border font-mono text-xs font-bold ${
                    isSelected ? "bg-secondary text-secondary-fg" : "bg-surface"
                  }`}
                >
                  {String.fromCharCode(65 + opt.index)}
                </span>
                <span>{opt.label}</span>
              </label>
            );
          })}
        </fieldset>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0 || submitting}
        >
          Previous
        </Button>

        {isLast ? (
          <Button
            onClick={submit}
            disabled={answeredCount < questions.length}
            loading={submitting}
            loadingText="Scoring…"
          >
            Submit and see my report
          </Button>
        ) : (
          <Button
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            disabled={selected === undefined}
          >
            Next question
          </Button>
        )}
      </div>

      {isLast && answeredCount < questions.length && (
        <p className="text-sm font-semibold text-warning">
          Answer all {questions.length} questions to submit. {questions.length - answeredCount} left.
        </p>
      )}
    </div>
  );
}
