import { Card, CardHeader, Badge } from "@/components/ui";
import { getProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { aiEnabled } from "@/lib/ai/provider";
import { signOut } from "@/app/auth/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const profile = await getProfile();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-2xl">
      <span className="neo-tag text-secondary">Settings</span>
      <h1 className="mt-1 text-2xl">Your profile</h1>
      <p className="mt-1 text-base text-ink-soft">
        Update your details. Changing your goal updates your diagnostic and
        lessons.
      </p>

      <Card className="mt-6">
        <CardHeader tag="Account" title="Signed in" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">
            <strong>{user?.email}</strong>
          </p>
          <div className="flex items-center gap-2">
            <Badge tone={aiEnabled() ? "success" : "warning"}>
              {aiEnabled() ? "AI mode on" : "Fallback mode"}
            </Badge>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-neo-sm border-3 border-border bg-surface-raised px-3 py-1.5 text-sm font-semibold shadow-neo-sm hover:bg-surface-sunken"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader
          tag="Appearance"
          title="Theme"
          description="Switch between light and dark mode. Your choice is saved on this device."
        />
        <ThemeToggle />
      </Card>

      <Card className="mt-4">
        <CardHeader tag="Preferences" title="Edit your details" />
        <SettingsForm profile={profile} />
      </Card>
    </div>
  );
}
