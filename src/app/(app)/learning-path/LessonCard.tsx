"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Badge,
  Textarea,
  ErrorBanner,
  SuccessBanner,
} from "@/components/ui";
import { Progress } from "@/components/ui";
import type { LearningPathItem, PracticeEvaluation } from "@/lib/types";

interface PriorSubmission {
  submission: string;
  feedback: string | null;
  score: number | null;
}

export function LessonCard({
  lesson,
  completed: initialCompleted,
  priorSubmission,
}: {
  lesson: LearningPathItem;
  completed: boolean;
  priorSubmission?: PriorSubmission;
}) {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(initialCompleted);
  const [submission, setSubmission] = useState(priorSubmission?.submission ?? "");
  const [evaluating, setEvaluating] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<PracticeEvaluation | null>(
    priorSubmission && priorSubmission.score != null
      ? {
          score: priorSubmission.score,
          feedback: priorSubmission.feedback ?? "",
          met_criteria: priorSubmission.score >= 60,
          source: "fallback",
        }
      : null,
  );

  async function evaluate() {
    setError(null);
    if (!submission.trim()) {
      setError("Write your practice answer first.");
      return;
    }
    setEvaluating(true);
    try {
      const res = await fetch("/api/evaluate-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lesson.lesson_id, submission }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not evaluate your work.");
      }
      setEvaluation((await res.json()) as PracticeEvaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setEvaluating(false);
    }
  }

  async function complete() {
    setError(null);
    setCompleting(true);
    try {
      const res = await fetch("/api/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lesson.lesson_id }),
      });
      if (!res.ok) throw new Error("Could not mark complete.");
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCompleting(false);
    }
  }

  return (
    <Card
      as="li"
      accent={completed ? "none" : "primary"}
      className={completed ? "border-success" : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="secondary">Day {lesson.day}</Badge>
            <Badge tone="neutral">{lesson.target_skill}</Badge>
            <span className="font-mono text-xs text-ink-soft">
              {lesson.estimated_time}
            </span>
            {completed && <Badge tone="success">✓ Complete</Badge>}
          </div>
          <h3 className="mt-2 text-lg">{lesson.title}</h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Hide" : "Open"}
        </Button>
      </div>

      {open && (
        <div className="mt-4 flex flex-col gap-4 border-t-3 border-border pt-4">
          <div>
            <p className="neo-tag text-secondary">Learn</p>
            <p className="mt-1 text-sm">{lesson.explanation}</p>
          </div>
          <div className="rounded-neo border-3 border-border bg-surface-sunken p-4">
            <p className="neo-tag text-secondary">Practice task</p>
            <p className="mt-1 text-sm">{lesson.practice_task}</p>
            <p className="mt-2 text-sm">
              <strong>Success criteria:</strong> {lesson.success_criteria}
            </p>
          </div>

          {error && <ErrorBanner message={error} />}

          <Textarea
            label="Your practice answer"
            helper="Write your response, then get instant feedback."
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            rows={5}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={evaluate}
              loading={evaluating}
              loadingText="Checking…"
            >
              Get feedback on my answer
            </Button>
            <Link href={`/tutor?lesson=${lesson.lesson_id}`}>
              <Button variant="ghost">Ask the tutor about this</Button>
            </Link>
          </div>

          {evaluation && (
            <div className="flex flex-col gap-3 rounded-neo border-3 border-border bg-surface-raised p-4 shadow-neo-sm">
              <Progress
                value={evaluation.score}
                label={`Practice score${evaluation.source === "ai" ? " (AI)" : " (rubric)"}`}
              />
              <p className="text-sm">{evaluation.feedback}</p>
              {evaluation.met_criteria ? (
                <SuccessBanner message="You met the success criteria - nice work!" />
              ) : (
                <p className="text-sm font-semibold text-warning">
                  Not quite there yet - revise and try again, or mark complete when ready.
                </p>
              )}
            </div>
          )}

          {completed ? (
            <SuccessBanner message="Lesson marked complete. It counts toward your progress." />
          ) : (
            <Button onClick={complete} loading={completing} loadingText="Saving…">
              Complete lesson
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
