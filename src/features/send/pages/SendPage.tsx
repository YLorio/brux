import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AtSign,
  Check,
  Loader2,
  X,
  ShieldCheck,
  ScanLine,
  ArrowLeft,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import type { CurrencyCode } from '@/shared/types';
import { getProfileByUsername, listProfiles } from '@shared/lib/store';
import { quote as buildQuote } from '@shared/lib/fx';
import { formatMoney } from '@shared/lib/format';
import { cn } from '@shared/lib/cn';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Flag,
  Input,
  VerifiedBadge,
} from '@shared/components/ui';
import { Loader, useToast } from '@shared/components/feedback';
import { useAuth } from '@features/auth';
import { useCreateOrder } from '@features/payments';
import { useWallets } from '@features/wallet';
import { QuoteBreakdown } from '../components/QuoteBreakdown';
import { ScanModal } from '../components/ScanModal';

export function SendPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const createOrder = useCreateOrder();
  const wallets = useWallets(profile?.id);

  const source: CurrencyCode = 'USD';
  const [step, setStep] = useState(1);
  const [recipientInput, setRecipientInput] = useState('');
  const [debounced, setDebounced] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [scanOpen, setScanOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const to = searchParams.get('to');
    if (to) setRecipientInput(to.replace(/^@/, ''));
    if (searchParams.get('scan')) setScanOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(recipientInput.replace(/^@/, '').trim()), 300);
    return () => clearTimeout(handle);
  }, [recipientInput]);

  const isSelf = !!profile && debounced.toLowerCase() === profile.username.toLowerCase();
  const recipient = useQuery({
    queryKey: ['resolve', debounced],
    queryFn: () => getProfileByUsername(debounced),
    enabled: debounced.length >= 2 && !isSelf,
  });
  const directory = useQuery({ queryKey: ['profiles'], queryFn: listProfiles });

  const resolved = recipient.data ?? null;
  const amountNum = Number(amount);
  const selectedWallet = wallets.data?.find((w) => w.currency === source);

  const quote = useMemo(
    () => (resolved && amountNum > 0 ? buildQuote(amountNum, source) : null),
    [resolved, amountNum],
  );
  const insufficient = !!quote && !!selectedWallet && selectedWallet.balance < quote.totalDebit;

  if (!profile) return null;
  if (wallets.isLoading) return <Loader className="py-20" label="Cargando tu cuenta…" />;

  const recipientStatus = isSelf ? (
    <X className="h-4 w-4 text-danger-500" />
  ) : debounced.length >= 2 && recipient.isFetching ? (
    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
  ) : resolved ? (
    <Check className="h-4 w-4 text-brand-500" />
  ) : debounced.length >= 2 ? (
    <X className="h-4 w-4 text-danger-500" />
  ) : undefined;

  const recipientError = isSelf
    ? 'No puedes enviarte un pago a ti mismo.'
    : debounced.length >= 2 && !recipient.isFetching && !resolved
      ? `No se encontró la identidad @${debounced}.`
      : undefined;

  const quickPicks = (directory.data ?? []).filter((p) => p.id !== profile.id).slice(0, 5);

  const handleSend = async () => {
    if (!resolved || !quote || insufficient) return;
    try {
      const order = await createOrder.mutateAsync({
        senderProfileId: profile.id,
        receiverUsername: debounced,
        amount: amountNum,
        sourceCurrency: source,
        note: note || undefined,
      });
      toast.success('Orden creada', `${order.reference} en camino a @${order.receiver_username}.`);
      navigate(`/movimientos/${order.id}`);
    } catch (err) {
      toast.error('No se pudo enviar', err instanceof Error ? err.message : undefined);
    }
  };

  /** Tarjeta de identidad del destinatario (validación). */
  const RecipientCard = ({ big = false }: { big?: boolean }) => {
    if (!resolved) return null;
    return (
      <div
        className={cn(
          // Card neutro con un acento verde fino a la izquierda — minimal.
          'flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3',
          'dark:border-gray-800 dark:bg-surface-dark-elevated',
          big && 'flex-col p-5 text-center',
        )}
      >
        <Avatar
          name={resolved.display_name}
          src={resolved.avatar_url}
          size={big ? 'xl' : 'md'}
          flagCountry={resolved.country_code}
        />
        <div className={cn('min-w-0', !big && 'flex-1')}>
          <p
            className={cn(
              'flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100',
              big ? 'justify-center text-base' : 'text-sm',
            )}
          >
            <span className="truncate">{resolved.display_name}</span>
            {resolved.verified && <VerifiedBadge size={16} />}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            @{resolved.username} · {resolved.country}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <Card>
        <CardContent className="flex flex-col gap-5 py-6">
          {/* Paso 1: usuario */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ¿A quién le envías?
                </h2>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Escribe el @username del destinatario.
                </p>
              </div>
              <Input
                label="Para (@username)"
                placeholder="usuario"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value.replace(/\s/g, ''))}
                leftIcon={<AtSign className="h-4 w-4" />}
                rightIcon={recipientStatus}
                error={recipientError}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setScanOpen(true)}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
              >
                <ScanLine className="h-4 w-4" aria-hidden /> Escanear código QR
              </button>

              {quickPicks.length > 0 && !resolved && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Sugerencias
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickPicks.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setRecipientInput(p.username)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 py-1 pl-1 pr-2.5 text-xs font-medium text-gray-600 transition-colors hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
                      >
                        <Avatar name={p.display_name} src={p.avatar_url} size="sm" className="!h-5 !w-5 !text-[9px]" />
                        @{p.username}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {resolved && <RecipientCard />}

              <Button
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                disabled={!resolved || isSelf}
                onClick={() => setStep(2)}
              >
                Continuar
              </Button>
            </>
          )}

          {/* Paso 2: monto */}
          {step === 2 && (
            <>
              <RecipientCard />

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ¿Cuánto le envías?
                </h2>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Indica el monto a debitar de tu saldo.
                </p>
              </div>

              {/* Callout de saldo — card limpio. El verde solo aparece en
                  el icono y el monto, no como fondo translúcido. */}
              {selectedWallet && (
                <div
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3',
                    insufficient
                      ? 'border-danger-200 bg-white dark:border-danger-500/40 dark:bg-surface-dark-elevated'
                      : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-surface-dark-elevated',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        insufficient
                          ? 'bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-400'
                          : 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
                      )}
                    >
                      <Wallet className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                        Saldo disponible
                      </p>
                      <p className="text-xl font-bold tabular text-gray-900 dark:text-gray-50">
                        {formatMoney(selectedWallet.balance, 'USD')}
                      </p>
                    </div>
                  </div>
                  {insufficient && (
                    <span className="rounded-full bg-danger-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-danger-600 dark:bg-danger-500/15 dark:text-danger-400">
                      Insuficiente
                    </span>
                  )}
                </div>
              )}

              <Input
                label="Monto"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                leftIcon={<span className="text-sm font-medium">$</span>}
                error={insufficient ? 'Saldo insuficiente.' : undefined}
                autoFocus
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  onClick={() => setStep(1)}
                >
                  Atrás
                </Button>
                <Button
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  disabled={!(amountNum > 0) || insufficient}
                  onClick={() => setStep(3)}
                >
                  Continuar
                </Button>
              </div>
            </>
          )}

          {/* Paso 3: validación + cotización */}
          {step === 3 && quote && resolved && (
            <>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Confirma el envío
                </h2>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Verifica que es la persona correcta.
                </p>
              </div>

              <RecipientCard big />

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Flag country={resolved.country_code} size={16} />
                Recibe en {resolved.country}
              </div>

              <QuoteBreakdown quote={quote} country={resolved.country_code} />

              <Input
                label="Nota (opcional)"
                placeholder="Ej. Pago de freelance"
                value={note}
                maxLength={80}
                onChange={(e) => setNote(e.target.value)}
              />

              {/* Resumen del monto en una línea aparte — así el CTA queda con
                  texto fijo y no se sale del ancho del card. */}
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
                <span className="text-sm text-gray-500 dark:text-gray-400">A debitar</span>
                <span className="text-lg font-bold tabular text-gray-900 dark:text-gray-50">
                  {formatMoney(quote.totalDebit, quote.currency)}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  onClick={() => setStep(2)}
                  disabled={createOrder.isPending}
                >
                  Atrás
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  leftIcon={<ShieldCheck className="h-4 w-4" />}
                  loading={createOrder.isPending}
                  onClick={handleSend}
                >
                  Confirmar y enviar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ScanModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onResult={(user) => {
          setRecipientInput(user);
          setScanOpen(false);
          setStep(1);
        }}
      />
    </div>
  );
}
