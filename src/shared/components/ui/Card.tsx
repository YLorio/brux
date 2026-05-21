import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-gray-200/80 shadow-card',
        'dark:bg-surface-dark-elevated dark:border-gray-800/80',
        interactive &&
          'transition-all duration-200 ease-smooth cursor-pointer ' +
            'hover:shadow-elevated hover:-translate-y-0.5 hover:border-gray-300 ' +
            'dark:hover:border-gray-700',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex flex-col gap-1', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-semibold text-gray-900 dark:text-gray-100', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 sm:px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 sm:px-6 pb-5 sm:pb-6 pt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MetricCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  trend?: { label: string; positive?: boolean };
}

export function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <div className="px-5 sm:px-6 py-5 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl sm:text-[1.625rem] font-semibold text-gray-900 dark:text-gray-50 tabular">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
          {trend && (
            <span
              className={cn(
                'mt-1 inline-flex items-center text-xs font-medium',
                trend.positive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-danger-600 dark:text-danger-500',
              )}
            >
              {trend.label}
            </span>
          )}
        </div>
        {icon && (
          <span className="shrink-0 rounded-xl bg-brand-50 text-brand-600 p-2.5 dark:bg-brand-500/15 dark:text-brand-400">
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}
