import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign, ArrowLeft, Check, X } from 'lucide-react';
import { createProfile, isUsernameAvailable } from '@shared/lib/store';
import { COUNTRIES, getCountry, initialDemoBalance } from '@shared/lib/fx';
import { getIdConfig, validateId } from '@shared/lib/identity';
import { formatMoney } from '@shared/lib/format';
import { Button, Card, Flag, Input, Logo, Select } from '@shared/components/ui';
import { useToast } from '@shared/components/feedback';
import { useAuth } from '../providers/AuthProvider';

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export function OnboardingPage() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('CR');
  const [idNumber, setIdNumber] = useState('');
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clean = username.replace(/^@/, '').toLowerCase();
  const formatValid = USERNAME_RE.test(clean);
  const initialBalance = initialDemoBalance('USD');
  const idConfig = getIdConfig(country);
  const idValid = validateId(country, idNumber);

  useEffect(() => {
    if (!formatValid) {
      setAvailable(null);
      return;
    }
    setChecking(true);
    const handle = setTimeout(async () => {
      const ok = await isUsernameAvailable(clean);
      setAvailable(ok);
      setChecking(false);
    }, 350);
    return () => clearTimeout(handle);
  }, [clean, formatValid]);

  const usernameError =
    username.length > 0 && !formatValid
      ? '3-20 caracteres: minúsculas, números o guion bajo.'
      : available === false
        ? `@${clean} ya está registrado.`
        : undefined;

  const canSubmit =
    displayName.trim().length >= 2 && formatValid && available === true && idValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const meta = getCountry(country);
      const profile = await createProfile({
        username: clean,
        display_name: displayName,
        currency: 'USD',
        country: meta.name,
        country_code: meta.code,
        id_number: idNumber,
        initialBalance,
      });
      await loginAs(profile.id);
      toast.success('Cuenta creada', `Bienvenido a brux, @${profile.username}.`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-subtle px-4 py-10 dark:bg-surface-dark">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Volver
        </button>

        <div className="mb-6">
          <Logo />
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Crea tu identidad de pago
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tu @username es lo único que compartirás para recibir dinero.
              </p>
            </div>

            <Input
              label="Nombre o empresa"
              placeholder="Ej. María López"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoFocus
            />

            <Input
              label="Tu @username"
              placeholder="usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              leftIcon={<AtSign className="h-4 w-4" />}
              rightIcon={
                checking ? (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300" />
                ) : available === true ? (
                  <Check className="h-4 w-4 text-brand-500" />
                ) : available === false ? (
                  <X className="h-4 w-4 text-danger-500" />
                ) : undefined
              }
              error={usernameError}
              hint={!usernameError ? 'Así te encontrarán: @usuario' : undefined}
            />

            <Select
              label="País"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
            />

            <Input
              label={idConfig.label}
              placeholder={idConfig.placeholder}
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              hint={
                !idNumber || idValid
                  ? `Documento de ${getCountry(country).name} · ${idConfig.help}`
                  : undefined
              }
              error={
                idNumber.length > 0 && !idValid
                  ? `${idConfig.label} inválido (${idConfig.help}).`
                  : undefined
              }
            />

            <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm dark:bg-brand-500/10">
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Flag country={country} size={18} />
                Saldo demo inicial:{' '}
                <span className="font-semibold text-brand-700 dark:text-brand-300">
                  {formatMoney(initialBalance, 'USD')}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Fondos de prueba para que puedas enviar pagos en el sandbox.
              </p>
            </div>

            {error && (
              <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700 dark:bg-danger-500/10 dark:text-danger-500">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" loading={submitting} disabled={!canSubmit}>
              Crear mi cuenta
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
