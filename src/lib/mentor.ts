import "server-only";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { GOAL_LABELS, type Goal } from "@/lib/types";

export interface LearnerRow {
  id: string;
  name: string;
  goal: string | null;
  readiness: number | null;
  lessonsCompleted: number;
  atRisk: boolean;
}

export interface MentorData {
  scope: "all" | "self"; // 'self' when no service key configured
  learners: LearnerRow[];
  averageReadiness: number | null;
  atRiskCount: number;
  commonWeakSkills: { skill_name: string; count: number }[];
  recentCompletions: { lesson_id: string; created_at: string; name: string }[];
}

/**
 * Aggregates cohort data for the mentor view. Uses the service-role client
 * (bypasses RLS) when configured so a mentor sees every learner; otherwise
 * degrades gracefully to the signed-in user's own rows via RLS.
 */
export async function getMentorData(currentUserId: string): Promise<MentorData> {
  const service = createServiceClient();
  const db = service ?? createClient();
  const scope: "all" | "self" = service ? "all" : "self";

  // ── Profiles ──
  const profilesQuery = db
    .from("profiles")
    .select("id, full_name, goal, onboarded");
  const { data: profiles } = scope === "self"
    ? await profilesQuery.eq("id", currentUserId)
    : await profilesQuery;

  // ── Latest readiness per learner ──
  const { data: assessments } = await db
    .from("assessments")
    .select("user_id, readiness_score, created_at")
    .order("created_at", { ascending: false });

  const latestReadiness = new Map<string, number>();
  for (const a of assessments ?? []) {
    if (!latestReadiness.has(a.user_id)) {
      latestReadiness.set(a.user_id, a.readiness_score);
    }
  }

  // ── Completions per learner + recent feed ──
  const { data: completions } = await db
    .from("lesson_completions")
    .select("user_id, lesson_id, created_at")
    .order("created_at", { ascending: false });

  const completionCount = new Map<string, number>();
  for (const c of completions ?? []) {
    completionCount.set(c.user_id, (completionCount.get(c.user_id) ?? 0) + 1);
  }

  const nameById = new Map(
    (profiles ?? []).map((p) => [p.id, p.full_name || "Learner"]),
  );

  const recentCompletions = (completions ?? []).slice(0, 8).map((c) => ({
    lesson_id: c.lesson_id,
    created_at: c.created_at,
    name: nameById.get(c.user_id) ?? "Learner",
  }));

  // ── Common weak skills (score < 50 across latest scores) ──
  const { data: skillScores } = await db
    .from("skill_scores")
    .select("skill_name, score");

  const weakCounts = new Map<string, number>();
  for (const s of skillScores ?? []) {
    if (s.score < 50) {
      weakCounts.set(s.skill_name, (weakCounts.get(s.skill_name) ?? 0) + 1);
    }
  }
  const commonWeakSkills = Array.from(weakCounts.entries())
    .map(([skill_name, count]) => ({ skill_name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ── Assemble learner rows ──
  const learners: LearnerRow[] = (profiles ?? [])
    .filter((p) => p.onboarded)
    .map((p) => {
      const readiness = latestReadiness.get(p.id) ?? null;
      return {
        id: p.id,
        name: p.full_name || "Learner",
        goal: p.goal ? GOAL_LABELS[p.goal as Goal] : null,
        readiness,
        lessonsCompleted: completionCount.get(p.id) ?? 0,
        atRisk: readiness != null && readiness < 50,
      };
    })
    .sort((a, b) => (a.readiness ?? 0) - (b.readiness ?? 0));

  const scored = learners.filter((l) => l.readiness != null);
  const averageReadiness =
    scored.length === 0
      ? null
      : Math.round(
          scored.reduce((sum, l) => sum + (l.readiness ?? 0), 0) / scored.length,
        );

  return {
    scope,
    learners,
    averageReadiness,
    atRiskCount: learners.filter((l) => l.atRisk).length,
    commonWeakSkills,
    recentCompletions,
  };
}
