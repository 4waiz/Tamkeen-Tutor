// Core domain types for SkillCompass UAE.
// These mirror the Supabase schema and are the single source of truth
// for entity shapes across server and client code.

export const GOALS = [
  "ai_basics",
  "coding_foundations",
  "english_communication",
  "university_readiness",
  "entrepreneurship_skills",
] as const;
export type Goal = (typeof GOALS)[number];

export const GOAL_LABELS: Record<Goal, string> = {
  ai_basics: "AI Basics",
  coding_foundations: "Coding Foundations",
  english_communication: "English Communication",
  university_readiness: "University Readiness",
  entrepreneurship_skills: "Entrepreneurship Skills",
};

export const LANGUAGES = ["english", "arabic", "bilingual"] as const;
export type LanguagePreference = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<LanguagePreference, string> = {
  english: "English",
  arabic: "Arabic",
  bilingual: "Bilingual",
};

export const ACCESSIBILITY_PREFS = [
  "simple_explanations",
  "more_examples",
  "voice_friendly_text",
  "high_contrast",
] as const;
export type AccessibilityPreference = (typeof ACCESSIBILITY_PREFS)[number];

export const ACCESSIBILITY_LABELS: Record<AccessibilityPreference, string> = {
  simple_explanations: "Simple explanations",
  more_examples: "More examples",
  voice_friendly_text: "Voice-friendly text",
  high_contrast: "High contrast",
};

export const AGE_RANGES = ["13-15", "16-18", "19-24", "25+"] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export interface Profile {
  id: string;
  full_name: string | null;
  age_range: string | null;
  language_preference: LanguagePreference;
  goal: Goal | null;
  confidence_level: number | null;
  accessibility_preference: AccessibilityPreference;
  onboarded: boolean;
  role: "learner" | "mentor";
  created_at: string;
  updated_at: string;
}

export interface DiagnosticOption {
  index: number;
  label: string;
}

export interface DiagnosticQuestion {
  id: string;
  skill_name: string;
  prompt: string;
  options: DiagnosticOption[];
  correct_index: number;
  explanation: string;
}

export interface SkillScore {
  skill_name: string;
  score: number; // 0-100
}

export interface ScoredAssessment {
  readiness_score: number; // 0-100 overall
  skill_scores: SkillScore[];
  answers: {
    question_id: string;
    skill_name: string;
    selected_index: number;
    correct: boolean;
  }[];
  weakest_skills: SkillScore[]; // up to 2
}

export interface LearningPathItem {
  lesson_id: string;
  day: number;
  title: string;
  target_skill: string;
  explanation: string;
  practice_task: string;
  success_criteria: string;
  estimated_time: string;
}

export interface LearningPath {
  id: string;
  goal: Goal;
  source: "ai" | "fallback";
  items: LearningPathItem[];
}

export interface TutorMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export interface PracticeEvaluation {
  score: number; // 0-100
  feedback: string;
  source: "ai" | "fallback";
  met_criteria: boolean;
}

export interface TutorContext {
  goal: Goal;
  language_preference: LanguagePreference;
  accessibility_preference: AccessibilityPreference;
  skill_scores: SkillScore[];
  lesson?: LearningPathItem;
}
