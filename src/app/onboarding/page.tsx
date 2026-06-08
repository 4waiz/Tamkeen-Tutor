import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getProfile } from "@/lib/data";
import { OnboardingForm } from "./OnboardingForm";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b-3 border-border bg-surface-raised">
        <div className="mx-auto flex max-w-3xl px-4 py-3">
          <Link href="/" className="rounded-neo-sm">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <span className="neo-tag text-secondary">Step 1 of 2 · Set up</span>
        <h1 className="mt-2 text-2xl">Tell us about you</h1>
        <p className="mt-1 text-base text-ink-soft">
          This takes a minute and lets us tailor your diagnostic, tutor, and
          7-day plan. You can change it later in Settings.
        </p>
        <div className="mt-6">
          <OnboardingForm profile={profile} />
        </div>
      </main>
    </div>
  );
}
