import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-primary-fg hover:bg-[#34E08C]",
  secondary: "bg-secondary text-secondary-fg hover:bg-[#14436E]",
  ghost: "bg-surface-raised text-ink hover:bg-surface-sunken",
  danger: "bg-danger text-danger-fg hover:bg-[#e23b3b]",
};

const SIZES: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 gap-2",
  md: "text-base px-4 py-2.5 gap-2",
  lg: "text-lg px-6 py-3 gap-3",
};

/**
 * Neobrutalism button.
 * States: default / hover / focus-visible / active (pressed) / disabled / loading.
 * The offset shadow collapses on :active to create the "pressed into the page" feel.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      fullWidth = false,
      className,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        type={type}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-neo border-3 border-border font-semibold",
          "shadow-neo transition-[transform,box-shadow,background-color] duration-100",
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg",
          "active:translate-x-0 active:translate-y-0 active:shadow-neo-sm",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-neo-sm disabled:translate-x-0 disabled:translate-y-0 disabled:hover:translate-x-0 disabled:hover:translate-y-0",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading && (
          <span
            className="neo-spinner h-4 w-4 shrink-0"
            aria-hidden="true"
          />
        )}
        <span>{loading ? loadingText ?? "Working…" : children}</span>
      </button>
    );
  },
);
