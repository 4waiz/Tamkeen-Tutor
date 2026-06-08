import { Card } from "@/components/ui";
import { getOnboardedProfile } from "@/lib/data";
import {
  generateDiagnosticQuestions,
  toPublicQuestions,
} from "@/lib/content/diagnostics";
import { GOAL_LABELS } from "@/lib/types";
import { SKILLS_BY_GOAL } from "@/lib/content/skills";
import { Quiz } from "./Quiz";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const profile = await getOnboardedProfile();
  const goal = profile.goal!;
  const questions = toPublicQuestions(generateDiagnosticQuestions(goal));

  return (
    <div className="mx-auto max-w-2xl">
      <span className="neo-tag text-secondary">Diagnostic · {GOAL_LABELS[goal]}</span>
      <h1 className="mt-1 text-2xl">Let&apos;s find your skill gaps</h1>
      <p className="mt-1 text-base text-ink-soft">
        {questions.length} multiple-choice questions across{" "}
        {SKILLS_BY_GOAL[goal].length} skill areas. There&apos;s no time limit -
        pick the best answer for each.
      </p>

      <Card className="mt-4 bg-surface-sunken py-3">
        <p className="text-sm">
          <strong>Skill areas:</strong> {SKILLS_BY_GOAL[goal].join(" · ")}
        </p>
      </Card>

      <div className="mt-6">
        <Quiz goal={goal} questions={questions} />
      </div>
    </div>
  );
}
