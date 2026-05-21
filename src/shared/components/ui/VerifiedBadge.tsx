import { BadgeCheck } from 'lucide-react';
import { cn } from '@shared/lib/cn';

/** Sello de cuenta verificada (relleno: fondo esmeralda + check blanco). */
export function VerifiedBadge({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <BadgeCheck
      className={cn('shrink-0 text-brand-500', className)}
      fill="currentColor"
      stroke="#fff"
      strokeWidth={2.5}
      style={{ width: size, height: size }}
      aria-label="Cuenta verificada"
    />
  );
}
