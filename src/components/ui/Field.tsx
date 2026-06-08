import { cn } from "@/lib/utils";

export interface FieldShellProps {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared form-field scaffold: explicit label, helper text, and error text,
 * wired with aria-describedby / aria-invalid for accessibility.
 */
export function FieldShell({
  id,
  label,
  helper,
  error,
  required,
  children,
  className,
}: FieldShellProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {helper && (
        <p id={helperId} className="text-sm text-ink-soft">
          {helper}
        </p>
      )}
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared describedby string for inputs inside a FieldShell. */
export function describedBy(id: string, helper?: string, error?: string) {
  return (
    [helper ? `${id}-helper` : "", error ? `${id}-error` : ""]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

export const fieldBase =
  "w-full rounded-neo border-3 border-border bg-surface-raised px-4 py-2.5 text-base text-ink placeholder:text-ink-soft/70 shadow-neo-sm transition-shadow focus:shadow-neo focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-70";

export const fieldError = "border-danger shadow-[2px_2px_0_0_#DC2626]";
