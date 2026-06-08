import {
  GOAL_LABELS,
  type Goal,
  type LearningPathItem,
  type SkillScore,
} from "@/lib/types";
import { SKILLS_BY_GOAL } from "./skills";

/**
 * Per-skill lesson templates. The fallback generator picks lessons that
 * target the learner's weakest skills first, then fills the week with the
 * remaining skills, producing a coherent, UAE-contextual 7-day plan.
 */
type Template = Omit<LearningPathItem, "day" | "lesson_id">;

const LESSONS: Record<string, Template> = {
  // ── AI Basics ──
  "AI Concepts": {
    title: "What AI actually is (and is not)",
    target_skill: "AI Concepts",
    explanation:
      "AI systems learn patterns from data instead of following hand-written rules. Today you will tell the difference between a normal program and an AI one.",
    practice_task:
      "List 3 apps you use in the UAE (e.g. a delivery app, a maps app, a chatbot) and write one sentence on whether each uses AI and why.",
    success_criteria:
      "You correctly identify at least 2 of the 3 and explain the reason in your own words.",
    estimated_time: "20 min",
  },
  "Data Basics": {
    title: "Why data is the fuel of AI",
    target_skill: "Data Basics",
    explanation:
      "A model is only as good as its data. You will learn what a dataset is and why biased data causes biased results.",
    practice_task:
      "Describe a dataset you could collect about your school (e.g. canteen orders). List one way it could be biased.",
    success_criteria: "You define the dataset's rows and name one realistic source of bias.",
    estimated_time: "20 min",
  },
  Prompting: {
    title: "Writing prompts that get real answers",
    target_skill: "Prompting",
    explanation:
      "Specific prompts beat vague ones. You will rewrite weak prompts to include audience, format, and goal.",
    practice_task:
      "Take the prompt 'help me study' and rewrite it into a strong prompt for revising for a UAE biology exam.",
    success_criteria: "Your rewritten prompt names the topic, audience level, and output format.",
    estimated_time: "15 min",
  },
  "Ethics & Safety": {
    title: "Using AI honestly and safely",
    target_skill: "Ethics & Safety",
    explanation:
      "AI can be wrong and can mishandle private data. You will set personal rules for honest, safe use at school.",
    practice_task:
      "Write 3 rules for using AI on schoolwork that keep you honest and protect your privacy.",
    success_criteria: "Your rules cover verifying facts, doing your own work, and not sharing personal data.",
    estimated_time: "15 min",
  },
  "Real-World Application": {
    title: "AI for your goals",
    target_skill: "Real-World Application",
    explanation:
      "AI is most useful when aimed at a real goal. You will design one responsible way to use AI for your studies or future career.",
    practice_task:
      "Plan how you would use an AI tutor to improve one subject over a month. Include what you would ask and how you'd check it helped.",
    success_criteria: "Your plan has a clear goal, a weekly action, and a way to measure progress.",
    estimated_time: "25 min",
  },

  // ── Coding Foundations ──
  "Variables & Types": {
    title: "Storing values with variables",
    target_skill: "Variables & Types",
    explanation:
      "Variables are named containers for values, and each value has a type (number, text, true/false). Today you'll name and use a few.",
    practice_task:
      "Write down 4 variables for a profile (name, age, city, isStudent) and label each value's type.",
    success_criteria: "All 4 variables have a sensible name and the correct type label.",
    estimated_time: "20 min",
  },
  "Control Flow": {
    title: "Making decisions with if and loops",
    target_skill: "Control Flow",
    explanation:
      "Programs choose paths with if-statements and repeat work with loops. You'll trace how a condition decides what runs.",
    practice_task:
      "In plain language, write the logic: if a student's score is 50 or more, print 'Pass', otherwise 'Try again'. Then describe looping it over 5 students.",
    success_criteria: "Your logic handles both the pass and fail case and repeats correctly.",
    estimated_time: "25 min",
  },
  Functions: {
    title: "Reusing logic with functions",
    target_skill: "Functions",
    explanation:
      "Functions wrap reusable logic under a name and take inputs (parameters). You'll design one to avoid repeating yourself.",
    practice_task:
      "Design a function 'greet(name)' in plain language and show what it returns for two different names.",
    success_criteria: "Your function uses the parameter and produces different correct outputs.",
    estimated_time: "20 min",
  },
  Debugging: {
    title: "Reading errors and fixing bugs",
    target_skill: "Debugging",
    explanation:
      "Error messages point to the file and line. You'll learn a calm, step-by-step way to find and fix a bug.",
    practice_task:
      "Write a 4-step checklist you'll follow the next time your code shows an error message.",
    success_criteria: "Your checklist includes reading the message, locating the line, and testing the fix.",
    estimated_time: "15 min",
  },
  "Problem Solving": {
    title: "Breaking big problems into steps",
    target_skill: "Problem Solving",
    explanation:
      "Good programmers decompose problems. You'll split one task into small, solvable steps before writing any code.",
    practice_task:
      "Pick a task (e.g. 'build a quiz app') and break it into at least 5 ordered steps.",
    success_criteria: "Your steps are ordered, specific, and each could be built and tested alone.",
    estimated_time: "25 min",
  },

  // ── English Communication ──
  Vocabulary: {
    title: "Growing your everyday word power",
    target_skill: "Vocabulary",
    explanation:
      "Strong vocabulary makes you clearer. You'll learn synonyms and use new words in real sentences.",
    practice_task:
      "Learn 5 new words and write a sentence for each about life in the UAE.",
    success_criteria: "All 5 words are used correctly and naturally in your sentences.",
    estimated_time: "20 min",
  },
  Grammar: {
    title: "Getting tenses right",
    target_skill: "Grammar",
    explanation:
      "Clear tenses prevent confusion. You'll practise present and past tense in short sentences.",
    practice_task:
      "Write 3 sentences in present tense and 3 in past tense about your week at school.",
    success_criteria: "All 6 sentences use the correct verb form for their tense.",
    estimated_time: "20 min",
  },
  "Speaking Confidence": {
    title: "Speaking up with confidence",
    target_skill: "Speaking Confidence",
    explanation:
      "Confidence grows from preparation. You'll plan and rehearse a short spoken introduction.",
    practice_task:
      "Prepare a 60-second spoken introduction about yourself and your goal, then say it aloud twice.",
    success_criteria: "Your intro has 3 clear points and you can deliver it without reading word-for-word.",
    estimated_time: "20 min",
  },
  "Reading Comprehension": {
    title: "Finding the main idea",
    target_skill: "Reading Comprehension",
    explanation:
      "Strong readers spot the main idea and supporting details. You'll practise on a short text.",
    practice_task:
      "Read any short news article about the UAE and write the main idea in one sentence plus two supporting details.",
    success_criteria: "Your main idea is accurate and the two details genuinely support it.",
    estimated_time: "20 min",
  },
  "Writing Clarity": {
    title: "Writing clear, short sentences",
    target_skill: "Writing Clarity",
    explanation:
      "Clear writing uses fewer words to say more. You'll cut clutter from wordy sentences.",
    practice_task:
      "Take a long, wordy sentence and rewrite it twice to make it shorter and clearer.",
    success_criteria: "Your final version keeps the meaning while removing unnecessary words.",
    estimated_time: "15 min",
  },

  // ── University Readiness ──
  "Study Skills": {
    title: "Studying so it sticks",
    target_skill: "Study Skills",
    explanation:
      "Spaced practice and self-testing beat cramming. You'll build a small revision routine.",
    practice_task:
      "Make a 3-day spaced revision plan for one subject, with a short self-test each day.",
    success_criteria: "Your plan spaces the topic over 3 days and includes testing yourself.",
    estimated_time: "25 min",
  },
  "Critical Thinking": {
    title: "Questioning what you read",
    target_skill: "Critical Thinking",
    explanation:
      "Critical thinkers check sources and evidence. You'll evaluate a claim and find a counter-argument.",
    practice_task:
      "Pick a claim you saw online, check its source, and write one counter-argument.",
    success_criteria: "You note the source's reliability and give a reasoned counter-argument.",
    estimated_time: "20 min",
  },
  "Application Writing": {
    title: "Writing a standout personal statement",
    target_skill: "Application Writing",
    explanation:
      "Strong statements use specific examples of motivation and growth. You'll draft an opening.",
    practice_task:
      "Write a 4-sentence opening for a university personal statement using one specific example from your life.",
    success_criteria: "Your opening shows motivation through a concrete, personal example.",
    estimated_time: "25 min",
  },
  "Time Management": {
    title: "Planning a busy week",
    target_skill: "Time Management",
    explanation:
      "Breaking work into scheduled tasks reduces stress. You'll plan a realistic week.",
    practice_task:
      "Take 3 upcoming assignments and schedule their tasks across a 7-day calendar.",
    success_criteria: "Every assignment is broken into tasks and placed on specific days.",
    estimated_time: "20 min",
  },
  "Research Skills": {
    title: "Finding and citing good sources",
    target_skill: "Research Skills",
    explanation:
      "Reliable sources and proper citation build trust. You'll judge sources and practise citing one.",
    practice_task:
      "Find 2 sources on a topic, decide which is more reliable and why, then write a simple citation for it.",
    success_criteria: "You justify the reliable source and produce a correct, complete citation.",
    estimated_time: "25 min",
  },

  // ── Entrepreneurship Skills ──
  "Idea Validation": {
    title: "Testing your idea before you build",
    target_skill: "Idea Validation",
    explanation:
      "Validation means checking real demand first. You'll plan the smallest test of your idea.",
    practice_task:
      "Describe your idea, then design an MVP and one question you'd ask 5 potential customers.",
    success_criteria: "Your MVP is the simplest testable version and your question probes real need.",
    estimated_time: "25 min",
  },
  "Customer Understanding": {
    title: "Knowing your target customer",
    target_skill: "Customer Understanding",
    explanation:
      "You can't serve everyone. You'll define a specific target customer and their problem.",
    practice_task:
      "Write a profile of your target customer (age, location, problem) for a UAE youth product.",
    success_criteria: "Your profile is specific and names a clear problem you would solve.",
    estimated_time: "20 min",
  },
  "Financial Basics": {
    title: "Revenue, cost and profit",
    target_skill: "Financial Basics",
    explanation:
      "Money basics keep a venture alive. You'll calculate profit and break-even for a simple product.",
    practice_task:
      "Pick a product, set its cost and price in AED, and calculate profit per unit and units needed to earn AED 1,000.",
    success_criteria: "Your profit-per-unit and break-even numbers are calculated correctly.",
    estimated_time: "25 min",
  },
  Pitching: {
    title: "Pitching in 60 seconds",
    target_skill: "Pitching",
    explanation:
      "A great pitch covers problem, solution and impact fast. You'll script and time one.",
    practice_task:
      "Write a 60-second pitch for your idea covering the problem, your solution, and why it matters.",
    success_criteria: "Your pitch fits 60 seconds and clearly states problem, solution, and impact.",
    estimated_time: "20 min",
  },
  "Execution & Planning": {
    title: "Turning a plan into action",
    target_skill: "Execution & Planning",
    explanation:
      "Focus on high-impact tasks wins. You'll prioritise the first steps for your venture.",
    practice_task:
      "List 6 tasks to launch your idea, then mark the 2 with the biggest impact to do first.",
    success_criteria: "You identify 2 high-impact tasks and justify why they come first.",
    estimated_time: "20 min",
  },
};

function slug(goal: Goal, skill: string, day: number): string {
  return `${goal}-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-d${day}`;
}

/**
 * Deterministic 7-day plan. Orders skills weakest-first, then cycles through
 * the goal's skills to fill 7 days. Used when AI mode is unavailable or fails.
 */
export function generateFallbackLearningPath(
  goal: Goal,
  weakestSkills: SkillScore[],
): LearningPathItem[] {
  const allSkills = SKILLS_BY_GOAL[goal];
  const weakNames = weakestSkills.map((s) => s.skill_name);

  // Weakest skills first, then the rest in their defined order, no duplicates.
  const ordered = [
    ...weakNames.filter((s) => allSkills.includes(s)),
    ...allSkills.filter((s) => !weakNames.includes(s)),
  ];

  const items: LearningPathItem[] = [];
  for (let day = 1; day <= 7; day++) {
    // Day 1-5 cover each skill once; days 6-7 revisit the two weakest.
    const skill =
      day <= ordered.length
        ? ordered[day - 1]
        : ordered[(day - 1) % Math.max(1, weakNames.length || ordered.length)];
    const template = LESSONS[skill] ?? LESSONS[ordered[0]];
    items.push({
      lesson_id: slug(goal, skill, day),
      day,
      ...template,
      // Days 6-7 are framed as reinforcement of the weakest skills.
      title: day > 5 ? `Reinforce: ${template.title}` : template.title,
    });
  }
  return items;
}

/** Friendly one-line summary used on the report and dashboard. */
export function pathHeadline(goal: Goal, weakest: SkillScore[]): string {
  const names = weakest.map((s) => s.skill_name).join(" and ");
  return `Your 7-day ${GOAL_LABELS[goal]} plan focuses first on ${names || "your fundamentals"}.`;
}
