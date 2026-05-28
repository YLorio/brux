import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ReceiptText, ChevronDown } from 'lucide-react';
import { EmptyState, Loader } from '@shared/components/feedback';
import { getProfile } from '@shared/lib/store';
import { formatMoney } from '@shared/lib/format';
import { cn } from '@shared/lib/cn';
import { Receipt } from '../components/Receipt';
import { ShareReceipt } from '../components/ShareReceipt';
import { Timeline } from '../components/Timeline';
import { useOrder, useOrderLedger } from '../hooks/usePayments';

export function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [showLedger, setShowLedger] = useState(false);

  const order = useOrder(id);
  const inFlight =
    !!order.data && order.data.status !== 'completed' && order.data.status !== 'failed';
  const ledger = useOrderLedger(id, inFlight);
  const sender = useQuery({
    queryKey: ['profile', order.data?.sender_profile_id],
    queryFn: () => getProfile(order.data!.sender_profile_id),
    enabled: !!order.data?.sender_profile_id,
  });
  const receiver = useQuery({
    queryKey: ['profile', order.data?.receiver_profile_id],
    queryFn: () => getProfile(order.data!.receiver_profile_id as string),
    enabled: !!order.data?.receiver_profile_id,
  });

  if (order.isLoading) return <Loader className="py-20" label="Cargando orden…" />;
  if (!order.data) {
    return (
      <EmptyState
        icon={<ReceiptText className="h-6 w-6" />}
        title="Orden no encontrada"
        description="Es posible que la referencia no exista en este sandbox."
      />
    );
  }

  const o = order.data;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      {/* Header minimal: solo back. La info de estado vive ya en el Receipt. */}
      <button
        type="button"
        onClick={() => navigate('/movimientos')}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Movimientos
      </button>

      {/* Comprobante */}
      <Receipt
        ref={receiptRef}
        order={o}
        sender={sender.data}
        receiver={receiver.data}
      />

      {/* Acciones */}
      <ShareReceipt
        targetRef={receiptRef}
        fileName={`brux-${o.reference}`}
      />

      {/* Seguimiento — sutil, sin card grande */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-surface-dark-elevated">
        <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          Seguimiento
        </h2>
        <Timeline status={o.status} />
      </section>

      {/* Detalles técnicos del ledger — colapsable; solo para devs/curiosos */}
      <section className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-surface-dark-elevated">
        <button
          type="button"
          onClick={() => setShowLedger((v) => !v)}
          aria-expanded={showLedger}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
            Detalles técnicos
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gray-400 transition-transform',
              showLedger && 'rotate-180',
            )}
            aria-hidden
          />
        </button>
        {showLedger && (
          <div className="border-t border-gray-100 dark:border-gray-800">
            {ledger.data && ledger.data.length > 0 ? (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {ledger.data.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-4 px-6 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-gray-900 dark:text-gray-100">
                        {e.description}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        {e.type}
                      </p>
                    </div>
                    <span
                      className={
                        e.type === 'credit'
                          ? 'text-sm font-semibold tabular text-brand-600 dark:text-brand-400'
                          : 'text-sm font-semibold tabular text-gray-900 dark:text-gray-100'
                      }
                    >
                      {e.type === 'credit' ? '+' : '−'}
                      {formatMoney(e.amount, e.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                Los asientos se generarán cuando la orden se concilie.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
