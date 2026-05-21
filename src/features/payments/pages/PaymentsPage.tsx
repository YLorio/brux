import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeftRight, ReceiptText, Inbox } from 'lucide-react';
import type { LedgerEntry } from '@/shared/types';
import { cn } from '@shared/lib/cn';
import { Button, Card, CurrencyFlag } from '@shared/components/ui';
import { EmptyState, Loader } from '@shared/components/feedback';
import { formatMoney, formatRelative } from '@shared/lib/format';
import { useAuth } from '@features/auth';
import { OrderListItem } from '../components/OrderListItem';
import { useLedgerForProfile, useOrdersForProfile } from '../hooks/usePayments';

type Tab = 'orders' | 'ledger';

function LedgerRow({ entry }: { entry: LedgerEntry }) {
  const sign = entry.type === 'credit' ? '+' : '−';
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold uppercase',
          entry.type === 'credit'
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
            : entry.type === 'fee'
              ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        )}
      >
        {entry.type === 'credit' ? 'CR' : entry.type === 'fee' ? 'FEE' : 'DB'}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-gray-900 dark:text-gray-100">{entry.description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatRelative(entry.created_at)} · {entry.type}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <CurrencyFlag currency={entry.currency} size={14} />
        <span
          className={cn(
            'text-sm font-semibold tabular',
            entry.type === 'credit'
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-gray-900 dark:text-gray-100',
          )}
        >
          {sign}
          {formatMoney(entry.amount, entry.currency)}
        </span>
      </div>
    </div>
  );
}

export function PaymentsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('orders');

  const orders = useOrdersForProfile(profile?.id);
  const ledger = useLedgerForProfile(profile?.id);

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Historial de órdenes y libro mayor (ledger) de tu cuenta.
      </p>

      <Card>
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800/60">
            <button
              type="button"
              onClick={() => setTab('orders')}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                tab === 'orders'
                  ? 'bg-white text-gray-900 shadow-soft dark:bg-surface-dark-elevated dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden /> Órdenes
            </button>
            <button
              type="button"
              onClick={() => setTab('ledger')}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                tab === 'ledger'
                  ? 'bg-white text-gray-900 shadow-soft dark:bg-surface-dark-elevated dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <ReceiptText className="h-4 w-4" aria-hidden /> Ledger
            </button>
          </div>
          <Button size="sm" leftIcon={<Send className="h-4 w-4" />} onClick={() => navigate('/enviar')}>
            <span className="hidden sm:inline">Enviar pago</span>
            <span className="sm:hidden">Enviar</span>
          </Button>
        </div>

        {tab === 'orders' ? (
          orders.isLoading ? (
            <Loader className="py-12" label="Cargando órdenes…" />
          ) : orders.data && orders.data.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.data.map((o) => (
                <OrderListItem key={o.id} order={o} currentProfileId={profile.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Inbox className="h-6 w-6" />}
              title="Aún no tienes movimientos"
              description="Cuando envíes o recibas un pago, aparecerá aquí con su estado en vivo."
              action={
                <Button leftIcon={<Send className="h-4 w-4" />} onClick={() => navigate('/enviar')}>
                  Enviar tu primer pago
                </Button>
              }
            />
          )
        ) : ledger.isLoading ? (
          <Loader className="py-12" label="Cargando ledger…" />
        ) : ledger.data && ledger.data.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {ledger.data.map((e) => (
              <LedgerRow key={e.id} entry={e} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ReceiptText className="h-6 w-6" />}
            title="Ledger vacío"
            description="Cada reserva, crédito y comisión quedará registrado aquí para conciliación."
          />
        )}
      </Card>
    </div>
  );
}
