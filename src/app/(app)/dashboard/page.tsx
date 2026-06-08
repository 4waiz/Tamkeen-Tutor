import Link from "next/link";
import { Button, Card, CardHeader, Badge, Progress, EmptyState } from "@/components/ui";
import { ScoreDonut, SkillScoreList, ProgressChart, Stat } from "@/components/charts";
import {
  getOnboardedProfile,
  getLatestAssessment,
  getLatestLearningPath,
  getCompletedLessonIds,
  getReadinessHistory,
} from "@/lib/data";
import { GOAL_LABELS } from "@/lib/types";
import { scoreBand } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const profile = await getOnboardedProfile();
  const [assessment, path, completed, history] = await Promise.all([
    getLatestAssessment(profile.id),
    getLatestLearningPath(profile.id),
    getCompletedLessonIds(profile.id),
    getReadinessHistory(profile.id),
  ]);

  const weakest = assessment
    ? [...assessment.skill_scores].sort((a, b) => a.score - b.score).slice(0, 2)
    : [];
  const weakNames = weakest.map((s) => s.skill_name);

  // Next lesson = first incomplete lesson in the path.
  const nextLesson = path?.items.find((i) => !completed.has(i.lesson_id));
  const doneCount = path
    ? path.items.filter((i) => completed.has(i.lesson_id)).length
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="neo-tag text-secondary">Dashboard</span>
          <h1 className="mt-1 text-2xl">
            Hi {profile.full_name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="mt-1 text-base text-ink-soft">
            Goal: <strong>{GOAL_LABELS[profile.goal!]}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/assessment">
            <Button variant="secondary">
              {assessment ? "Retake diagnostic" : "Start diagnostic"}
            </Button>
          </Link>
          {nextLesson && (
            <Link href={`/tutor?lesson=${nextLesson.lesson_id}`}>
              <Button>Continue learning</Button>
            </Link>
          )}
        </div>
      </div>

      {!assessment ? (
        <EmptyState
          icon="◎"
          title="Take your first diagnostic"
          description="Answer 8 quick questions so we can map your skill gaps and build your personalized 7-day plan."
          action={
            <Link href="/assessment">
              <Button size="lg">Start diagnostic</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Top row: readiness + what to do next */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center gap-3 lg:col-span-1">
              <ScoreDonut value={assessment.readiness_score} />
              <Badge
                tone={
                  assessment.readiness_score >= 70
                    ? "success"
                    : assessment.readiness_score >= 50
                      ? "warning"
                      : "danger"
                }
              >
                {scoreBand(assessment.readiness_score)}
              </Badge>
            </Card>

            <Card accent="primary" className="lg:col-span-2">
              <CardHeader
                tag="What to do next"
                title={
                  nextLesson
                    ? `Day ${nextLesson.day}: ${nextLesson.title}`
                    : path
                      ? "You've finished every lesson — retake the diagnostic to measure your gains!"
                      : "Generate your 7-day learning path"
                }
                description={
                  nextLesson
                    ? `Targets ${nextLesson.target_skill} · ${nextLesson.estimated_time}`
                    : undefined
                }
              />
              {nextLesson ? (
                <>
                  <p className="text-sm text-ink-soft">{nextLesson.explanation}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/tutor?lesson=${nextLesson.lesson_id}`}>
                      <Button>Open lesson with tutor</Button>
                    </Link>
                    <Link href="/learning-path">
                      <Button variant="ghost">See full plan</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link href="/learning-path">
                    <Button>
                      {path ? "Review my plan" : "Create my learning path"}
                    </Button>
                  </Link>
                  <Link href="/report">
                    <Button variant="ghost">View full report</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <Stat
                label="Weakest skill"
                value={weakest[0]?.skill_name ?? "—"}
                tone="danger"
              />
            </Card>
            <Card>
              <Stat
                label="Lessons completed"
                value={path ? `${doneCount} / ${path.items.length}` : "0 / 0"}
                tone="success"
              />
            </Card>
            <Card>
              <Stat
                label="Diagnostics taken"
                value={String(history.length)}
              />
            </Card>
          </div>

          {/* Skills + progress */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader tag="Skill breakdown" title="Where you stand" />
              <SkillScoreList scores={assessment.skill_scores} highlight={weakNames} />
            </Card>
            <Card>
              <CardHeader tag="Progress over time" title="Readiness trend" />
              <ProgressChart
                points={history.map((h) => ({
                  created_at: h.created_at,
                  readiness_score: h.readiness_score,
                }))}
              />
              {path && (
                <div className="mt-6">
                  <Progress
                    value={(doneCount / path.items.length) * 100}
                    label="7-day plan completion"
                    tone="primary"
                  />
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
