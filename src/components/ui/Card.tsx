import { cn } from "@/lib/utils";

type Accent = "none" | "primary" | "secondary";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: Accent;
  as?: "div" | "section" | "article" | "li";
}

const ACCENT: Record<Accent, string> = {
  none: "shadow-neo",
  primary: "shadow-neo border-l-8 border-l-primary",
  secondary: "shadow-neo-secondary border-l-8 border-l-secondary",
};

/** Surface card with thick border and offset shadow. */
export function Card({
  accent = "none",
  as: Tag = "div",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-neo border-3 border-border bg-surface-raised p-6",
        ACCENT[accent],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  tag,
  title,
  description,
  action,
}: {
  tag?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {tag && <span className="neo-tag text-secondary">{tag}</span>}
        <h2 className="mt-1 text-xl">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
