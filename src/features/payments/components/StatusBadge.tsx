import type { OrderStatus } from '@/shared/types';
import { Badge, type BadgeTone } from '@shared/components/ui';

interface StatusMeta {
  label: string;
  tone: BadgeTone;
  pulse: boolean;
  /** Descripcion del paso en la orquestacion. */
  step: string;
}

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  created: {
    label: 'Creada',
    tone: 'neutral',
    pulse: false,
    step: 'Orden registrada en el sistema',
  },
  pending_route: {
    label: 'Buscando ruta',
    tone: 'info',
    pulse: true,
    step: 'Seleccionando el mejor rail de pago',
  },
  processing: {
    label: 'Procesando',
    tone: 'warning',
    pulse: true,
    step: 'Ejecutando conversión FX y liquidación',
  },
  completed: {
    label: 'Completada',
    tone: 'success',
    pulse: false,
    step: 'Fondos acreditados al destinatario',
  },
  failed: {
    label: 'Fallida',
    tone: 'danger',
    pulse: false,
    step: 'La orden no pudo completarse y fue reversada',
  },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone} dot pulse={meta.pulse}>
      {meta.label}
    </Badge>
  );
}
