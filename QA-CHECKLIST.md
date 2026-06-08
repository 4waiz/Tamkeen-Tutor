# SkillCompass UAE — QA checklist

Run through these to verify the app is a real, working product.
Everything below works **with or without** an AI key.

## Setup
- [ ] `npm install` completes.
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] `supabase/schema.sql` has been run in the Supabase SQL editor.
- [ ] `npm run dev` starts on http://localhost:3000.
- [ ] `npm run build` succeeds with no type errors.

## Core user flow
- [ ] A new user can **sign up** (`/sign-up`).
- [ ] A new user can complete **onboarding** (name, age, language, goal, confidence, accessibility) and it persists.
- [ ] A new user can take the **diagnostic** (8 questions, one per submit) at `/assessment`.
- [ ] The app **calculates and saves skill scores** (visible on `/report`).
- [ ] The app **generates and saves a learning path** (AI when keyed, fallback otherwise) at `/learning-path`.
- [ ] The user can **open a lesson** (expand a lesson card).
- [ ] The user can **chat with the tutor** at `/tutor`, with optional lesson context.
- [ ] The user can **submit practice work** and receive feedback + a score.
- [ ] The user can **mark a lesson complete**.
- [ ] The **dashboard updates** based on saved progress (completion count, next lesson, trend).

## Persistence & auth
- [ ] **Refreshing the browser does not erase data** — scores, path, completions persist.
- [ ] Visiting a protected route while signed out **redirects to `/sign-in`** (with `redirect` back).
- [ ] A signed-in user visiting `/sign-in` or `/sign-up` is **redirected to `/dashboard`**.
- [ ] **Sign out** works and returns to home.

## Mentor view
- [ ] `/mentor` shows learners, average readiness, common weak skills, at-risk learners, recent completions.
- [ ] Without `SUPABASE_SERVICE_ROLE_KEY`, it gracefully shows only the current user (scope note displayed).

## AI & fallback
- [ ] With **no AI key**: learning path, tutor, and practice all return useful fallback content (badges show “Fallback mode”).
- [ ] With an **AI key**: routes return AI content; on malformed AI output the app falls back instead of crashing.
- [ ] **No API keys are exposed to the client** — all AI calls happen in `/api/*` routes; `provider.ts` is `server-only`.

## UI / accessibility
- [ ] UI is **responsive** on mobile and desktop (nav collapses to a menu).
- [ ] **Keyboard navigation** works across links, buttons, radios, and the quiz.
- [ ] **Focus states are visible** (purple focus ring) on every interactive element.
- [ ] Forms show **labels, helper text, and error text**; errors use `role="alert"`.
- [ ] No low-contrast gray body text; buttons use specific labels (“Save profile”, “Complete lesson”, “Start diagnostic”).
- [ ] No dead/placeholder buttons; no lorem ipsum; no console errors in normal flows.

## Data integrity
- [ ] Answer keys never reach the browser (questions served via `toPublicQuestions`; scoring is server-side).
- [ ] Submitting an assessment with a goal that mismatches the profile is rejected.
- [ ] Marking a lesson complete twice is idempotent (unique constraint).
