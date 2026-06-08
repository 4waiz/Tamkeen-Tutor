import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Goal,
  LearningPath,
  LearningPathItem,
  Profile,
  SkillScore,
} from "@/lib/types";

/** Returns the signed-in user or redirects to sign-in. */
export async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  return user;
}

/** Returns the current user's profile, redirecting if not signed in. */
export async function getProfile(): Promise<Profile> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // The DB trigger creates a profile row on signup; if it is somehow
  // missing, synthesise a minimal one so the app never crashes.
  if (!data) {
    return {
      id: user.id,
      full_name: (user.user_metadata?.full_name as string) ?? null,
      age_range: null,
      language_preference: "english",
      goal: null,
      confidence_level: null,
      accessibility_preference: "simple_explanations",
      onboarded: false,
      role: "learner",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  return data as Profile;
}

/** Profile + enforce that onboarding is complete (else redirect). */
export async function getOnboardedProfile(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile.onboarded || !profile.goal) redirect("/onboarding");
  return profile;
}

export interface LatestAssessment {
  id: string;
  goal: Goal;
  readiness_score: number;
  created_at: string;
  skill_scores: SkillScore[];
}

/** Most recent assessment + its skill scores, or null if none taken yet. */
export async function getLatestAssessment(
  userId: string,
): Promise<LatestAssessment | null> {
  const supabase = createClient();
  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, goal, readiness_score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!assessment) return null;

  const { data: scores } = await supabase
    .from("skill_scores")
    .select("skill_name, score")
    .eq("assessment_id", assessment.id)
    .order("score", { ascending: true });

  return {
    ...(assessment as Omit<LatestAssessment, "skill_scores">),
    skill_scores: (scores ?? []) as SkillScore[],
  };
}

/** Readiness history (oldest → newest) for the progress chart. */
export async function getReadinessHistory(
  userId: string,
): Promise<{ created_at: string; readiness_score: number }[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("assessments")
    .select("created_at, readiness_score")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

/** Most recent learning path with its items, or null. */
export async function getLatestLearningPath(
  userId: string,
): Promise<LearningPath | null> {
  const supabase = createClient();
  const { data: path } = await supabase
    .from("learning_paths")
    .select("id, goal, source")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!path) return null;

  const { data: items } = await supabase
    .from("learning_path_items")
    .select(
      "lesson_id, day, title, target_skill, explanation, practice_task, success_criteria, estimated_time",
    )
    .eq("learning_path_id", path.id)
    .order("day", { ascending: true });

  return {
    id: path.id,
    goal: path.goal as Goal,
    source: path.source as "ai" | "fallback",
    items: (items ?? []) as LearningPathItem[],
  };
}

/** Latest practice submission per lesson_id for the user. */
export async function getLatestSubmissions(
  userId: string,
): Promise<Map<string, { submission: string; feedback: string | null; score: number | null }>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("lesson_submissions")
    .select("lesson_id, submission, feedback, score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const map = new Map<
    string,
    { submission: string; feedback: string | null; score: number | null }
  >();
  for (const row of data ?? []) {
    // First seen per lesson is the most recent (descending order).
    if (!map.has(row.lesson_id)) {
      map.set(row.lesson_id, {
        submission: row.submission,
        feedback: row.feedback,
        score: row.score,
      });
    }
  }
  return map;
}

/** Set of completed lesson_ids for the user. */
export async function getCompletedLessonIds(
  userId: string,
): Promise<Set<string>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}
