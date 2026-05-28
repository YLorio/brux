import type { Quote } from '@shared/lib/fx';
import { formatMoney } from '@shared/lib/format';
import { Flag } from '@shared/components/ui';

interface Props {
  quote: Quote;
  /** País destino (ISO alpha-2) para la bandera. */
  country: string;
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={
          strong
            ? 'text-sm font-semibold text-gray-900 tabular dark:text-gray-100'
            : 'text-sm text-gray-700 tabular dark:text-gray-200'
        }
      >
        {value}
      </span>
    </div>
  );
}

export function QuoteBreakdown({ quote, country }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-brand-50 px-4 py-3 dark:bg-brand-500/10">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Recibe el destinatario</p>
          <p className="text-xl font-semibold text-brand-700 tabular dark:text-brand-300">
            {formatMoney(quote.amountReceived, quote.currency)}
          </p>
        </div>
        <Flag country={country} size={32} />
      </div>

      <div className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
        <Line label="Monto a enviar" value={formatMoney(quote.amount, quote.currency)} />
        <Line label="Comisión brux (0.9%)" value={formatMoney(quote.fee, quote.currency)} />
        <Line
          label="Total a debitar"
          value={formatMoney(quote.totalDebit, quote.currency)}
          strong
        />
      </div>
    </div>
  );
}
