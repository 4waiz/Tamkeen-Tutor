"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validation";

export interface SettingsState {
  error?: string;
  success?: boolean;
}

/** Server action: update the learner profile from Settings (no redirect). */
export async function updateProfile(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const parsed = onboardingSchema.safeParse({
    fullName: formData.get("fullName"),
    ageRange: formData.get("ageRange"),
    languagePreference: formData.get("languagePreference"),
    goal: formData.get("goal"),
    confidenceLevel: formData.get("confidenceLevel"),
    accessibilityPreference: formData.get("accessibilityPreference"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      age_range: parsed.data.ageRange,
      language_preference: parsed.data.languagePreference,
      goal: parsed.data.goal,
      confidence_level: parsed.data.confidenceLevel,
      accessibility_preference: parsed.data.accessibilityPreference,
      onboarded: true,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Could not save your changes. Please try again." };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
