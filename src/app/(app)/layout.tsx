import { AppShell } from "@/components/AppShell";
import { getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * Shared frame for all authenticated pages. The middleware already
 * guarantees a session here; this layout loads the profile for the nav.
 */
export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  return <AppShell userName={profile.full_name}>{children}</AppShell>;
}
