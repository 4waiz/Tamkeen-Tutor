import type { LearningPathItem, PracticeEvaluation } from "@/lib/types";

/**
 * Deterministic rubric-based evaluation used when AI mode is unavailable.
 * Scores effort signals (length, structure, keyword overlap with the
 * success criteria) and returns specific, encouraging feedback.
 */
export function evaluatePracticeFallback(
  lesson: LearningPathItem,
  submission: string,
): PracticeEvaluation {
  const text = submission.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Signal 1: enough effort to evaluate.
  const lengthScore = clampScore(Math.round((wordCount / 40) * 40)); // up to 40

  // Signal 2: overlap with key words from the success criteria + task.
  const keywords = extractKeywords(
    `${lesson.success_criteria} ${lesson.practice_task} ${lesson.target_skill}`,
  );
  const lower = text.toLowerCase();
  const hits = keywords.filter((k) => lower.includes(k)).length;
  const relevanceScore =
    keywords.length === 0 ? 30 : Math.round((hits / keywords.length) * 40); // up to 40

  // Signal 3: structure (multiple sentences / list items shows organised thought).
  const sentences = text.split(/[.!?\n]+/).filter((s) => s.trim().length > 0);
  const structureScore = clampScore(Math.min(sentences.length, 4) * 5); // up to 20

  const score = clampScore(lengthScore + relevanceScore + structureScore);
  const met_criteria = score >= 60;

  const strengths: string[] = [];
  if (wordCount >= 30) strengths.push("you gave a full, detailed answer");
  if (hits > 0) strengths.push("you connected it to the lesson's goal");
  if (sentences.length >= 2) strengths.push("your answer is clearly organised");
  const strength = strengths[0] ?? "you made a genuine attempt";

  const improvements: string[] = [];
  if (wordCount < 30)
    improvements.push("add more detail - aim for at least a few full sentences");
  if (hits < Math.max(1, Math.ceil(keywords.length / 2)))
    improvements.push(
      `tie your answer more closely to the success criteria: "${lesson.success_criteria}"`,
    );
  if (sentences.length < 2)
    improvements.push("break your answer into a few clear points");
  const improvement =
    improvements[0] ?? "push for one extra concrete example to make it stronger";

  const feedback = [
    `Strength: ${capitalise(strength)}.`,
    `To improve: ${improvement}.`,
    met_criteria
      ? "Next step: you've met the criteria - mark the lesson complete and move on."
      : "Next step: revise using the tip above, then submit again.",
    "(Rubric mode - add an AI key for tailored feedback.)",
  ].join(" ");

  return { score, feedback, met_criteria, source: "fallback" };
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "to", "of", "in", "on", "for", "your", "you",
  "with", "at", "is", "are", "be", "it", "that", "this", "as", "by", "one",
  "two", "three", "least", "your", "will", "can", "least", "they", "their",
]);

function extractKeywords(text: string): string[] {
  const seen = new Set<string>();
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
    .filter((w) => (seen.has(w) ? false : (seen.add(w), true)))
    .slice(0, 8);
}
