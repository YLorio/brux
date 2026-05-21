import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Profile } from '@/shared/types';
import {
  getProfile,
  getSessionProfileId,
  resetDemo,
  setSessionProfileId,
} from '@shared/lib/store';

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  loginAs: (profileId: string) => Promise<void>;
  logout: () => void;
  resetSandbox: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const id = getSessionProfileId();
    if (!id) {
      setLoading(false);
      return;
    }
    getProfile(id).then((p) => {
      if (!mounted) return;
      if (!p) setSessionProfileId(null);
      setProfile(p);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const loginAs = useCallback(
    async (profileId: string) => {
      const p = await getProfile(profileId);
      if (!p) throw new Error('Perfil no encontrado.');
      setSessionProfileId(p.id);
      setProfile(p);
      queryClient.clear();
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    setSessionProfileId(null);
    setProfile(null);
    queryClient.clear();
  }, [queryClient]);

  const resetSandbox = useCallback(async () => {
    await resetDemo();
    setProfile(null);
    queryClient.clear();
  }, [queryClient]);

  const refreshProfile = useCallback(async () => {
    if (!profile) return;
    const p = await getProfile(profile.id);
    setProfile(p);
  }, [profile]);

  const value = useMemo<AuthContextValue>(
    () => ({ profile, loading, loginAs, logout, resetSandbox, refreshProfile }),
    [profile, loading, loginAs, logout, resetSandbox, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
