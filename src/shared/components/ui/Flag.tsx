import type { CurrencyCode } from '@/shared/types';
import { cn } from '@shared/lib/cn';
import { getCurrency } from '@shared/lib/fx';

export interface FlagProps {
  /** Código ISO 3166-1 alpha-2, ej. "CR", "US". */
  country: string;
  size?: number;
  className?: string;
  title?: string;
}

/** Bandera circular moderna (flag-icons, set cuadrado 1x1). */
export function Flag({ country, size = 20, className, title }: FlagProps) {
  return (
    <span
      className={cn(
        'fi fis shrink-0 rounded-full bg-cover bg-center ring-1 ring-gray-900/10 dark:ring-white/15',
        `fi-${country.toLowerCase()}`,
        className,
      )}
      style={{ width: size, height: size, backgroundSize: 'cover' }}
      role="img"
      aria-label={title ?? country}
      title={title ?? country}
    />
  );
}

/** Bandera del país asociado a una moneda (ej. MXN → México). */
export function CurrencyFlag({
  currency,
  ...rest
}: { currency: CurrencyCode } & Omit<FlagProps, 'country'>) {
  const meta = getCurrency(currency);
  return <Flag country={meta.countryCode} title={rest.title ?? currency} {...rest} />;
}
