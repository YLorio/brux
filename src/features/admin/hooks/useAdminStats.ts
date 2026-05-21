import { useMemo } from 'react';
import type { PaymentOrder } from '@/shared/types';

export interface AdminStats {
  total: number;
  completed: number;
  inFlight: number;
  failed: number;
}

/** Agrega conteos de operación a partir de todas las órdenes. */
export function useAdminStats(orders: PaymentOrder[] | undefined): AdminStats {
  return useMemo(() => {
    const stats: AdminStats = { total: 0, completed: 0, inFlight: 0, failed: 0 };
    if (!orders) return stats;
    for (const o of orders) {
      stats.total += 1;
      if (o.status === 'completed') stats.completed += 1;
      else if (o.status === 'failed') stats.failed += 1;
      else stats.inFlight += 1;
    }
    return stats;
  }, [orders]);
}
