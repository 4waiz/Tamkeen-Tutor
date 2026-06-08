import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FieldShell, describedBy, fieldBase, fieldError } from "./Field";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helper?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, helper, error, id, className, required, options, placeholder, ...props },
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
        <select
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, helper, error)}
          className={cn(fieldBase, "appearance-none pr-10", error && fieldError, className)}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231C293C' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.85rem center",
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  },
);
