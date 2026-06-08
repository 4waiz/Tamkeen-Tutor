"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ErrorBanner } from "@/components/ui";

/**
 * Triggers server-side learning-path generation (AI or fallback) and
 * navigates to the plan when ready.
 */
export function GeneratePathButton({
  label = "Create my 7-day learning path",
  regenerate = false,
}: {
  label?: string;
  regenerate?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not generate your plan.");
      }
      router.push("/learning-path");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <ErrorBanner message={error} />}
      <Button
        onClick={generate}
        loading={loading}
        loadingText="Building your plan…"
        variant={regenerate ? "ghost" : "primary"}
      >
        {label}
      </Button>
    </div>
  );
}
