import { cn } from "@/lib/utils";

/** SkillCompass wordmark with a compass mark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-neo-sm border-3 border-border bg-primary text-primary-fg shadow-neo-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <polygon points="15.5 8.5 11 11 8.5 15.5 13 13" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">
        SkillCompass <span className="text-secondary">UAE</span>
      </span>
    </span>
  );
}
