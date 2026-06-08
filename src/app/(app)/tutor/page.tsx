import Link from "next/link";
import { Card, CardHeader, Badge, EmptyState, Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import {
  getOnboardedProfile,
  getLatestLearningPath,
  getCompletedLessonIds,
} from "@/lib/data";
import { aiEnabled } from "@/lib/ai/provider";
import type { TutorMessage } from "@/lib/types";
import { TutorChat } from "./TutorChat";

export const dynamic = "force-dynamic";

export default async function TutorPage({
  searchParams,
}: {
  searchParams: { lesson?: string };
}) {
  const profile = await getOnboardedProfile();
  const lessonId = searchParams.lesson;

  const [path, completed] = await Promise.all([
    getLatestLearningPath(profile.id),
    getCompletedLessonIds(profile.id),
  ]);

  const lesson = lessonId
    ? path?.items.find((i) => i.lesson_id === lessonId)
    : undefined;

  // Load prior conversation for this lesson (or general thread).
  const supabase = createClient();
  const baseQuery = supabase
    .from("tutor_messages")
    .select("role, content, created_at")
    .eq("user_id", profile.id);
  const { data: history } = await (lessonId
    ? baseQuery.eq("lesson_id", lessonId)
    : baseQuery.is("lesson_id", null)
  )
    .order("created_at", { ascending: true })
    .limit(50);

  const initialMessages: TutorMessage[] = (history ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <span className="neo-tag text-secondary">Tutor</span>
        <h1 className="mb-4 mt-1 text-2xl">Ask your AI tutor</h1>
        <TutorChat
          lessonId={lessonId}
          lessonTitle={lesson?.title}
          initialMessages={initialMessages}
        />
      </div>

      <aside className="flex flex-col gap-4">
        {!aiEnabled() && (
          <Card className="bg-surface-sunken">
            <Badge tone="warning">Fallback mode</Badge>
            <p className="mt-2 text-sm text-ink-soft">
              No AI key configured — the tutor gives structured, guided
              fallback replies. Add <code className="font-mono">AI_API_KEY</code>{" "}
              for live answers.
            </p>
          </Card>
        )}

        <Card>
          <CardHeader tag="Lessons" title="Pick a lesson for context" />
          {!path ? (
            <EmptyState
              icon="◎"
              title="No lessons yet"
              description="Generate your learning path to chat with full lesson context."
              action={
                <Link href="/learning-path">
                  <Button>Create learning path</Button>
                </Link>
              }
            />
          ) : (
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/tutor"
                  className={`block rounded-neo-sm border-3 border-border px-3 py-2 text-sm font-semibold shadow-neo-sm ${
                    !lessonId ? "bg-primary text-primary-fg" : "bg-surface-raised"
                  }`}
                >
                  General coaching
                </Link>
              </li>
              {path.items.map((l) => (
                <li key={l.lesson_id}>
                  <Link
                    href={`/tutor?lesson=${l.lesson_id}`}
                    className={`flex items-center justify-between gap-2 rounded-neo-sm border-3 border-border px-3 py-2 text-sm font-semibold shadow-neo-sm ${
                      lessonId === l.lesson_id
                        ? "bg-primary text-primary-fg"
                        : "bg-surface-raised"
                    }`}
                  >
                    <span>
                      Day {l.day}: {l.title}
                    </span>
                    {completed.has(l.lesson_id) && <span aria-label="complete">✓</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </aside>
    </div>
  );
}
