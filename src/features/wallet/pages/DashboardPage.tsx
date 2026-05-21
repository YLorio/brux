import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, QrCode, Hand } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VerifiedBadge,
} from '@shared/components/ui';
import { EmptyState, Loader, useToast } from '@shared/components/feedback';
import { useAuth } from '@features/auth';
import { OrderListItem, useOrdersForProfile } from '@features/payments';
import { useWallets } from '../hooks/useWallets';
import { WalletCard } from '../components/WalletCard';
import { QrModal, paymentLink } from '../components/IdentityCard';

/** Frases de bienvenida: cálidas, motivadoras y enfocadas al producto. */
const TAGLINES = [
  'Tu dinero, sin fronteras. Solo comparte tu @usuario.',
  'El mundo, a un @username de distancia.',
  'Mantente cerca de los tuyos, estén donde estén.',
  'Pagar y recibir, tan simple como mandar un mensaje.',
  'Mueve tu dinero a la velocidad de tu vida.',
  'Conecta con quienes importan, sin importar el país.',
  'Envía lo que importa, justo cuando importa.',
  'Tu plata llega donde quieras, cuando quieras.',
  'Sin cuentas largas ni enredos: solo tú y tu @usuario.',
  'Hoy es un buen día para acercar distancias.',
];

export function DashboardPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  const wallets = useWallets(profile?.id);
  const orders = useOrdersForProfile(profile?.id);

  const metrics = useMemo(() => {
    if (!profile || !orders.data) return { sent: 0, received: 0, inFlight: 0 };
    let sent = 0;
    let received = 0;
    let inFlight = 0;
    for (const o of orders.data) {
      if (o.sender_profile_id === profile.id) sent += 1;
      else received += 1;
      if (o.status !== 'completed' && o.status !== 'failed') inFlight += 1;
    }
    return { sent, received, inFlight };
  }, [profile, orders.data]);

  const tagline = useMemo(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)], []);

  if (!profile) return null;

  const firstName = profile.display_name.split(' ')[0];
  const recent = orders.data?.slice(0, 5) ?? [];

  const copyUsername = async () => {
    try {
      await navigator.clipboard.writeText(`@${profile.username}`);
      setCopied(true);
      toast.success('Copiado', `@${profile.username} listo para compartir.`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          Hola, {firstName}
          <Hand className="h-6 w-6 origin-[70%_80%] animate-wave text-warning-500" aria-hidden />
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tagline}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {wallets.isLoading ? (
            <Card>
              <Loader className="py-16" label="Cargando saldo…" />
            </Card>
          ) : (
            <WalletCard
              profile={profile}
              wallets={wallets.data ?? []}
              stats={metrics}
              onShowQr={() => setShowQr(true)}
            />
          )}
        </div>

        {/* Identidad de pago */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
            <Avatar
              name={profile.display_name}
              src={profile.avatar_url}
              size="xl"
              flagCountry={profile.country_code}
            />
            <div>
              <p className="flex items-center justify-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                {profile.display_name}
                {profile.verified && <VerifiedBadge size={16} />}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.country} · {profile.currency}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-2.5 dark:border-gray-700">
              <QRCodeSVG value={paymentLink(profile.username)} size={96} fgColor="#111827" bgColor="#FFFFFF" />
            </div>
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                onClick={copyUsername}
              >
                @{profile.username}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<QrCode className="h-4 w-4" />}
                onClick={() => setShowQr(true)}
              >
                QR
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Movimientos recientes</CardTitle>
          <Link
            to="/movimientos"
            className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Ver todos
          </Link>
        </CardHeader>
        {orders.isLoading ? (
          <Loader className="py-10" />
        ) : recent.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recent.map((o) => (
              <OrderListItem key={o.id} order={o} currentProfileId={profile.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sin movimientos todavía"
            description="Envía tu primer pago a un @username para verlo aquí."
          />
        )}
      </Card>

      <QrModal profile={profile} open={showQr} onClose={() => setShowQr(false)} />
    </div>
  );
}
