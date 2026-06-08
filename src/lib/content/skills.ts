import type { Goal } from "@/lib/types";

/**
 * Skill categories per goal. The diagnostic, scoring, report and
 * learning-path generators all key off these.
 */
export const SKILLS_BY_GOAL: Record<Goal, string[]> = {
  ai_basics: [
    "AI Concepts",
    "Data Basics",
    "Prompting",
    "Ethics & Safety",
    "Real-World Application",
  ],
  coding_foundations: [
    "Variables & Types",
    "Control Flow",
    "Functions",
    "Debugging",
    "Problem Solving",
  ],
  english_communication: [
    "Vocabulary",
    "Grammar",
    "Speaking Confidence",
    "Reading Comprehension",
    "Writing Clarity",
  ],
  university_readiness: [
    "Study Skills",
    "Critical Thinking",
    "Application Writing",
    "Time Management",
    "Research Skills",
  ],
  entrepreneurship_skills: [
    "Idea Validation",
    "Customer Understanding",
    "Financial Basics",
    "Pitching",
    "Execution & Planning",
  ],
};
