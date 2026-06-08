import { cn } from "@/lib/utils";

type Tone = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";

const TONES: Record<Tone, string> = {
  primary: "bg-primary text-primary-fg",
  secondary: "bg-secondary text-secondary-fg",
  success: "bg-success text-success-fg",
  warning: "bg-warning text-warning-fg",
  danger: "bg-danger text-danger-fg",
  neutral: "bg-surface-sunken text-ink",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-neo-sm border-3 border-border px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wide shadow-neo-sm",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
