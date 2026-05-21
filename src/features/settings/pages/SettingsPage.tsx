import { useRef, useState } from 'react';
import {
  AtSign,
  Lock,
  ShieldCheck,
  History,
  ArrowRight,
  Camera,
  Trash2,
  Landmark,
  Plus,
  Star,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  VerifiedBadge,
} from '@shared/components/ui';
import { ConfirmModal, Loader, useToast } from '@shared/components/feedback';
import { getIdConfig } from '@shared/lib/identity';
import { fileToAvatarDataUrl } from '@shared/lib/image';
import { formatIban, maskIban, validateIban } from '@shared/lib/iban';
import { formatDate } from '@shared/lib/format';
import { useAuth } from '@features/auth';
import { usernameChangeStatus, USERNAME_COOLDOWN_DAYS } from '../api/settingsApi';
import {
  useAddPayout,
  useChangeUsername,
  usePayoutAccounts,
  useRemovePayout,
  useSetDefaultPayout,
  useUpdateAvatar,
  useUsernameHistory,
} from '../hooks/useSettings';

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

export function SettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();
  const change = useChangeUsername();
  const updateAvatar = useUpdateAvatar();
  const history = useUsernameHistory(profile?.id);
  const payouts = usePayoutAccounts(profile?.id);
  const addPayout = useAddPayout();
  const setDefaultPayout = useSetDefaultPayout();
  const removePayout = useRemovePayout();
  const [newUsername, setNewUsername] = useState('');
  const [ibanInput, setIbanInput] = useState('');
  const [ibanAlias, setIbanAlias] = useState('');
  const [removeIbanId, setRemoveIbanId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  const ibanValid = validateIban(ibanInput);

  const handleAddIban = async () => {
    if (!ibanValid) return;
    try {
      await addPayout.mutateAsync({
        profileId: profile.id,
        iban: ibanInput,
        holder: profile.display_name,
        alias: ibanAlias || undefined,
      });
      setIbanInput('');
      setIbanAlias('');
      toast.success('Cuenta agregada');
    } catch (err) {
      toast.error('No se pudo agregar', err instanceof Error ? err.message : undefined);
    }
  };

  const handleRemoveIban = async () => {
    if (!removeIbanId) return;
    await removePayout.mutateAsync(removeIbanId);
    setRemoveIbanId(null);
    toast.success('Cuenta eliminada');
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const avatarUrl = await fileToAvatarDataUrl(file);
      await updateAvatar.mutateAsync({ profileId: profile.id, avatarUrl });
      await refreshProfile();
      toast.success('Foto actualizada');
    } catch (err) {
      toast.error('No se pudo subir la foto', err instanceof Error ? err.message : undefined);
    }
  };

  const removePhoto = async () => {
    await updateAvatar.mutateAsync({ profileId: profile.id, avatarUrl: null });
    await refreshProfile();
    toast.success('Foto eliminada');
  };

  const status = usernameChangeStatus(profile);
  const idConfig = getIdConfig(profile.country_code);
  const clean = newUsername.replace(/^@/, '').toLowerCase();
  const valid = USERNAME_RE.test(clean) && clean !== profile.username;

  const submit = async () => {
    if (!valid) return;
    try {
      await change.mutateAsync({ profileId: profile.id, username: clean });
      await refreshProfile();
      setNewUsername('');
      toast.success('Usuario actualizado', `Ahora eres @${clean}`);
    } catch (err) {
      toast.error('No se pudo cambiar', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tu identidad de pago. Los datos personales no se editan; tu @username sí, una vez cada{' '}
        {USERNAME_COOLDOWN_DAYS} días.
      </p>

      {/* Identidad (solo lectura) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden /> Identidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 pb-2">
            <Avatar
              name={profile.display_name}
              src={profile.avatar_url}
              size="xl"
              flagCountry={profile.country_code}
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                <span className="truncate">{profile.display_name}</span>
                {profile.verified && <VerifiedBadge size={16} />}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Camera className="h-4 w-4" />}
                  loading={updateAvatar.isPending}
                  onClick={() => fileRef.current?.click()}
                >
                  {profile.avatar_url ? 'Cambiar foto' : 'Subir foto'}
                </Button>
                {profile.avatar_url && (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={removePhoto}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <Field label="País" value={profile.country} />
            <Field label={idConfig.label} value={profile.id_number ?? '—'} />
            <Field label="Moneda" value={profile.currency} />
          </div>
        </CardContent>
      </Card>

      {/* Usuario (@username) */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AtSign className="h-4 w-4 text-brand-500" aria-hidden /> Tu usuario
          </CardTitle>
          <Badge tone="neutral">@{profile.username}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {status.allowed ? (
            <>
              <div className="flex items-end gap-2">
                <Input
                  label="Nuevo @username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.replace(/\s/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  leftIcon={<AtSign className="h-4 w-4" />}
                  placeholder="nuevo_usuario"
                  error={
                    newUsername.length > 0 && !USERNAME_RE.test(clean)
                      ? '3-20: minúsculas, números o guion bajo.'
                      : undefined
                  }
                />
                <Button onClick={submit} loading={change.isPending} disabled={!valid}>
                  Cambiar
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Podrás cambiarlo de nuevo {USERNAME_COOLDOWN_DAYS} días después.
              </p>
            </>
          ) : (
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ya cambiaste tu usuario hace poco. Podrás cambiarlo de nuevo el{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {status.nextAvailableAt ? formatDate(status.nextAvailableAt) : '—'}
                </span>
                .
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-brand-50 px-4 py-3 text-xs text-gray-600 dark:bg-brand-500/10 dark:text-gray-300">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
            Si alguien te tiene guardado por un usuario anterior, brux lo redirige automáticamente a
            tu usuario actual.
          </div>
        </CardContent>
      </Card>

      {/* Cuentas de liquidación (IBAN) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-brand-500" aria-hidden /> Cuentas de liquidación
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cuentas bancarias (IBAN) donde se liquidan tus fondos.
          </p>

          {payouts.isLoading ? (
            <Loader className="py-6" />
          ) : payouts.data && payouts.data.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {payouts.data.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                      <Landmark className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        <span className="truncate">{a.alias || 'Cuenta'}</span>
                        {a.is_default && <Badge tone="brand">Predeterminada</Badge>}
                      </p>
                      <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {maskIban(a.iban)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!a.is_default && (
                      <button
                        type="button"
                        onClick={() => setDefaultPayout.mutate(a.id)}
                        aria-label="Hacer predeterminada"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        <Star className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setRemoveIbanId(a.id)}
                      aria-label="Eliminar"
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:text-danger-600 dark:hover:text-danger-500"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Aún no agregas cuentas.</p>
          )}

          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-200 p-3 dark:border-gray-700">
            <Input
              label="IBAN"
              value={ibanInput}
              onChange={(e) => setIbanInput(formatIban(e.target.value))}
              placeholder="CR05 0152 0200 1026 2840 66"
              error={ibanInput.length > 0 && !ibanValid ? 'IBAN inválido.' : undefined}
              hint={!ibanInput || ibanValid ? 'Donde recibes tus liquidaciones' : undefined}
            />
            <Input
              label="Alias (opcional)"
              value={ibanAlias}
              onChange={(e) => setIbanAlias(e.target.value)}
              placeholder="Ej. Cuenta principal"
            />
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              loading={addPayout.isPending}
              disabled={!ibanValid}
              onClick={handleAddIban}
            >
              Agregar IBAN
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4 text-brand-500" aria-hidden /> Historial de usuario
          </CardTitle>
        </CardHeader>
        {history.data && history.data.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {history.data.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
                <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  @{h.old_username}
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" aria-hidden />@{h.new_username}
                </span>
                <span className="text-xs text-gray-400">{formatDate(h.changed_at)}</span>
              </div>
            ))}
          </div>
        ) : (
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no has cambiado tu usuario.
            </p>
          </CardContent>
        )}
      </Card>

      <ConfirmModal
        open={!!removeIbanId}
        onClose={() => setRemoveIbanId(null)}
        onConfirm={handleRemoveIban}
        title="¿Eliminar esta cuenta?"
        description="Dejará de estar disponible para liquidaciones."
        confirmLabel="Eliminar"
        tone="danger"
        loading={removePayout.isPending}
      />
    </div>
  );
}
