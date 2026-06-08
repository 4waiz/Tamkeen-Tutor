import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { assessmentSubmissionSchema } from "@/lib/validation";
import { generateDiagnosticQuestions } from "@/lib/content/diagnostics";
import { scoreAssessment } from "@/lib/content/scoring";
import type { Goal } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/submit-assessment
 * Receives the learner's answers, scores them server-side (answer keys
 * never leave the server), and persists the assessment, answers, and
 * per-skill scores. Returns the scored result.
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
  const parsed = assessmentSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const profile = await getProfile();
  const goal = parsed.data.goal as Goal;

  // The goal must match the learner's profile to keep scoring honest.
  if (profile.goal && profile.goal !== goal) {
    return NextResponse.json(
      { error: "Goal mismatch with your profile." },
      { status: 400 },
    );
  }

  const questions = generateDiagnosticQuestions(goal);
  const result = scoreAssessment(questions, parsed.data.answers);

  // Snapshot the questions (without answer keys) into the assessment record.
  const snapshot = questions.map(({ correct_index, explanation, ...q }) => q);

  const { data: assessment, error: aErr } = await supabase
    .from("assessments")
    .insert({
      user_id: user.id,
      goal,
      readiness_score: result.readiness_score,
      questions: snapshot,
    })
    .select("id")
    .single();

  if (aErr || !assessment) {
    return NextResponse.json(
      { error: "Could not save assessment." },
      { status: 500 },
    );
  }

  const answerRows = result.answers.map((a) => ({
    assessment_id: assessment.id,
    user_id: user.id,
    question_id: a.question_id,
    skill_name: a.skill_name,
    selected_index: a.selected_index,
    correct: a.correct,
  }));
  const scoreRows = result.skill_scores.map((s) => ({
    assessment_id: assessment.id,
    user_id: user.id,
    skill_name: s.skill_name,
    score: s.score,
  }));

  const [{ error: ansErr }, { error: scoreErr }] = await Promise.all([
    supabase.from("assessment_answers").insert(answerRows),
    supabase.from("skill_scores").insert(scoreRows),
  ]);

  if (ansErr || scoreErr) {
    return NextResponse.json(
      { error: "Could not save answers." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    assessment_id: assessment.id,
    readiness_score: result.readiness_score,
    skill_scores: result.skill_scores,
    weakest_skills: result.weakest_skills,
  });
}
