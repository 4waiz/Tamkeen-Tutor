"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Server action: sign the current user out and return to home. */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
