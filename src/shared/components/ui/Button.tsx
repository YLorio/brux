import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@shared/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl ' +
  'transition-all duration-200 ease-smooth select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-brand-500/60 focus-visible:ring-offset-white ' +
  'dark:focus-visible:ring-offset-surface-dark ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
  'cursor-pointer';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-soft hover:bg-brand-600 active:bg-brand-700 ' +
    'dark:bg-brand-500 dark:hover:bg-brand-400 dark:active:bg-brand-600',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 ' +
    'dark:bg-surface-dark-muted dark:text-gray-100 dark:hover:bg-gray-600/60',
  outline:
    'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 ' +
    'dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/60',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 ' +
    'dark:text-gray-200 dark:hover:bg-gray-800/60',
  danger:
    'bg-danger-600 text-white shadow-soft hover:bg-danger-700 ' +
    'dark:bg-danger-500 dark:hover:bg-danger-600',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-11 sm:min-h-0 h-11 sm:h-9 px-3.5 text-sm',
  md: 'min-h-11 h-11 px-5 text-sm',
  lg: 'min-h-12 h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span className="truncate">{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
