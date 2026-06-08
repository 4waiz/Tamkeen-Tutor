import { GOAL_LABELS, type TutorContext } from "@/lib/types";

/**
 * Deterministic tutor reply used when AI mode is unavailable.
 * It still personalises using the learner's goal, lesson, and skills, and
 * always ends with one check-for-understanding question - matching the
 * behaviour contract of the AI tutor.
 */
export function generateFallbackTutorReply(
  ctx: TutorContext,
  question: string,
): string {
  const goalLabel = GOAL_LABELS[ctx.goal];
  const weakest = [...ctx.skill_scores].sort((a, b) => a.score - b.score)[0];

  const lines: string[] = [];

  if (ctx.lesson) {
    lines.push(
      `Good question about "${ctx.lesson.title}". This lesson builds your ${ctx.lesson.target_skill}.`,
    );
    lines.push(
      `In plain terms: ${ctx.lesson.explanation}`,
    );
    lines.push(
      `Try this now - ${ctx.lesson.practice_task} You'll know you've got it when: ${ctx.lesson.success_criteria}`,
    );
  } else {
    lines.push(
      `Let's connect this to your goal of ${goalLabel}.`,
    );
    if (weakest) {
      lines.push(
        `Right now your weakest area is ${weakest.skill_name} (${weakest.score}%), so that's worth focusing on first.`,
      );
    }
    lines.push(
      "Break your question into one small step you can practise today, then check your result against a clear, simple example.",
    );
  }

  // UAE-contextual example.
  lines.push(
    "For example, think about how a student in Dubai or Abu Dhabi would use this in a real class project or part-time job.",
  );

  lines.push(
    "(AI tutor mode is off, so this is a guided fallback. Add an AI_API_KEY in your environment for live, tailored answers.)",
  );

  // Always one follow-up check-for-understanding question.
  lines.push(
    `Quick check: can you tell me, in one sentence, how you'd apply this to your own ${goalLabel} work?`,
  );

  // Lightly acknowledge the actual question so the reply feels responsive.
  const trimmed = question.trim();
  if (trimmed) {
    lines.unshift(`You asked: "${trimmed}".`);
  }

  return lines.join("\n\n");
}
