import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@shared/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error || undefined}
            className={cn(
              'w-full min-h-11 h-11 appearance-none rounded-xl bg-white text-base sm:text-sm text-gray-900',
              'border border-gray-200 pl-4 pr-10 transition-colors duration-200',
              'hover:border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
              'focus:outline-none',
              'dark:bg-surface-dark-elevated dark:text-gray-100',
              'dark:border-gray-700 dark:hover:border-gray-600 dark:focus:border-brand-400',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-gray-400 dark:text-gray-500"
            aria-hidden
          />
        </div>
        {error ? (
          <p className="text-xs text-danger-600 dark:text-danger-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
