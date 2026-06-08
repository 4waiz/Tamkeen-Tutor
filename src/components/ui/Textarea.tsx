import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FieldShell, describedBy, fieldBase, fieldError } from "./Field";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helper?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, helper, error, id, className, required, rows = 5, ...props },
    ref,
  ) {
    const fieldId =
      id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldShell
        id={fieldId}
        label={label}
        helper={helper}
        error={error}
        required={required}
      >
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, helper, error)}
          className={cn(fieldBase, "resize-y", error && fieldError, className)}
          {...props}
        />
      </FieldShell>
    );
  },
);
