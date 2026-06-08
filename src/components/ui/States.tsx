import { Card } from "./Card";
import { Button } from "./Button";

/** Empty state — shown when there is no data yet, with a clear next action. */
export function EmptyState({
  title,
  description,
  action,
  icon = "○",
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 py-10 text-center">
      <div
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-neo border-3 border-border bg-primary text-2xl font-bold text-primary-fg shadow-neo-sm"
      >
        {icon}
      </div>
      <h2 className="text-lg">{title}</h2>
      <p className="max-w-md text-sm text-ink-soft">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </Card>
  );
}

/** Loading state — accessible status with a spinner. */
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <Card
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-3 py-10 text-center"
    >
      <span className="neo-spinner h-8 w-8 text-secondary" aria-hidden="true" />
      <p className="text-sm font-semibold text-ink-soft">{label}</p>
    </Card>
  );
}

/** Error state — clear message and an optional retry action. */
export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <Card
      accent="none"
      role="alert"
      className="flex flex-col items-center gap-3 border-danger py-10 text-center shadow-[6px_6px_0_0_#DC2626]"
    >
      <div
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-neo border-3 border-border bg-danger text-2xl font-bold text-danger-fg shadow-neo-sm"
      >
        !
      </div>
      <h2 className="text-lg">{title}</h2>
      <p className="max-w-md text-sm text-ink-soft">{description}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry} className="mt-2">
          {retryLabel}
        </Button>
      )}
    </Card>
  );
}

/** Inline error banner for forms and small surfaces. */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-neo border-3 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger shadow-neo-sm"
    >
      {message}
    </div>
  );
}

/** Inline success banner. */
export function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="rounded-neo border-3 border-success bg-success/10 px-4 py-3 text-sm font-semibold text-success shadow-neo-sm"
    >
      {message}
    </div>
  );
}
