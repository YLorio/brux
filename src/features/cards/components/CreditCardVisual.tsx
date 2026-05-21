import type { BankCard } from '@/shared/types';
import { cn } from '@shared/lib/cn';
import { BrandMark } from './BrandMark';

/** Tarjeta visual estilo plástico bancario. */
export function CreditCardVisual({ card }: { card: BankCard }) {
  return (
    <div
      className={cn(
        'relative aspect-[1.586] w-full overflow-hidden rounded-2xl p-5 text-white shadow-elevated',
        card.is_default
          ? 'bg-gradient-to-br from-brand-600 to-brand-500'
          : 'bg-gradient-to-br from-gray-700 to-gray-900',
      )}
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-sm font-semibold lowercase tracking-tight">brux</span>
          <BrandMark brand={card.brand} className="text-lg" />
        </div>
        <div className="mt-2 h-8 w-11 rounded-md bg-gradient-to-br from-yellow-200/90 to-yellow-400/80" />
        <div>
          <p className="font-mono text-base tracking-[0.2em] tabular sm:text-lg">
            ···· ···· ···· {card.last4}
          </p>
          <div className="mt-3 flex items-end justify-between text-xs">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-white/60">Titular</p>
              <p className="truncate font-medium tracking-wide">{card.holder}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-white/60">Expira</p>
              <p className="font-medium tabular">
                {String(card.exp_month).padStart(2, '0')}/{String(card.exp_year).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
