import { Link } from 'react-router-dom';
import type { PaymentOrder } from '@/shared/types';
import { cn } from '@shared/lib/cn';
import { Avatar } from '@shared/components/ui';
import { formatMoney, formatRelative } from '@shared/lib/format';
import { StatusBadge } from './StatusBadge';

interface Props {
  order: PaymentOrder;
  currentProfileId: string;
}

export function OrderListItem({ order, currentProfileId }: Props) {
  const outgoing = order.sender_profile_id === currentProfileId;
  const counterpart = outgoing ? order.receiver_username : order.sender_username;
  // La bandera identifica el país de la contraparte (a dónde va / de dónde viene).
  const counterpartCountry = outgoing
    ? order.receiver_country_code
    : order.sender_country_code;
  const amount = outgoing ? order.amount + order.fee : order.amount_received;
  const currency = outgoing ? order.source_currency : order.target_currency;

  return (
    <Link
      to={`/movimientos/${order.id}`}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <Avatar name={counterpart} flagCountry={counterpartCountry} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {outgoing ? 'Enviaste a' : 'Recibiste de'} @{counterpart}
        </p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {order.reference} · {formatRelative(order.created_at)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span
          className={cn(
            'text-sm font-semibold tabular',
            outgoing
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-brand-600 dark:text-brand-400',
          )}
        >
          {outgoing ? '−' : '+'}
          {formatMoney(amount, currency)}
        </span>
        <StatusBadge status={order.status} />
      </div>
    </Link>
  );
}
