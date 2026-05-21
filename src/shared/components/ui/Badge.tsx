import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
  leftIcon?: ReactNode;
}

const tones: Record<BadgeTone, string> = {
  neutral:
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success:
    'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  warning:
    'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500',
  danger:
    'bg-danger-50 text-danger-700 dark:bg-danger-500/15 dark:text-danger-500',
  info: 'bg-info-50 text-info-700 dark:bg-info-500/15 dark:text-info-500',
  brand:
    'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
};

const dotTones: Record<BadgeTone, string> = {
  neutral: 'bg-gray-400',
  success: 'bg-brand-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-info-500',
  brand: 'bg-brand-500',
};

export function Badge({
  tone = 'neutral',
  dot = false,
  pulse = false,
  leftIcon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-ring',
                dotTones[tone],
              )}
            />
          )}
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dotTones[tone])} />
        </span>
      )}
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
    </span>
  );
}
