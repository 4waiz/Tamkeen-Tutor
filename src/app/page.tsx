import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button, Card, Badge } from "@/components/ui";
import { GOAL_LABELS, GOALS } from "@/lib/types";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="border-b-3 border-border bg-surface-raised">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Create free account</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        {/* Hero */}
        <section className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="neo-tag text-secondary">
              Tamkeen 5.0 · AI for Education &amp; Skills
            </span>
            <h1 className="mt-3 text-2xl leading-tight md:text-[2.75rem] md:leading-[1.1]">
              Find your weakest skills. Get a 7-day plan. Improve with guided
              practice.
            </h1>
            <p className="mt-4 max-w-xl text-base text-ink-soft">
              SkillCompass UAE diagnoses your current skill level, builds a
              personalized learning path, and teaches you with an AI tutor that
              knows your goals - built for UAE youth aged 13–24.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sign-up">
                <Button size="lg">Start your diagnostic</Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="secondary">
                  I already have an account
                </Button>
              </Link>
            </div>
            <p className="mt-4 font-mono text-xs text-ink-soft">
              No credit card · Works without an AI key · Your data is yours
            </p>
          </div>

          {/* Visual: a sample skill-gap card */}
          <Card accent="secondary" className="md:ml-auto md:max-w-md">
            <div className="flex items-center justify-between">
              <span className="neo-tag text-secondary">Sample report</span>
              <Badge tone="warning">Readiness 62%</Badge>
            </div>
            <h2 className="mt-2 text-xl">AI Basics</h2>
            <ul className="mt-4 space-y-3">
              {[
                { skill: "Prompting", score: 40, tone: "danger" as const },
                { skill: "Ethics & Safety", score: 50, tone: "warning" as const },
                { skill: "AI Concepts", score: 80, tone: "success" as const },
              ].map((row) => (
                <li key={row.skill}>
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <span>{row.skill}</span>
                    <span className="font-mono">{row.score}%</span>
                  </div>
                  <div className="h-4 rounded-neo-sm border-3 border-border bg-surface-sunken">
                    <div
                      className={`h-full border-r-3 border-border ${
                        row.tone === "danger"
                          ? "bg-danger"
                          : row.tone === "warning"
                            ? "bg-warning"
                            : "bg-success"
                      }`}
                      style={{ width: `${row.score}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-neo-sm border-3 border-border bg-primary px-3 py-2 text-sm font-semibold text-primary-fg">
              Next: a 7-day plan starting with Prompting.
            </p>
          </Card>
        </section>

        {/* How it works */}
        <section className="py-8">
          <span className="neo-tag text-secondary">How it works</span>
          <h2 className="mt-2 text-xl md:text-2xl">Four steps, real progress</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              {
                n: "01",
                t: "Diagnose",
                d: "Take an 8-question diagnostic mapped to real skill categories.",
              },
              {
                n: "02",
                t: "See your gaps",
                d: "Get an overall readiness score and your two weakest skills.",
              },
              {
                n: "03",
                t: "Get a plan",
                d: "Receive a personalized 7-day path with daily practice tasks.",
              },
              {
                n: "04",
                t: "Learn & track",
                d: "Practice with an AI tutor and watch your scores climb.",
              },
            ].map((step) => (
              <Card key={step.n} accent="primary">
                <span className="font-mono text-xl font-bold text-secondary">
                  {step.n}
                </span>
                <h3 className="mt-1 text-lg">{step.t}</h3>
                <p className="mt-1 text-sm text-ink-soft">{step.d}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Goals */}
        <section className="py-8">
          <span className="neo-tag text-secondary">Learning goals</span>
          <h2 className="mt-2 text-xl md:text-2xl">Choose where you want to grow</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {GOALS.map((g) => (
              <span
                key={g}
                className="rounded-neo border-3 border-border bg-surface-raised px-4 py-2 font-semibold shadow-neo-sm"
              >
                {GOAL_LABELS[g]}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="my-12">
          <Card className="flex flex-col items-center gap-4 bg-primary py-10 text-center text-primary-fg">
            <h2 className="text-2xl">Ready to find your skill gaps?</h2>
            <p className="max-w-lg text-base">
              Create a free account and finish your first diagnostic in under
              five minutes.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary">
                Create my free account
              </Button>
            </Link>
          </Card>
        </section>
      </main>

      <footer className="border-t-3 border-border bg-surface-raised">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-ink-soft">
          SkillCompass UAE - built for the Tamkeen 5.0 “AI for Education &amp;
          Skills” challenge.
        </div>
      </footer>
    </div>
  );
}
