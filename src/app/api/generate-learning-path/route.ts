import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getLatestAssessment } from "@/lib/data";
import { generatePathRequestSchema } from "@/lib/validation";
import { aiLearningPathSchema } from "@/lib/validation";
import { chat, extractJson, aiEnabled } from "@/lib/ai/provider";
import {
  learningPathSystemPrompt,
  learningPathUserPrompt,
} from "@/lib/ai/prompts";
import { generateFallbackLearningPath } from "@/lib/content/learning-path";
import type { Goal, LearningPathItem, SkillScore } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/generate-learning-path
 * Generates a 7-day plan from the learner's latest assessment, then
 * persists it. Uses AI when a key is configured, otherwise deterministic
 * fallback. Never crashes the client - falls back on any AI failure.
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
  const parsed = generatePathRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const profile = await getProfile();
  const assessment = await getLatestAssessment(user.id);

  if (!profile.goal) {
    return NextResponse.json(
      { error: "Complete onboarding first." },
      { status: 400 },
    );
  }
  if (!assessment) {
    return NextResponse.json(
      { error: "Take the diagnostic assessment first." },
      { status: 400 },
    );
  }

  const goal = profile.goal as Goal;
  const skills: SkillScore[] = assessment.skill_scores;
  const weakest = [...skills].sort((a, b) => a.score - b.score).slice(0, 2);

  // ── Try AI, fall back deterministically ──
  let items: LearningPathItem[] | null = null;
  let source: "ai" | "fallback" = "fallback";

  if (aiEnabled()) {
    const raw = await chat(
      [
        { role: "system", content: learningPathSystemPrompt() },
        {
          role: "user",
          content: learningPathUserPrompt({
            goal,
            language: profile.language_preference,
            accessibility: profile.accessibility_preference,
            weakestSkills: weakest,
            allSkills: skills,
          }),
        },
      ],
      { json: true, temperature: 0.5, maxTokens: 1800 },
    );

    if (raw) {
      const json = extractJson(raw);
      const valid = aiLearningPathSchema.safeParse(json);
      if (valid.success) {
        items = valid.data.items.map((it) => ({
          ...it,
          lesson_id: `${goal}-ai-d${it.day}`,
        }));
        source = "ai";
      }
    }
  }

  if (!items) {
    items = generateFallbackLearningPath(goal, weakest);
    source = "fallback";
  }

  // ── Persist (replace any previous path for a clean slate) ──
  await supabase.from("learning_paths").delete().eq("user_id", user.id);

  const { data: path, error: pathErr } = await supabase
    .from("learning_paths")
    .insert({
      user_id: user.id,
      assessment_id: assessment.id,
      goal,
      source,
    })
    .select("id")
    .single();

  if (pathErr || !path) {
    return NextResponse.json(
      { error: "Could not save learning path." },
      { status: 500 },
    );
  }

  const rows = items.map((it) => ({
    learning_path_id: path.id,
    user_id: user.id,
    lesson_id: it.lesson_id,
    day: it.day,
    title: it.title,
    target_skill: it.target_skill,
    explanation: it.explanation,
    practice_task: it.practice_task,
    success_criteria: it.success_criteria,
    estimated_time: it.estimated_time,
  }));

  const { error: itemsErr } = await supabase
    .from("learning_path_items")
    .insert(rows);

  if (itemsErr) {
    return NextResponse.json(
      { error: "Could not save lessons." },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: path.id, source, items });
}
