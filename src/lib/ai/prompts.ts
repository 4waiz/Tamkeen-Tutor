import "server-only";
import {
  GOAL_LABELS,
  LANGUAGE_LABELS,
  ACCESSIBILITY_LABELS,
  type Goal,
  type LanguagePreference,
  type AccessibilityPreference,
  type SkillScore,
  type LearningPathItem,
  type TutorContext,
} from "@/lib/types";

function a11yGuidance(pref: AccessibilityPreference): string {
  switch (pref) {
    case "simple_explanations":
      return "Use short sentences and plain words. Avoid jargon; define any term you must use.";
    case "more_examples":
      return "Teach with two concrete examples for every concept.";
    case "voice_friendly_text":
      return "Write in a natural spoken rhythm that reads well aloud. Avoid symbols, tables, and code blocks.";
    case "high_contrast":
      return "Be crisp and structured with clear headings and bullet points.";
  }
}

function langGuidance(lang: LanguagePreference): string {
  switch (lang) {
    case "english":
      return "Respond in clear English.";
    case "arabic":
      return "Respond in Modern Standard Arabic.";
    case "bilingual":
      return "Respond in English first, then give a short Arabic summary.";
  }
}

// ── Learning path ───────────────────────────────────────────────────
export function learningPathSystemPrompt(): string {
  return [
    "You are a curriculum designer for UAE youth (ages 13-24).",
    "You build practical, encouraging 7-day learning plans.",
    "All examples must relate to UAE youth life: school, university, careers, family, local context.",
    "Return ONLY a JSON object — no prose, no markdown fences.",
  ].join(" ");
}

export function learningPathUserPrompt(args: {
  goal: Goal;
  language: LanguagePreference;
  accessibility: AccessibilityPreference;
  weakestSkills: SkillScore[];
  allSkills: SkillScore[];
}): string {
  const weak = args.weakestSkills.map((s) => `${s.skill_name} (${s.score}%)`).join(", ");
  const all = args.allSkills.map((s) => `${s.skill_name}: ${s.score}%`).join("; ");
  return [
    `Goal: ${GOAL_LABELS[args.goal]}.`,
    `Learner language preference: ${LANGUAGE_LABELS[args.language]}.`,
    `Accessibility need: ${ACCESSIBILITY_LABELS[args.accessibility]}. ${a11yGuidance(args.accessibility)}`,
    `Skill scores: ${all}.`,
    `Prioritise the weakest skills first: ${weak || "none flagged — reinforce fundamentals"}.`,
    "",
    "Produce exactly 7 daily lessons. Each later day should build on earlier days.",
    'Return JSON shaped exactly as: {"items":[{"day":1,"title":"...","target_skill":"...","explanation":"...","practice_task":"...","success_criteria":"...","estimated_time":"20 min"}, ... 7 items]}.',
    "Keep explanation to 2-3 sentences. Practice task must be a concrete activity. Success criteria must be measurable.",
  ].join("\n");
}

// ── Tutor ───────────────────────────────────────────────────────────
export function tutorSystemPrompt(ctx: TutorContext): string {
  const skills = ctx.skill_scores
    .map((s) => `${s.skill_name}: ${s.score}%`)
    .join("; ");
  const lesson = ctx.lesson
    ? `Current lesson — "${ctx.lesson.title}" targeting ${ctx.lesson.target_skill}. Practice task: ${ctx.lesson.practice_task}`
    : "No specific lesson selected.";
  return [
    "You are SkillCompass, a friendly, sharp AI tutor for UAE youth.",
    `Learner goal: ${GOAL_LABELS[ctx.goal]}.`,
    langGuidance(ctx.language_preference),
    a11yGuidance(ctx.accessibility_preference),
    `Skill scores: ${skills || "not yet assessed"}.`,
    lesson,
    "",
    "Rules:",
    "- Be concise. Answer the question directly first.",
    "- Use one concrete example relevant to UAE youth (school, university, Dubai/Abu Dhabi life, careers).",
    "- End with exactly ONE short check-for-understanding question.",
    "- Never write long, vague, or generic answers. Aim for under 180 words.",
  ].join("\n");
}

// ── Practice evaluation ─────────────────────────────────────────────
export function practiceSystemPrompt(): string {
  return [
    "You are a fair, encouraging assessor for UAE youth learners.",
    "You grade a short practice submission against success criteria.",
    "Return ONLY a JSON object — no prose, no markdown fences.",
  ].join(" ");
}

export function practiceUserPrompt(args: {
  lesson: LearningPathItem;
  submission: string;
  language: LanguagePreference;
}): string {
  return [
    `Lesson: ${args.lesson.title} (skill: ${args.lesson.target_skill}).`,
    `Practice task: ${args.lesson.practice_task}`,
    `Success criteria: ${args.lesson.success_criteria}`,
    `${langGuidance(args.language)}`,
    "",
    "Learner submission:",
    args.submission,
    "",
    'Return JSON: {"score": <0-100 integer>, "met_criteria": <true|false>, "feedback": "<2-4 sentences: one strength, one specific improvement, one next step>"}.',
  ].join("\n");
}
