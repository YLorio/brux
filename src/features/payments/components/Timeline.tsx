import { Check, X, Loader2 } from 'lucide-react';
import type { OrderStatus } from '@/shared/types';
import { ORDER_STATUS_FLOW } from '@/shared/types';
import { cn } from '@shared/lib/cn';
import { STATUS_META } from './StatusBadge';

/**
 * Linea de tiempo de la orquestacion: created → pending_route → processing →
 * completed. Si la orden falla, marca el paso actual en rojo.
 */
export function Timeline({ status }: { status: OrderStatus }) {
  const failed = status === 'failed';
  const currentIndex = failed
    ? ORDER_STATUS_FLOW.length - 1
    : ORDER_STATUS_FLOW.indexOf(status);

  return (
    <ol className="flex flex-col">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const done = i < currentIndex || (status === 'completed' && i <= currentIndex);
        const active = i === currentIndex && status !== 'completed';
        const last = i === ORDER_STATUS_FLOW.length - 1;
        const meta = STATUS_META[step];

        return (
          <li key={step} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                  done &&
                    'border-brand-500 bg-brand-500 text-white',
                  active && !failed &&
                    'border-warning-500 bg-warning-50 text-warning-600 dark:bg-warning-500/15',
                  active && failed &&
                    'border-danger-500 bg-danger-50 text-danger-600 dark:bg-danger-500/15',
                  !done && !active &&
                    'border-gray-200 bg-white text-gray-300 dark:border-gray-700 dark:bg-surface-dark-elevated dark:text-gray-600',
                )}
              >
                {done ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : active && failed ? (
                  <X className="h-4 w-4" aria-hidden />
                ) : active ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </span>
              {!last && (
                <span
                  className={cn(
                    'my-1 w-0.5 flex-1 rounded-full',
                    done ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700',
                  )}
                />
              )}
            </div>
            <div className={cn('pb-6', last && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-medium',
                  done || active
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-400 dark:text-gray-500',
                )}
              >
                {failed && active ? STATUS_META.failed.label : meta.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {failed && active ? STATUS_META.failed.step : meta.step}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
