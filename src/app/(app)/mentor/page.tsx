import {
  Card,
  CardHeader,
  Badge,
  EmptyState,
} from "@/components/ui";
import { Stat } from "@/components/charts";
import { getOnboardedProfile } from "@/lib/data";
import { getMentorData } from "@/lib/mentor";
import { scoreStatus, scoreBand, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TONE: Record<"success" | "warning" | "danger", "success" | "warning" | "danger"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
};

export default async function MentorPage() {
  const profile = await getOnboardedProfile();
  const data = await getMentorData(profile.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="neo-tag text-secondary">Mentor view</span>
        <h1 className="mt-1 text-2xl">Cohort overview</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {data.scope === "all"
            ? "Showing all learners across SkillCompass UAE."
            : "Showing your own data. Add a SUPABASE_SERVICE_ROLE_KEY to view the whole cohort."}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <Stat label="Learners" value={String(data.learners.length)} />
        </Card>
        <Card>
          <Stat
            label="Average readiness"
            value={data.averageReadiness != null ? `${data.averageReadiness}%` : "-"}
            tone={
              data.averageReadiness == null
                ? "ink"
                : scoreStatus(data.averageReadiness)
            }
          />
        </Card>
        <Card>
          <Stat
            label="At risk (<50%)"
            value={String(data.atRiskCount)}
            tone={data.atRiskCount > 0 ? "danger" : "success"}
          />
        </Card>
      </div>

      {data.learners.length === 0 ? (
        <EmptyState
          icon="◎"
          title="No learners yet"
          description="Once learners complete onboarding and a diagnostic, their progress appears here."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Learners table */}
          <Card className="lg:col-span-2 overflow-x-auto">
            <CardHeader tag="Learners" title="Readiness by learner" />
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-3 border-border text-left font-mono text-xs uppercase tracking-wide">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Goal</th>
                  <th className="py-2 pr-3">Readiness</th>
                  <th className="py-2 pr-3">Lessons</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.learners.map((l) => (
                  <tr key={l.id} className="border-b border-border/30">
                    <td className="py-2 pr-3 font-semibold">{l.name}</td>
                    <td className="py-2 pr-3 text-ink-soft">{l.goal ?? "-"}</td>
                    <td className="py-2 pr-3 font-mono font-bold">
                      {l.readiness != null ? `${l.readiness}%` : "-"}
                    </td>
                    <td className="py-2 pr-3 font-mono">{l.lessonsCompleted}</td>
                    <td className="py-2">
                      {l.readiness == null ? (
                        <Badge tone="neutral">No diagnostic</Badge>
                      ) : l.atRisk ? (
                        <Badge tone="danger">At risk</Badge>
                      ) : (
                        <Badge tone={TONE[scoreStatus(l.readiness)]}>
                          {scoreBand(l.readiness)}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Side: weak skills + recent activity */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader tag="Trends" title="Most common weak skills" />
              {data.commonWeakSkills.length === 0 ? (
                <p className="text-sm text-ink-soft">
                  No weak skills flagged yet (under 50%).
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {data.commonWeakSkills.map((s) => (
                    <li
                      key={s.skill_name}
                      className="flex items-center justify-between rounded-neo-sm border-3 border-border bg-surface px-3 py-2"
                    >
                      <span className="font-semibold">{s.skill_name}</span>
                      <Badge tone="warning">{s.count} learners</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <CardHeader tag="Activity" title="Recently completed lessons" />
              {data.recentCompletions.length === 0 ? (
                <p className="text-sm text-ink-soft">No lessons completed yet.</p>
              ) : (
                <ul className="flex flex-col gap-2 text-sm">
                  {data.recentCompletions.map((c, i) => (
                    <li
                      key={`${c.lesson_id}-${i}`}
                      className="flex items-center justify-between gap-2"
                    >
                      <span>
                        <strong>{c.name}</strong> finished a lesson
                      </span>
                      <span className="font-mono text-xs text-ink-soft">
                        {formatDate(c.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
