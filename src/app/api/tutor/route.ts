import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getLatestAssessment, getLatestLearningPath } from "@/lib/data";
import { tutorRequestSchema } from "@/lib/validation";
import { chat, aiEnabled } from "@/lib/ai/provider";
import { tutorSystemPrompt } from "@/lib/ai/prompts";
import { generateFallbackTutorReply } from "@/lib/content/tutor";
import type { Goal, TutorContext } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/tutor
 * Answers a learner question with full context (goal, language, skills,
 * current lesson). Persists both the user message and the reply.
 */
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = tutorRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }
  const { question, lesson_id } = parsed.data;

  const profile = await getProfile();
  if (!profile.goal) {
    return NextResponse.json(
      { error: "Complete onboarding first." },
      { status: 400 },
    );
  }

  const assessment = await getLatestAssessment(user.id);
  const path = await getLatestLearningPath(user.id);
  const lesson = lesson_id
    ? path?.items.find((i) => i.lesson_id === lesson_id)
    : undefined;

  const ctx: TutorContext = {
    goal: profile.goal as Goal,
    language_preference: profile.language_preference,
    accessibility_preference: profile.accessibility_preference,
    skill_scores: assessment?.skill_scores ?? [],
    lesson,
  };

  // Persist the user's message first.
  await supabase.from("tutor_messages").insert({
    user_id: user.id,
    lesson_id: lesson_id ?? null,
    role: "user",
    content: question,
  });

  let reply: string | null = null;
  let source: "ai" | "fallback" = "fallback";

  if (aiEnabled()) {
    // Replay recent history for this lesson so the tutor has continuity.
    const historyBase = supabase
      .from("tutor_messages")
      .select("role, content")
      .eq("user_id", user.id);
    const { data: history } = await (lesson_id
      ? historyBase.eq("lesson_id", lesson_id)
      : historyBase.is("lesson_id", null)
    )
      .order("created_at", { ascending: false })
      .limit(8);

    const recent = (history ?? [])
      .reverse()
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    reply = await chat(
      [{ role: "system", content: tutorSystemPrompt(ctx) }, ...recent],
      { temperature: 0.5, maxTokens: 500 },
    );
    if (reply) source = "ai";
  }

  if (!reply) {
    reply = generateFallbackTutorReply(ctx, question);
    source = "fallback";
  }

  await supabase.from("tutor_messages").insert({
    user_id: user.id,
    lesson_id: lesson_id ?? null,
    role: "assistant",
    content: reply,
  });

  return NextResponse.json({ reply, source });
}
