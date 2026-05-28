import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  ShieldCheck,
  Code2,
  Sun,
  Moon,
  LogOut,
  RotateCcw,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, VerifiedBadge } from '@shared/components/ui';
import { ConfirmModal } from '@shared/components/feedback';
import { useTheme } from '@app/providers/ThemeProvider';
import { useAuth } from '@features/auth';
import { cn } from '@shared/lib/cn';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface RowProps {
  icon: LucideIcon;
  label: string;
  hint?: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
}

function Row({ icon: Icon, label, hint, onClick, tone = 'default' }: RowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800/60',
        tone === 'danger' && 'text-danger-600 dark:text-danger-500',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          tone === 'danger'
            ? 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
        )}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="flex-1 min-w-0">
        <span
          className={cn(
            'block text-sm font-medium',
            tone === 'danger'
              ? 'text-danger-600 dark:text-danger-500'
              : 'text-gray-900 dark:text-gray-100',
          )}
        >
          {label}
        </span>
        {hint && (
          <span className="block text-xs text-gray-500 dark:text-gray-400">{hint}</span>
        )}
      </span>
    </button>
  );
}

/** Bottom sheet con acciones secundarias: ajustes, admin, API, tema, sesión.
 *  Animación con CSS — entra desde abajo, backdrop fade. Cierra con backdrop,
 *  Escape o el botón ×. Bloquea el scroll del body mientras está abierto. */
export function MoreSheet({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { profile, logout, resetSandbox } = useAuth();
  const [confirmReset, setConfirmReset] = useState(false);

  // Bloquear scroll del body + cerrar con Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !profile) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login', { replace: true });
  };

  const handleReset = async () => {
    await resetSandbox();
    setConfirmReset(false);
    onClose();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        className="fixed inset-0 z-50 lg:hidden"
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute inset-0 animate-fade-in bg-gray-900/55 backdrop-blur-sm"
        />

        {/* Sheet */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 animate-slide-up rounded-t-3xl bg-white shadow-floating',
            'dark:bg-surface-dark-elevated',
            'pb-[max(env(safe-area-inset-bottom),16px)]',
          )}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-2.5 pb-1.5">
            <span className="h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Header con perfil */}
          <div className="flex items-center gap-3 px-5 pb-3 pt-2">
            <Avatar
              name={profile.display_name}
              src={profile.avatar_url}
              flagCountry={profile.country_code}
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {profile.display_name}
                {profile.verified && <VerifiedBadge size={14} />}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                @{profile.username} · {profile.currency}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Acciones */}
          <div className="flex flex-col gap-1 px-3 pt-3">
            <Row
              icon={Settings}
              label="Configuración"
              hint="Perfil, idioma, seguridad"
              onClick={() => go('/configuracion')}
            />
            <Row
              icon={ShieldCheck}
              label="Panel de órdenes"
              hint="Admin del sandbox"
              onClick={() => go('/admin')}
            />
            <Row
              icon={Code2}
              label="API para negocios"
              hint="Explorar endpoints"
              onClick={() => go('/api')}
            />
            <Row
              icon={theme === 'dark' ? Sun : Moon}
              label={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
              hint="Cambiar apariencia"
              onClick={toggle}
            />

            <div className="my-2 h-px bg-gray-100 dark:bg-gray-800" />

            <Row
              icon={RotateCcw}
              label="Reiniciar sandbox"
              hint="Restaura saldos y movimientos demo"
              onClick={() => setConfirmReset(true)}
            />
            <Row
              icon={LogOut}
              label="Cambiar de cuenta"
              onClick={handleLogout}
              tone="danger"
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="¿Reiniciar el sandbox?"
        description="Se restauran las cuentas, saldos y movimientos demo a su estado inicial."
        confirmLabel="Reiniciar"
        tone="danger"
      />
    </>
  );
}
