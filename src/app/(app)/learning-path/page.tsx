import Link from "next/link";
import {
  Button,
  Card,
  CardHeader,
  Badge,
  Progress,
  EmptyState,
} from "@/components/ui";
import { GeneratePathButton } from "@/components/GeneratePathButton";
import {
  getOnboardedProfile,
  getLatestAssessment,
  getLatestLearningPath,
  getCompletedLessonIds,
  getLatestSubmissions,
} from "@/lib/data";
import { GOAL_LABELS } from "@/lib/types";
import { LessonCard } from "./LessonCard";

export const dynamic = "force-dynamic";

export default async function LearningPathPage() {
  const profile = await getOnboardedProfile();
  const [assessment, path, completed, submissions] = await Promise.all([
    getLatestAssessment(profile.id),
    getLatestLearningPath(profile.id),
    getCompletedLessonIds(profile.id),
    getLatestSubmissions(profile.id),
  ]);

  if (!assessment) {
    return (
      <EmptyState
        icon="◎"
        title="Take the diagnostic first"
        description="Your learning path is built from your skill-gap results, so start with the diagnostic."
        action={
          <Link href="/assessment">
            <Button size="lg">Start diagnostic</Button>
          </Link>
        }
      />
    );
  }

  if (!path) {
    return (
      <div className="mx-auto max-w-xl">
        <span className="neo-tag text-secondary">Learning path</span>
        <h1 className="mt-1 text-2xl">Build your 7-day plan</h1>
        <p className="mt-1 text-base text-ink-soft">
          We&apos;ll create a personalized plan from your diagnostic, starting
          with your weakest skills. Uses AI when configured, otherwise a smart
          local generator.
        </p>
        <Card className="mt-6">
          <GeneratePathButton />
        </Card>
      </div>
    );
  }

  const doneCount = path.items.filter((i) => completed.has(i.lesson_id)).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="neo-tag text-secondary">
            7-day plan · {GOAL_LABELS[path.goal]}
          </span>
          <h1 className="mt-1 text-2xl">Your learning path</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge tone={path.source === "ai" ? "secondary" : "neutral"}>
              {path.source === "ai" ? "AI-generated" : "Smart fallback"}
            </Badge>
          </div>
        </div>
        <GeneratePathButton label="Regenerate plan" regenerate />
      </div>

      <Card accent="primary">
        <Progress
          value={(doneCount / path.items.length) * 100}
          label={`Progress — ${doneCount} of ${path.items.length} lessons complete`}
          tone="primary"
        />
      </Card>

      <ol className="flex flex-col gap-4">
        {path.items.map((lesson) => (
          <LessonCard
            key={lesson.lesson_id}
            lesson={lesson}
            completed={completed.has(lesson.lesson_id)}
            priorSubmission={submissions.get(lesson.lesson_id)}
          />
        ))}
      </ol>
    </div>
  );
}
