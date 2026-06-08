import { cn } from "@/lib/utils";
import { clamp, scoreStatus } from "@/lib/utils";

const FILL: Record<"success" | "warning" | "danger", string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export interface ProgressProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  tone?: "auto" | "success" | "warning" | "danger" | "primary";
  className?: string;
}

/** Accessible progress bar with thick border and offset fill. */
export function Progress({
  value,
  label,
  showValue = true,
  tone = "auto",
  className,
}: ProgressProps) {
  const v = Math.round(clamp(value, 0, 100));
  const resolved =
    tone === "auto" ? scoreStatus(v) : tone === "primary" ? "success" : tone;
  const fill = tone === "primary" ? "bg-primary" : FILL[resolved as keyof typeof FILL];

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-sm font-semibold">
          {label && <span>{label}</span>}
          {showValue && <span className="font-mono">{v}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-5 w-full overflow-hidden rounded-neo-sm border-3 border-border bg-surface-sunken"
      >
        <div
          className={cn("h-full border-r-3 border-border transition-[width] duration-500", fill)}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
