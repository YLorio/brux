import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Send, ArrowLeftRight, CreditCard, ShieldCheck, Code2 } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import { Button, Logo } from '@shared/components/ui';
import { Header } from '@app/components/Header';

const NAV = [
  { to: '/dashboard', label: 'Inicio', icon: Home },
  { to: '/enviar', label: 'Enviar', icon: Send },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/cartera', label: 'Cartera', icon: CreditCard },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
  { to: '/api', label: 'API', icon: Code2 },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col gap-1 p-4">
      <NavLink
        to="/dashboard"
        onClick={onNavigate}
        aria-label="Inicio"
        className="flex justify-center px-2 py-3"
      >
        <Logo height={28} />
      </NavLink>

      <Button
        className="mt-3"
        fullWidth
        leftIcon={<Send className="h-4 w-4" />}
        onClick={() => {
          navigate('/enviar');
          onNavigate?.();
        }}
      >
        Enviar pago
      </Button>

      <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100',
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Sandbox</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Demo · no mueve dinero real.
        </p>
      </div>
    </div>
  );
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-surface-subtle dark:bg-surface-dark">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-dvh w-[260px] shrink-0 border-r border-gray-200/80 bg-white dark:border-gray-800/80 dark:bg-surface-dark lg:block">
        <SidebarContent />
      </aside>

      {/* Sidebar — drawer móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 h-dvh w-[280px] animate-slide-in-left border-r border-gray-200 bg-white shadow-floating dark:border-gray-800 dark:bg-surface-dark">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Columna principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="container-responsive flex-1 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
