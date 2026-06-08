import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getLatestLearningPath } from "@/lib/data";
import { practiceRequestSchema, aiPracticeEvalSchema } from "@/lib/validation";
import { chat, extractJson, aiEnabled } from "@/lib/ai/provider";
import { practiceSystemPrompt, practiceUserPrompt } from "@/lib/ai/prompts";
import { evaluatePracticeFallback } from "@/lib/content/practice";
import type { PracticeEvaluation } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/evaluate-practice
 * Grades a learner's practice submission against the lesson's success
 * criteria, persists the submission + feedback, and returns the evaluation.
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
  const parsed = practiceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }
  const { lesson_id, submission } = parsed.data;

  const profile = await getProfile();
  const path = await getLatestLearningPath(user.id);
  const lesson = path?.items.find((i) => i.lesson_id === lesson_id);

  if (!lesson) {
    return NextResponse.json(
      { error: "Lesson not found in your learning path." },
      { status: 404 },
    );
  }

  let evaluation: PracticeEvaluation | null = null;

  if (aiEnabled()) {
    const raw = await chat(
      [
        { role: "system", content: practiceSystemPrompt() },
        {
          role: "user",
          content: practiceUserPrompt({
            lesson,
            submission,
            language: profile.language_preference,
          }),
        },
      ],
      { json: true, temperature: 0.3, maxTokens: 400 },
    );
    if (raw) {
      const json = extractJson(raw);
      const valid = aiPracticeEvalSchema.safeParse(json);
      if (valid.success) {
        evaluation = {
          score: Math.round(valid.data.score),
          feedback: valid.data.feedback,
          met_criteria: valid.data.met_criteria,
          source: "ai",
        };
      }
    }
  }

  if (!evaluation) {
    evaluation = evaluatePracticeFallback(lesson, submission);
  }

  await supabase.from("lesson_submissions").insert({
    user_id: user.id,
    lesson_id,
    submission,
    feedback: evaluation.feedback,
    score: evaluation.score,
    source: evaluation.source,
  });

  return NextResponse.json(evaluation);
}
