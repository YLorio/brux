import { CreditCard } from 'lucide-react';
import type { CardBrand } from '@/shared/types';
import { cn } from '@shared/lib/cn';

/** Marca de la tarjeta (logos en sus colores oficiales). */
export function BrandMark({ brand, className }: { brand: CardBrand; className?: string }) {
  if (brand === 'mastercard') {
    return (
      <span className={cn('inline-flex items-center', className)} aria-label="Mastercard">
        <span className="h-6 w-6 rounded-full bg-[#EB001B]" />
        <span className="-ml-2.5 h-6 w-6 rounded-full bg-[#F79E1B]/90" />
      </span>
    );
  }
  if (brand === 'visa') {
    return (
      <span className={cn('font-bold italic tracking-wide', className)} aria-label="Visa">
        VISA
      </span>
    );
  }
  if (brand === 'amex') {
    return (
      <span className={cn('font-bold tracking-wide', className)} aria-label="American Express">
        AMEX
      </span>
    );
  }
  return <CreditCard className={cn('h-6 w-6', className)} aria-hidden />;
}
