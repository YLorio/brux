import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sun, Moon, Menu, ChevronDown, LogOut, RotateCcw, Settings } from 'lucide-react';
import { Avatar, Badge, Logo } from '@shared/components/ui';
import { ConfirmModal } from '@shared/components/feedback';
import { countInFlight } from '@shared/lib/store';
import { useTheme } from '@app/providers/ThemeProvider';
import { useAuth } from '@features/auth';

/** Título de sección derivado de la ruta actual. */
function useSectionTitle(): string {
  const { pathname } = useLocation();
  if (pathname.startsWith('/enviar')) return 'Enviar dinero';
  if (pathname.startsWith('/movimientos')) return 'Movimientos';
  if (pathname.startsWith('/cartera')) return 'Cartera';
  if (pathname.startsWith('/configuracion')) return 'Configuración';
  if (pathname.startsWith('/admin')) return 'Panel de órdenes';
  if (pathname.startsWith('/api')) return 'API para negocios';
  return 'Inicio';
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

function InFlightBadge() {
  const { profile } = useAuth();
  const { data } = useQuery({
    queryKey: ['inflight', profile?.id],
    queryFn: () => countInFlight(profile?.id),
    enabled: !!profile,
    refetchInterval: 1000,
  });
  if (!data) return null;
  return (
    <Badge tone="warning" dot pulse className="hidden sm:inline-flex">
      {data} en curso
    </Badge>
  );
}

function UserMenu() {
  const { profile, logout, resetSandbox } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!profile) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleReset = async () => {
    await resetSandbox();
    setConfirmReset(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Avatar name={profile.display_name} src={profile.avatar_url} size="sm" />
        <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:block">
          @{profile.username}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-scale-in rounded-xl border border-gray-200 bg-white p-1.5 shadow-floating dark:border-gray-800 dark:bg-surface-dark-elevated">
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar name={profile.display_name} src={profile.avatar_url} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {profile.display_name}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                @{profile.username} · {profile.currency}
              </p>
            </div>
          </div>
          <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate('/configuracion');
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Settings className="h-4 w-4 text-gray-400" aria-hidden /> Configuración
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 text-gray-400" aria-hidden /> Cambiar de cuenta
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setConfirmReset(true);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RotateCcw className="h-4 w-4 text-gray-400" aria-hidden /> Reiniciar demo
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="¿Reiniciar el sandbox?"
        description="Se restauran las cuentas, saldos y movimientos demo a su estado inicial."
        confirmLabel="Reiniciar"
        tone="danger"
      />
    </div>
  );
}

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const title = useSectionTitle();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800/80 dark:bg-surface-dark/80 sm:px-6 lg:px-8">
      {/* Móvil: abrir sidebar + logo */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="-ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>
      <div className="lg:hidden">
        <Logo height={24} />
      </div>

      {/* Desktop: título de sección */}
      <h1 className="hidden text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100 lg:block">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <InFlightBadge />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
