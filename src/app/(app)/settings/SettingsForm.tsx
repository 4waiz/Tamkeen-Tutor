"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  Button,
  Input,
  Select,
  ErrorBanner,
  SuccessBanner,
} from "@/components/ui";
import {
  GOALS,
  GOAL_LABELS,
  LANGUAGES,
  LANGUAGE_LABELS,
  ACCESSIBILITY_PREFS,
  ACCESSIBILITY_LABELS,
  AGE_RANGES,
  type Profile,
} from "@/lib/types";
import { updateProfile, type SettingsState } from "./actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} loadingText="Saving…">
      Save changes
    </Button>
  );
}

export function SettingsForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useFormState<SettingsState, FormData>(
    updateProfile,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && <ErrorBanner message={state.error} />}
      {state.success && <SuccessBanner message="Your profile has been updated." />}

      <Input
        label="Your name"
        name="fullName"
        required
        defaultValue={profile.full_name ?? ""}
        autoComplete="name"
      />
      <Select
        label="Age range"
        name="ageRange"
        required
        defaultValue={profile.age_range ?? ""}
        placeholder="Choose your age range"
        options={AGE_RANGES.map((a) => ({ value: a, label: a }))}
      />
      <Select
        label="Preferred language"
        name="languagePreference"
        required
        defaultValue={profile.language_preference}
        options={LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_LABELS[l] }))}
      />
      <Select
        label="Learning goal"
        name="goal"
        required
        defaultValue={profile.goal ?? ""}
        helper="Changing this changes which diagnostic and lessons you get."
        options={GOALS.map((g) => ({ value: g, label: GOAL_LABELS[g] }))}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="font-semibold">Current confidence (1–5)</legend>
        <div className="flex gap-2" role="radiogroup" aria-label="Confidence level">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="flex flex-1 cursor-pointer items-center justify-center">
              <input
                type="radio"
                name="confidenceLevel"
                value={n}
                defaultChecked={n === (profile.confidence_level ?? 3)}
                className="peer sr-only"
                required
              />
              <span className="w-full rounded-neo border-3 border-border bg-surface-raised py-2 text-center font-bold shadow-neo-sm peer-checked:bg-primary peer-checked:text-primary-fg peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-secondary">
                {n}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Select
        label="Accessibility preference"
        name="accessibilityPreference"
        required
        defaultValue={profile.accessibility_preference}
        options={ACCESSIBILITY_PREFS.map((p) => ({
          value: p,
          label: ACCESSIBILITY_LABELS[p],
        }))}
      />

      <div>
        <SaveButton />
      </div>
    </form>
  );
}
