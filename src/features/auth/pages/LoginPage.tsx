import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, AtSign, ShieldCheck, Globe2, Zap } from 'lucide-react';
import { listProfiles } from '@shared/lib/store';
import { getCurrency } from '@shared/lib/fx';
import { Avatar, Badge, Button, Card, Logo, VerifiedBadge } from '@shared/components/ui';
import { Loader } from '@shared/components/feedback';
import { useAuth } from '../providers/AuthProvider';

export function LoginPage() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: listProfiles,
  });

  const handleLogin = async (id: string) => {
    setBusyId(id);
    try {
      await loginAs(id);
      navigate('/dashboard', { replace: true });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      {/* Panel de marca / pitch */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-surface-dark p-10 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-8">
          <Logo onDark height={30} />
          <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Pagos internacionales
            <br />
            con un simple <span className="text-brand-400">@username</span>.
          </h1>
          <p className="max-w-md text-gray-300">
            Como SINPE Móvil, pero global. En vez de compartir IBAN, SWIFT y números de cuenta,
            compartes tu <span className="text-white">@usuario</span> o tu QR. brux resuelve la
            identidad, calcula el tipo de cambio y enruta el pago.
          </p>
          <ul className="flex flex-col gap-3 text-sm text-gray-300">
            <li className="flex items-center gap-3">
              <Globe2 className="h-5 w-5 text-brand-400" aria-hidden /> Identidad de pago global
            </li>
            <li className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-brand-400" aria-hidden /> FX + routing inteligente
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-brand-400" aria-hidden /> Trazabilidad y
              conciliación completas
            </li>
          </ul>
          </div>
        </div>
        <p className="relative text-xs text-gray-500">
          PoC sandbox · no mueve dinero real · simula el flujo de orquestación de extremo a extremo.
        </p>
      </aside>

      {/* Panel de acceso */}
      <main className="flex min-h-dvh items-center justify-center bg-surface-subtle px-4 py-10 dark:bg-surface-dark">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
            <Badge tone="brand">Sandbox</Badge>
          </div>

          <Card className="rounded-3xl border-gray-200/70 shadow-floating">
            <div className="flex items-start justify-between gap-3 px-6 pt-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Entrar a brux
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Elige una cuenta demo para explorar el flujo desde ambos lados.
                </p>
              </div>
              <Badge tone="brand" dot className="hidden shrink-0 sm:inline-flex">
                Sandbox
              </Badge>
            </div>

            <div className="flex flex-col gap-2 px-6 pb-2 pt-5">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Cuentas demo
              </p>
              {isLoading && <Loader className="py-8" label="Cargando cuentas…" />}
              {profiles?.map((p) => {
                const cur = getCurrency(p.currency);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleLogin(p.id)}
                    disabled={!!busyId}
                    className="group flex items-center gap-3 rounded-2xl border border-gray-200 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50/60 hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
                  >
                    <Avatar name={p.display_name} src={p.avatar_url} flagCountry={p.country_code} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        <span className="truncate">{p.display_name}</span>
                        {p.verified && <VerifiedBadge size={14} />}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        @{p.username} · {cur.country}
                      </p>
                    </div>
                    {busyId === p.id ? (
                      <Loader size={18} />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800">
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 px-6 py-4">
              <span className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
              <span className="text-xs text-gray-400 dark:text-gray-500">o</span>
              <span className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="flex flex-col gap-3 px-6 pb-6">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<AtSign className="h-4 w-4" />}
                onClick={() => navigate('/onboarding')}
              >
                Crear un nuevo @username
              </Button>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                Demo sin dinero real · ningún dato bancario es necesario
              </p>
            </div>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            ¿Eres negocio?{' '}
            <Link to="/onboarding" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              Recibe pagos por @username
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
