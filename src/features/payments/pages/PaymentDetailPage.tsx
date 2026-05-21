import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, ReceiptText, Activity } from 'lucide-react';
import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VerifiedBadge,
} from '@shared/components/ui';
import { EmptyState, Loader } from '@shared/components/feedback';
import { formatDateTime, formatMoney } from '@shared/lib/format';
import { getProfile } from '@shared/lib/store';
import { StatusBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { useOrder, useOrderLedger } from '../hooks/usePayments';

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
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

export function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/movimientos')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Movimientos
        </button>
        <div className="flex items-center gap-2.5">
          <Badge tone="neutral">{o.reference}</Badge>
          <StatusBadge status={o.status} />
        </div>
      </div>

      {/* Resumen de identidades */}
      <Card>
        <CardContent className="flex items-center justify-between gap-3 py-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <Avatar
              name={o.sender_username}
              src={sender.data?.avatar_url}
              size="lg"
              flagCountry={o.sender_country_code}
            />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Envía</p>
              <p className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                @{o.sender_username}
                {sender.data?.verified && <VerifiedBadge size={14} />}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 px-2">
            <ArrowRight className="h-5 w-5 text-brand-500" aria-hidden />
            <p className="text-center text-sm font-semibold text-gray-900 tabular dark:text-gray-100">
              {formatMoney(o.amount, o.source_currency)}
            </p>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              {o.source_currency}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Avatar
              name={o.receiver_username}
              src={receiver.data?.avatar_url}
              size="lg"
              flagCountry={o.receiver_country_code}
            />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recibe</p>
              <p className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                @{o.receiver_username}
                {receiver.data?.verified && <VerifiedBadge size={14} />}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-500" aria-hidden /> Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline status={o.status} />
          </CardContent>
        </Card>

        {/* Recibo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-brand-500" aria-hidden /> Recibo
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
            <Row label="Monto enviado" value={formatMoney(o.amount, o.source_currency)} />
            <Row label="Comisión brux" value={formatMoney(o.fee, o.source_currency)} />
            <Row
              label="Total debitado"
              value={formatMoney(o.amount + o.fee, o.source_currency)}
              strong
            />
            <Row
              label="Recibe el destinatario"
              value={formatMoney(o.amount_received, o.target_currency)}
              strong
            />
            <Row label="Creada" value={formatDateTime(o.created_at)} />
            {o.note && <Row label="Nota" value={o.note} />}
          </CardContent>
        </Card>
      </div>

      {/* Ledger de la orden */}
      <Card>
        <CardHeader>
          <CardTitle>Asientos de ledger</CardTitle>
        </CardHeader>
        {ledger.data && ledger.data.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {ledger.data.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-900 dark:text-gray-100">
                    {e.description}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-gray-400">{e.type}</p>
                </div>
                <span
                  className={
                    e.type === 'credit'
                      ? 'text-sm font-semibold text-brand-600 tabular dark:text-brand-400'
                      : 'text-sm font-semibold text-gray-900 tabular dark:text-gray-100'
                  }
                >
                  {e.type === 'credit' ? '+' : '−'}
                  {formatMoney(e.amount, e.currency)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Los asientos se generarán cuando la orden se concilie.
            </p>
          </CardContent>
        )}
      </Card>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
        Sandbox brux · esta orden no representa movimiento real de dinero ·{' '}
        <Link to="/api" className="text-brand-600 hover:underline dark:text-brand-400">
          ver en la API
        </Link>
      </p>
    </div>
  );
}
