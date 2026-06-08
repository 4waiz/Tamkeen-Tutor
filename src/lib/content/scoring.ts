import type {
  DiagnosticQuestion,
  ScoredAssessment,
  SkillScore,
} from "@/lib/types";

export interface RawAnswer {
  question_id: string;
  selected_index: number;
}

/**
 * Scores a set of answers against the served questions.
 * - Each skill score is the % of its questions answered correctly.
 * - Overall readiness is the mean of the per-skill scores.
 * - Weakest skills are the lowest-scoring two.
 * Pure and deterministic — used by the assessment flow with or without AI.
 */
export function scoreAssessment(
  questions: DiagnosticQuestion[],
  answers: RawAnswer[],
): ScoredAssessment {
  const byId = new Map(questions.map((q) => [q.id, q]));

  // Tally correct/total per skill.
  const tally = new Map<string, { correct: number; total: number }>();
  const scoredAnswers: ScoredAssessment["answers"] = [];

  for (const q of questions) {
    const entry = tally.get(q.skill_name) ?? { correct: 0, total: 0 };
    entry.total += 1;
    tally.set(q.skill_name, entry);
  }

  for (const a of answers) {
    const q = byId.get(a.question_id);
    if (!q) continue;
    const correct = a.selected_index === q.correct_index;
    const entry = tally.get(q.skill_name)!;
    if (correct) entry.correct += 1;
    scoredAnswers.push({
      question_id: q.id,
      skill_name: q.skill_name,
      selected_index: a.selected_index,
      correct,
    });
  }

  const skill_scores: SkillScore[] = Array.from(tally.entries()).map(
    ([skill_name, { correct, total }]) => ({
      skill_name,
      score: total === 0 ? 0 : Math.round((correct / total) * 100),
    }),
  );

  const readiness_score =
    skill_scores.length === 0
      ? 0
      : Math.round(
          skill_scores.reduce((sum, s) => sum + s.score, 0) /
            skill_scores.length,
        );

  const weakest_skills = [...skill_scores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  return { readiness_score, skill_scores, answers: scoredAnswers, weakest_skills };
}
