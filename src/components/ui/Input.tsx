import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FieldShell, describedBy, fieldBase, fieldError } from "./Field";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, id, className, required, ...props },
  ref,
) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <FieldShell
      id={inputId}
      label={label}
      helper={helper}
      error={error}
      required={required}
    >
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, helper, error)}
        className={cn(fieldBase, error && fieldError, className)}
        {...props}
      />
    </FieldShell>
  );
});
