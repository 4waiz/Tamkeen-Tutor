import { z } from "zod";
import {
  GOALS,
  LANGUAGES,
  ACCESSIBILITY_PREFS,
  AGE_RANGES,
} from "./types";

// ── Auth ────────────────────────────────────────────────────────────
export const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Enter your name (at least 2 characters)."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});
export type SignInInput = z.infer<typeof signInSchema>;

// ── Onboarding ──────────────────────────────────────────────────────
export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Enter your name."),
  ageRange: z.enum(AGE_RANGES, {
    errorMap: () => ({ message: "Choose an age range." }),
  }),
  languagePreference: z.enum(LANGUAGES),
  goal: z.enum(GOALS, {
    errorMap: () => ({ message: "Pick a learning goal." }),
  }),
  confidenceLevel: z.coerce.number().int().min(1).max(5),
  accessibilityPreference: z.enum(ACCESSIBILITY_PREFS),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;

// ── Assessment submission ───────────────────────────────────────────
export const assessmentSubmissionSchema = z.object({
  goal: z.enum(GOALS),
  answers: z
    .array(
      z.object({
        question_id: z.string(),
        selected_index: z.number().int().min(0),
      }),
    )
    .min(1),
});
export type AssessmentSubmissionInput = z.infer<
  typeof assessmentSubmissionSchema
>;

// ── AI route payloads ───────────────────────────────────────────────
export const tutorRequestSchema = z.object({
  lesson_id: z.string().optional(),
  question: z.string().min(1, "Type a question for the tutor."),
});
export type TutorRequestInput = z.infer<typeof tutorRequestSchema>;

export const practiceRequestSchema = z.object({
  lesson_id: z.string().min(1),
  submission: z.string().min(1, "Write your practice answer first."),
});
export type PracticeRequestInput = z.infer<typeof practiceRequestSchema>;

export const generatePathRequestSchema = z.object({
  assessment_id: z.string().uuid().optional(),
});

// ── AI output validators (used to safely parse model JSON) ──────────
export const aiLearningPathSchema = z.object({
  items: z
    .array(
      z.object({
        day: z.number().int().min(1).max(7),
        title: z.string().min(1),
        target_skill: z.string().min(1),
        explanation: z.string().min(1),
        practice_task: z.string().min(1),
        success_criteria: z.string().min(1),
        estimated_time: z.string().min(1),
      }),
    )
    .length(7),
});

export const aiPracticeEvalSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().min(1),
  met_criteria: z.boolean(),
});
