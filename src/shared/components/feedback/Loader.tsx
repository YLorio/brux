import { Loader2 } from 'lucide-react';
import { cn } from '@shared/lib/cn';

export interface LoaderProps {
  label?: string;
  className?: string;
  size?: number;
}

export function Loader({ label, className, size = 22 }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400', className)}>
      <Loader2 className="animate-spin text-brand-500" style={{ width: size, height: size }} aria-hidden />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
