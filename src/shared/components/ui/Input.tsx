import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500"
              aria-hidden
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={cn(
              'w-full min-h-11 h-11 rounded-xl bg-white text-base sm:text-sm text-gray-900 placeholder:text-gray-400',
              'border border-gray-200 px-4 transition-colors duration-200',
              'hover:border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
              'focus:outline-none',
              'dark:bg-surface-dark-elevated dark:text-gray-100 dark:placeholder:text-gray-500',
              'dark:border-gray-700 dark:hover:border-gray-600 dark:focus:border-brand-400',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-surface-dark-muted',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error &&
                'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20 dark:border-danger-500',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 dark:text-gray-500"
              aria-hidden
            >
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-danger-600 dark:text-danger-500">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
