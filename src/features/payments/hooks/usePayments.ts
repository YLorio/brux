import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { OrderStatus, PaymentOrder } from '@/shared/types';
import {
  adminSetStatus,
  createOrder,
  getOrder,
  listAllOrders,
  listLedgerForOrder,
  listLedgerForProfile,
  listOrdersForProfile,
  type CreateOrderInput,
} from '../api/paymentsApi';

export const paymentKeys = {
  all: ['payments'] as const,
  forProfile: (id: string) => ['payments', 'profile', id] as const,
  detail: (id: string) => ['payments', 'detail', id] as const,
  allOrders: ['payments', 'all'] as const,
  ledgerProfile: (id: string) => ['ledger', 'profile', id] as const,
  ledgerOrder: (id: string) => ['ledger', 'order', id] as const,
};

/** true mientras la orden no haya llegado a un estado terminal. */
function isInFlight(o: PaymentOrder): boolean {
  return o.status !== 'completed' && o.status !== 'failed';
}

export function useOrdersForProfile(profileId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.forProfile(profileId ?? ''),
    queryFn: () => listOrdersForProfile(profileId as string),
    enabled: !!profileId,
    refetchInterval: (q) =>
      (q.state.data ?? []).some(isInFlight) ? 900 : false,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.detail(id ?? ''),
    queryFn: () => getOrder(id as string),
    enabled: !!id,
    refetchInterval: (q) => (q.state.data && isInFlight(q.state.data) ? 700 : false),
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: paymentKeys.allOrders,
    queryFn: listAllOrders,
    refetchInterval: (q) => ((q.state.data ?? []).some(isInFlight) ? 900 : false),
  });
}

export function useLedgerForProfile(profileId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.ledgerProfile(profileId ?? ''),
    queryFn: () => listLedgerForProfile(profileId as string),
    enabled: !!profileId,
  });
}

export function useOrderLedger(orderId: string | undefined, inFlight = false) {
  return useQuery({
    queryKey: paymentKeys.ledgerOrder(orderId ?? ''),
    queryFn: () => listLedgerForOrder(orderId as string),
    enabled: !!orderId,
    refetchInterval: inFlight ? 800 : false,
  });
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['payments'] });
  qc.invalidateQueries({ queryKey: ['ledger'] });
  qc.invalidateQueries({ queryKey: ['wallets'] });
  qc.invalidateQueries({ queryKey: ['inflight'] });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation<PaymentOrder, Error, CreateOrderInput>({
    mutationFn: createOrder,
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAdminSetStatus() {
  const qc = useQueryClient();
  return useMutation<PaymentOrder, Error, { id: string; status: OrderStatus }>({
    mutationFn: ({ id, status }) => adminSetStatus(id, status),
    onSuccess: () => invalidateAll(qc),
  });
}
