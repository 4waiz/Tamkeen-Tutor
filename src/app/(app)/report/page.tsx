import Link from "next/link";
import {
  Button,
  Card,
  CardHeader,
  Badge,
  EmptyState,
} from "@/components/ui";
import { ScoreDonut, ProgressChart, Stat } from "@/components/charts";
import { GeneratePathButton } from "@/components/GeneratePathButton";
import {
  getOnboardedProfile,
  getLatestAssessment,
  getLatestLearningPath,
  getReadinessHistory,
} from "@/lib/data";
import { GOAL_LABELS } from "@/lib/types";
import { scoreBand, scoreStatus, formatDate } from "@/lib/utils";
import { pathHeadline } from "@/lib/content/learning-path";

export const dynamic = "force-dynamic";

const TONE_BADGE: Record<"success" | "warning" | "danger", "success" | "warning" | "danger"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
};

export default async function ReportPage() {
  const profile = await getOnboardedProfile();
  const [assessment, path, history] = await Promise.all([
    getLatestAssessment(profile.id),
    getLatestLearningPath(profile.id),
    getReadinessHistory(profile.id),
  ]);

  if (!assessment) {
    return (
      <EmptyState
        icon="◎"
        title="No report yet"
        description="Take the diagnostic assessment and we'll build your skill-gap report here."
        action={
          <Link href="/assessment">
            <Button size="lg">Start diagnostic</Button>
          </Link>
        }
      />
    );
  }

  const sorted = [...assessment.skill_scores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 2);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="neo-tag text-secondary">
            Skill-gap report · {GOAL_LABELS[assessment.goal]}
          </span>
          <h1 className="mt-1 text-2xl">Your readiness breakdown</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Based on your diagnostic from {formatDate(assessment.created_at)}.
          </p>
        </div>
        <Link href="/assessment">
          <Button variant="secondary">Retake diagnostic</Button>
        </Link>
      </div>

      {/* Overall + weakest + next */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-3">
          <ScoreDonut value={assessment.readiness_score} />
          <Badge tone={TONE_BADGE[scoreStatus(assessment.readiness_score)]}>
            {scoreBand(assessment.readiness_score)}
          </Badge>
        </Card>

        <Card accent="secondary" className="lg:col-span-2">
          <CardHeader tag="Focus first" title="Your 2 weakest skills" />
          <div className="grid gap-3 sm:grid-cols-2">
            {weakest.map((s) => (
              <div
                key={s.skill_name}
                className="rounded-neo border-3 border-border bg-surface px-4 py-3 shadow-neo-sm"
              >
                <p className="font-semibold">{s.skill_name}</p>
                <p className="font-display text-2xl font-extrabold text-danger">
                  {s.score}%
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-neo border-3 border-border bg-primary px-4 py-3 text-sm font-semibold text-primary-fg">
            {pathHeadline(assessment.goal, weakest)}
          </p>
          <div className="mt-4">
            {path ? (
              <Link href="/learning-path">
                <Button>Open my learning path</Button>
              </Link>
            ) : (
              <GeneratePathButton />
            )}
          </div>
        </Card>
      </div>

      {/* All skill category cards */}
      <Card>
        <CardHeader
          tag="All skills"
          title="Every skill category, scored"
          description="Each score is the share of that skill's questions you got right."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((s) => {
            const status = scoreStatus(s.score);
            return (
              <div
                key={s.skill_name}
                className="rounded-neo border-3 border-border bg-surface-raised p-4 shadow-neo-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{s.skill_name}</p>
                  <Badge tone={TONE_BADGE[status]}>{scoreBand(s.score)}</Badge>
                </div>
                <p className="mt-2 font-display text-2xl font-extrabold">
                  {s.score}%
                </p>
                <div className="mt-2 h-3 rounded-neo-sm border-3 border-border bg-surface-sunken">
                  <div
                    className={`h-full border-r-3 border-border ${
                      status === "success"
                        ? "bg-success"
                        : status === "warning"
                          ? "bg-warning"
                          : "bg-danger"
                    }`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* What to do next + progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card accent="primary">
          <CardHeader tag="What to do next" title="Your action plan" />
          <ol className="flex list-inside list-decimal flex-col gap-2 text-sm">
            <li>
              Start with your weakest skill:{" "}
              <strong>{weakest[0]?.skill_name}</strong>.
            </li>
            <li>
              {path
                ? "Work through your 7-day plan, one lesson per day."
                : "Generate your personalized 7-day plan above."}
            </li>
            <li>Ask the AI tutor whenever you&apos;re stuck on a lesson.</li>
            <li>Submit practice work to get feedback and mark lessons complete.</li>
            <li>Retake the diagnostic in a week to measure your progress.</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/learning-path">
              <Button variant={path ? "primary" : "ghost"}>
                {path ? "Go to learning path" : "Learning path"}
              </Button>
            </Link>
            <Link href="/tutor">
              <Button variant="secondary">Ask the tutor</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <CardHeader tag="Progress over time" title="Readiness trend" />
          <ProgressChart
            points={history.map((h) => ({
              created_at: h.created_at,
              readiness_score: h.readiness_score,
            }))}
          />
          <div className="mt-4 flex gap-6">
            <Stat label="Latest" value={`${assessment.readiness_score}%`} />
            <Stat label="Diagnostics" value={String(history.length)} />
          </div>
        </Card>
      </div>
    </div>
  );
}
