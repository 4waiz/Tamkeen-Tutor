import { SignUpForm } from "./SignUpForm";

// Dynamic so the client form (which builds a Supabase client) is rendered at
// request time when env vars exist — not prerendered at build.
export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return <SignUpForm />;
}
