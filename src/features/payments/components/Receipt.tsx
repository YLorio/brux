import { forwardRef, type ComponentType } from 'react';
import {
  US, CR, MX, CO, ES, BR, GB, SV, AR,
  CA, PE, CL, UY, EC, GT, HN, PA, PY, DO,
} from 'country-flag-icons/react/1x1';
import type { PaymentOrder, Profile } from '@/shared/types';
import { Logo } from '@shared/components/ui';
import { formatDateTime, formatMoney } from '@shared/lib/format';

/** Banderas como SVG inline (country-flag-icons/1x1). No usan
 *  `background-image: url(...)` del CSS de flag-icons, así que `html-to-image`
 *  las captura sin problemas en el comprobante.
 *
 *  Tipado a `ComponentType<any>`: la librería declara `FlagComponent` con
 *  `HTMLSVGElement` (no estándar) en algunos handlers; el tipo nativo de
 *  React no encaja literal pero a runtime renderea SVG normal. */
const FLAG_MAP: Record<string, ComponentType<{ width?: number; height?: number; className?: string }>> = {
  US, CR, MX, CO, ES, BR, GB, SV, AR,
  CA, PE, CL, UY, EC, GT, HN, PA, PY, DO,
};

function CountryFlag({ code, size = 14 }: { code: string; size?: number }) {
  const F = FLAG_MAP[code.toUpperCase()];
  if (!F) return null;
  return (
    <span
      className="inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-gray-900/10"
      style={{ width: size, height: size }}
    >
      <F width={size} height={size} />
    </span>
  );
}

interface Props {
  order: PaymentOrder;
  sender?: Profile | null;
  receiver?: Profile | null;
}

/** Comprobante minimalista — diseñado para verse limpio y para capturarse
 *  como PNG sin tropiezos.
 *
 *  Decisiones para que `html-to-image` funcione siempre:
 *  - Sin `<img>` externas (logo, avatares, fotos de perfil).
 *  - Sin `flag-icons` (usan CSS `background-image: url(...)` que falla al
 *    inlinarse durante la captura).
 *  - Sin `backdrop-filter` ni `filter` CSS.
 *  - Sin gradientes con tints transparentes — solo colores sólidos.
 *  - SVGs inline para el ícono de estado (lucide-react).
 *  Todo lo que se ve aquí es texto + bordes + un solo fondo brand sólido. */
export const Receipt = forwardRef<HTMLDivElement, Props>(function Receipt(
  { order: o, sender, receiver },
  ref,
) {
  const senderDisplay = sender?.display_name ?? `@${o.sender_username}`;
  const receiverDisplay = receiver?.display_name ?? `@${o.receiver_username}`;
  const senderCountry = sender?.country ?? o.sender_country_code;
  const receiverCountry = receiver?.country ?? o.receiver_country_code;

  return (
    <div
      ref={ref}
      // Card sólido blanco, sin sombras pesadas. Borde de 1px gris muy claro.
      // Ancho fijo = imagen exportada estable entre dispositivos.
      className="mx-auto w-full max-w-md rounded-3xl border border-gray-200 bg-white"
      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
    >
      {/* Cabecera con el logo real. Sin `onDark` para evitar el `filter: invert`
          que rompe la captura PNG — el header es blanco, el logo va en su
          color natural (negro + check verde). */}
      <div className="flex items-center justify-between border-b border-gray-100 px-7 pt-7 pb-5">
        <Logo height={22} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          Comprobante
        </span>
      </div>

      {/* Monto: el dato hero */}
      <div className="px-7 pt-8 pb-7 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          Monto enviado
        </p>
        <p
          className="mt-1.5 text-5xl font-bold tabular text-gray-900"
          style={{ letterSpacing: '-0.02em' }}
        >
          {formatMoney(o.amount, o.source_currency)}
        </p>
        <p className="mt-1 text-xs font-medium text-gray-500">{o.source_currency}</p>
      </div>

      {/* De → A: dos bloques apilados, sin avatares. Tipo limpia. */}
      <div className="border-t border-gray-100 px-7 py-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              De
            </p>
            <p className="mt-1.5 truncate text-sm font-semibold text-gray-900">
              {senderDisplay}
            </p>
            <p className="truncate text-xs text-gray-500">@{o.sender_username}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <CountryFlag code={o.sender_country_code} />
              <span className="truncate">{senderCountry}</span>
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Para
            </p>
            <p className="mt-1.5 truncate text-sm font-semibold text-gray-900">
              {receiverDisplay}
            </p>
            <p className="truncate text-xs text-gray-500">@{o.receiver_username}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <CountryFlag code={o.receiver_country_code} />
              <span className="truncate">{receiverCountry}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filas de detalle — table-style, denso pero ordenado */}
      <dl className="border-t border-gray-100 px-7 py-5 text-sm">
        <DetailRow label="Referencia" value={o.reference} mono />
        <DetailRow label="Fecha" value={formatDateTime(o.created_at)} />
        <DetailRow
          label="Recibe el destinatario"
          value={formatMoney(o.amount_received, o.target_currency)}
        />
        <DetailRow
          label="Comisión brux"
          value={formatMoney(o.fee, o.source_currency)}
        />
        <DetailRow
          label="Total debitado"
          value={formatMoney(o.amount + o.fee, o.source_currency)}
          strong
        />
        {o.note && <DetailRow label="Nota" value={o.note} />}
      </dl>

      {/* Pie */}
      <div className="border-t border-gray-100 px-7 pb-6 pt-4 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
          Sandbox brux · no representa movimiento real
        </p>
        <p className="mt-0.5 text-[10px] text-gray-400">brux.app</p>
      </div>
    </div>
  );
});

function DetailRow({
  label,
  value,
  strong,
  mono,
}: {
  label: string;
  value: string;
  strong?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 first:pt-0 last:pb-0">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd
        className={[
          'text-right tabular',
          strong
            ? 'text-sm font-bold text-gray-900'
            : 'text-sm font-medium text-gray-800',
          mono && 'font-mono text-xs',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </dd>
    </div>
  );
}
