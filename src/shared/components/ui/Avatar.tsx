import { useState } from 'react';
import { cn } from '@shared/lib/cn';
import { Flag } from './Flag';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  name: string;
  /** URL o data URL de la foto; si falta o falla, se muestra el monograma. */
  src?: string | null;
  size?: AvatarSize;
  /** Si se indica (ISO alpha-2), muestra una banderita en la esquina. */
  flagCountry?: string;
  className?: string;
}

const sizes: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const flagSize: Record<AvatarSize, number> = { sm: 13, md: 15, lg: 18, xl: 22 };

const palette = [
  'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'bg-info-50 text-info-700 dark:bg-info-500/20 dark:text-info-500',
  'bg-warning-50 text-warning-700 dark:bg-warning-500/20 dark:text-warning-500',
  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hashIndex(name: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash % mod;
}

export function Avatar({ name, src, size = 'md', flagCountry, className }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImg = !!src && !broken;

  const circle = showImg ? (
    <img
      src={src as string}
      alt=""
      onError={() => setBroken(true)}
      className={cn('shrink-0 select-none rounded-full object-cover', sizes[size], className)}
    />
  ) : (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold',
        sizes[size],
        palette[hashIndex(name, palette.length)],
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );

  if (!flagCountry) return circle;

  return (
    <span className="relative inline-flex shrink-0">
      {circle}
      <Flag
        country={flagCountry}
        size={flagSize[size]}
        className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-surface-dark-elevated"
      />
    </span>
  );
}
