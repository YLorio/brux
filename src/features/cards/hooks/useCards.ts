import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BankCard, Wallet } from '@/shared/types';
import {
  addCard,
  listCards,
  removeCard,
  setDefaultCard,
  topUpWallet,
  type AddCardInput,
  type TopUpInput,
} from '../api/cardsApi';

export const cardKeys = {
  forProfile: (id: string) => ['cards', id] as const,
};

export function useCards(profileId: string | undefined) {
  return useQuery({
    queryKey: cardKeys.forProfile(profileId ?? ''),
    queryFn: () => listCards(profileId as string),
    enabled: !!profileId,
  });
}

export function useAddCard() {
  const qc = useQueryClient();
  return useMutation<BankCard, Error, AddCardInput>({
    mutationFn: addCard,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });
}

export function useSetDefaultCard() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: setDefaultCard,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });
}

export function useRemoveCard() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: removeCard,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });
}

export function useTopUp() {
  const qc = useQueryClient();
  return useMutation<Wallet, Error, TopUpInput>({
    mutationFn: topUpWallet,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallets'] });
      qc.invalidateQueries({ queryKey: ['ledger'] });
    },
  });
}
