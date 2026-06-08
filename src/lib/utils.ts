/** Tiny className combiner - joins truthy class strings. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Clamp a number to [min, max]. */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Map a 0-100 score to a semantic status token. */
export function scoreStatus(score: number): "success" | "warning" | "danger" {
  if (score >= 70) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

/** Human label for a score band. */
export function scoreBand(score: number): string {
  if (score >= 70) return "Strong";
  if (score >= 50) return "Developing";
  return "Needs work";
}

/** Format an ISO timestamp as a short, locale-stable date. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
