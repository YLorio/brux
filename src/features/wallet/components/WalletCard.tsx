import { useNavigate } from 'react-router-dom';
import { Send, QrCode, ScanLine } from 'lucide-react';
import type { Profile, Wallet } from '@/shared/types';
import { formatMoney } from '@shared/lib/format';
import { getCurrency } from '@shared/lib/fx';
import { cn } from '@shared/lib/cn';

interface Props {
  profile: Profile;
  wallets: Wallet[];
  stats: { sent: number; received: number; inFlight: number };
  onShowQr: () => void;
}

export function WalletCard({ profile, wallets, stats, onShowQr }: Props) {
  const navigate = useNavigate();
  const primary = wallets.find((w) => w.currency === profile.currency) ?? wallets[0];

  const items = [
    { label: 'Enviados', value: stats.sent },
    { label: 'Recibidos', value: stats.received },
    { label: 'En curso', value: stats.inFlight },
  ];

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-6 text-white shadow-glow sm:p-7">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-black/10 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/70">Saldo disponible</p>
          <p className="mt-1 text-3xl font-semibold tabular sm:text-4xl">
            {primary ? formatMoney(primary.balance, primary.currency) : '—'}
          </p>
          <p className="mt-1 text-sm text-white/70">
            {primary ? getCurrency(primary.currency).name : ''}
          </p>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
          @{profile.username}
        </span>
      </div>

      <div className="relative mt-6 grid grid-cols-3 divide-x divide-white/15 rounded-xl bg-white/10 backdrop-blur">
        {items.map((it) => (
          <div key={it.label} className="px-2 py-3 text-center">
            <p className="text-xl font-semibold tabular">{it.value}</p>
            <p className="mt-0.5 text-[11px] text-white/70">{it.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-auto flex gap-3 pt-6">
        <button
          type="button"
          onClick={() => navigate('/enviar')}
          className={cn(
            'inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-brand-700',
            'transition-transform active:scale-[0.98] hover:bg-white/90',
          )}
        >
          <Send className="h-4 w-4" aria-hidden /> Enviar
        </button>
        <button
          type="button"
          onClick={() => navigate('/enviar?scan=1')}
          aria-label="Escanear y pagar"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
        >
          <ScanLine className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onShowQr}
          aria-label="Recibir con QR"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
        >
          <QrCode className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
