import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, ArrowLeftRight, Send, Wallet, MoreHorizontal, type LucideIcon } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import { MoreSheet } from './MoreSheet';

interface TabProps {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** Tab plano de la navbar. Activo cuando la ruta coincide o es prefijo
 *  (`/movimientos/:id` también marca "Movimientos"). */
function Tab({ to, label, icon: Icon }: TabProps) {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(`${to}/`);
  return (
    <NavLink
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 h-full text-[11px] font-medium transition-colors',
        isActive
          ? 'text-brand-600 dark:text-brand-400'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
      )}
    >
      <Icon
        className="h-[22px] w-[22px]"
        strokeWidth={isActive ? 2.4 : 2}
        aria-hidden
      />
      <span>{label}</span>
    </NavLink>
  );
}

/** Botón circular elevado al centro de la barra — atajo a Enviar. */
function SendFab() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname === '/enviar' || pathname.startsWith('/enviar/');
  return (
    <div className="flex items-start justify-center pt-1">
      <button
        type="button"
        onClick={() => navigate('/enviar')}
        aria-label="Enviar pago"
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'relative -mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-glow',
          'ring-4 ring-white dark:ring-surface-dark',
          'transition-transform active:scale-95 hover:bg-brand-600',
        )}
      >
        <Send className="h-6 w-6" strokeWidth={2.4} aria-hidden />
      </button>
    </div>
  );
}

interface MoreTabProps {
  onClick: () => void;
  label: string;
  icon: LucideIcon;
}

function MoreTab({ onClick, label, icon: Icon }: MoreTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden />
      <span>{label}</span>
    </button>
  );
}

/** Bottom navigation tipo app nativa. Visible <lg; en desktop se oculta y
 *  el sidebar lateral hace su trabajo. Respeta safe-area inferior (iOS). */
export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/80 bg-white/95 backdrop-blur-md lg:hidden',
          'dark:border-gray-800/80 dark:bg-surface-dark/95',
          'pb-[max(env(safe-area-inset-bottom),0px)]',
        )}
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5">
          <Tab to="/dashboard" label="Inicio" icon={Home} />
          <Tab to="/movimientos" label="Movimientos" icon={ArrowLeftRight} />
          <SendFab />
          <Tab to="/cartera" label="Cartera" icon={Wallet} />
          <MoreTab onClick={() => setMoreOpen(true)} label="Más" icon={MoreHorizontal} />
        </div>
      </nav>
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
