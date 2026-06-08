import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const schema = z.object({ lesson_id: z.string().min(1) });

/**
 * POST /api/complete-lesson
 * Marks a lesson complete for the current user (idempotent via the
 * unique (user_id, lesson_id) constraint).
 */
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { error } = await supabase
    .from("lesson_completions")
    .upsert(
      { user_id: user.id, lesson_id: parsed.data.lesson_id },
      { onConflict: "user_id,lesson_id" },
    );

  if (error) {
    return NextResponse.json(
      { error: "Could not save completion." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
