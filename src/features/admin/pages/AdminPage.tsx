import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Layers, Activity, AlertTriangle } from 'lucide-react';
import type { OrderStatus } from '@/shared/types';
import { cn } from '@shared/lib/cn';
import { Button, Card, CardHeader, CardTitle, Flag, MetricCard } from '@shared/components/ui';
import { EmptyState, Loader, useToast } from '@shared/components/feedback';
import { formatMoney, formatRelative } from '@shared/lib/format';
import { StatusBadge, useAdminSetStatus, useAllOrders } from '@features/payments';
import { useAdminStats } from '../hooks/useAdminStats';

type Filter = 'all' | 'inflight' | 'completed' | 'failed';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'inflight', label: 'En curso' },
  { value: 'completed', label: 'Completadas' },
  { value: 'failed', label: 'Fallidas' },
];

function matchesFilter(status: OrderStatus, filter: Filter): boolean {
  if (filter === 'all') return true;
  if (filter === 'completed') return status === 'completed';
  if (filter === 'failed') return status === 'failed';
  return status !== 'completed' && status !== 'failed';
}

export function AdminPage() {
  const toast = useToast();
  const orders = useAllOrders();
  const setStatus = useAdminSetStatus();
  const stats = useAdminStats(orders.data);
  const [filter, setFilter] = useState<Filter>('all');
  const [actingId, setActingId] = useState<string | null>(null);

  const act = async (id: string, status: OrderStatus) => {
    setActingId(id);
    try {
      await setStatus.mutateAsync({ id, status });
      toast.success(status === 'completed' ? 'Orden aprobada' : 'Orden marcada como fallida');
    } catch (err) {
      toast.error('No se pudo actualizar', err instanceof Error ? err.message : undefined);
    } finally {
      setActingId(null);
    }
  };

  const filtered = (orders.data ?? []).filter((o) => matchesFilter(o.status, filter));

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Operación y conciliación: aprueba o revierte órdenes manualmente.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Órdenes" value={stats.total} icon={<Layers className="h-5 w-5" />} />
        <MetricCard
          title="Completadas"
          value={stats.completed}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          title="En curso"
          value={stats.inFlight}
          description="Sin liquidar"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Fallidas"
          value={stats.failed}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle>Órdenes</CardTitle>
          <div className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800/60">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                  filter === f.value
                    ? 'bg-white text-gray-900 shadow-soft dark:bg-surface-dark-elevated dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>

        {orders.isLoading ? (
          <Loader className="py-12" />
        ) : filtered.length === 0 ? (
          <EmptyState title="Sin órdenes en este filtro" />
        ) : (
          <>
            {/* Encabezado de tabla (desktop) */}
            <div className="hidden grid-cols-12 gap-3 border-b border-gray-100 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-400 dark:border-gray-800 md:grid">
              <span className="col-span-3">Referencia</span>
              <span className="col-span-3">Ruta</span>
              <span className="col-span-2 text-right">Monto</span>
              <span className="col-span-2">Estado</span>
              <span className="col-span-2 text-right">Acciones</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((o) => {
                const terminal = o.status === 'completed' || o.status === 'failed';
                return (
                  <div
                    key={o.id}
                    className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-12 md:items-center"
                  >
                    <div className="col-span-2 md:col-span-3">
                      <Link
                        to={`/movimientos/${o.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-brand-600 dark:text-gray-100 dark:hover:text-brand-400"
                      >
                        {o.reference}
                      </Link>
                      <p className="text-xs text-gray-400">{formatRelative(o.created_at)}</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 md:col-span-3">
                      <Flag country={o.sender_country_code} size={16} />
                      <span className="truncate">
                        @{o.sender_username} → @{o.receiver_username}
                      </span>
                      <Flag country={o.receiver_country_code} size={16} />
                    </div>
                    <div className="text-sm font-medium tabular text-gray-900 dark:text-gray-100 md:col-span-2 md:text-right">
                      {formatMoney(o.amount, o.source_currency)}
                      <span className="ml-1 text-xs text-gray-400">{o.source_currency}</span>
                    </div>
                    <div className="md:col-span-2">
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="col-span-2 flex justify-end gap-2 md:col-span-2">
                      {terminal ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            loading={actingId === o.id && setStatus.isPending}
                            leftIcon={<CheckCircle2 className="h-4 w-4 text-brand-500" />}
                            onClick={() => act(o.id, 'completed')}
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<XCircle className="h-4 w-4 text-danger-500" />}
                            onClick={() => act(o.id, 'failed')}
                          >
                            Fallar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
