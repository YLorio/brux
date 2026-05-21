import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PayoutAccount, Profile } from '@/shared/types';
import {
  addPayoutAccount,
  changeUsername,
  listPayoutAccounts,
  listUsernameHistory,
  removePayoutAccount,
  setDefaultPayoutAccount,
  updateAvatar,
  type AddPayoutInput,
} from '../api/settingsApi';

export function useUsernameHistory(profileId: string | undefined) {
  return useQuery({
    queryKey: ['username_history', profileId ?? ''],
    queryFn: () => listUsernameHistory(profileId as string),
    enabled: !!profileId,
  });
}

export function useUpdateAvatar() {
  const qc = useQueryClient();
  return useMutation<Profile, Error, { profileId: string; avatarUrl: string | null }>({
    mutationFn: ({ profileId, avatarUrl }) => updateAvatar(profileId, avatarUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }),
  });
}

export function usePayoutAccounts(profileId: string | undefined) {
  return useQuery({
    queryKey: ['payout_accounts', profileId ?? ''],
    queryFn: () => listPayoutAccounts(profileId as string),
    enabled: !!profileId,
  });
}

export function useAddPayout() {
  const qc = useQueryClient();
  return useMutation<PayoutAccount, Error, AddPayoutInput>({
    mutationFn: addPayoutAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payout_accounts'] }),
  });
}

export function useSetDefaultPayout() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: setDefaultPayoutAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payout_accounts'] }),
  });
}

export function useRemovePayout() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: removePayoutAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payout_accounts'] }),
  });
}

export function useChangeUsername() {
  const qc = useQueryClient();
  return useMutation<Profile, Error, { profileId: string; username: string }>({
    mutationFn: ({ profileId, username }) => changeUsername(profileId, username),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['username_history'] });
      qc.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}
