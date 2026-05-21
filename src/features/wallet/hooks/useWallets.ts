import { useQuery } from '@tanstack/react-query';
import { listWallets } from '../api/walletApi';

export const walletKeys = {
  forProfile: (id: string) => ['wallets', id] as const,
};

export function useWallets(profileId: string | undefined) {
  return useQuery({
    queryKey: walletKeys.forProfile(profileId ?? ''),
    queryFn: () => listWallets(profileId as string),
    enabled: !!profileId,
    // Los saldos cambian cuando una orden se concilia; refrescamos suave.
    refetchInterval: 1500,
  });
}
