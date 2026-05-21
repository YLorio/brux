# brux

**Pagos internacionales con un simple `@username`.** Como SINPE Móvil, pero global.

En vez de compartir IBAN, SWIFT y números de cuenta, una persona o empresa comparte su
`@usuario` o un QR. brux resuelve la identidad, calcula el tipo de cambio, enruta el pago por
el mejor rail disponible y deja trazabilidad completa.

> **Este es un PoC sandbox: no mueve dinero real.** Simula el flujo completo de orquestación
> para validar UX, identidad, tracking y conciliación. La capa pendiente es conectar rails
> reales (Wise, SPEI, PIX, SINPE, ACH, SWIFT).

## Qué demuestra

El **payment orchestration layer**, de extremo a extremo:

```
Identidad de pago (@username)
  + orden de pago
  + routing
  + comisión
  + tracking de estado en vivo
  + ledger (libro mayor)
  + conciliación
  + API para negocios

> Este PoC no maneja FX (conversión de divisas): cada pago se liquida en la
> misma moneda en que se envía. Las banderas identifican el país destino.
```

Flujo del demo:

```
@ana envía $25 a @jose
 → se crea la orden de pago (reserva de fondos)
 → busca ruta (pending_route)
 → procesa y liquida (processing)
 → acredita al destinatario, mismo monto (completed)
 → registra asientos en el ledger
```

## Stack

- **Vite + React 18 + TypeScript** (estricto)
- **React Router 6** · **TanStack Query** (estado servidor)
- **Tailwind CSS** (claro/oscuro, paleta fintech)
- **lucide-react** · **qrcode.react**
- Data-layer **mock en `localStorage`** (swappable a Supabase)

## Arquitectura (feature-based)

```
src/
├─ app/         # shell: router, layout, providers (tema), estilos globales
├─ shared/      # reutilizable: componentes UI, lib (store mock, fx, format, cn)
└─ features/    # cada módulo aislado con api/ hooks/ components/ pages/ index.ts
   ├─ auth/         login + onboarding (@username) + sesión mock
   ├─ wallet/       dashboard, saldo, identidad + QR
   ├─ send/         enviar a @username + simulador FX
   ├─ payments/     historial, tracking (timeline) y ledger
   ├─ admin/        panel de órdenes (aprobar / fallar) + métricas
   └─ api-explorer/ consola API fake /v1/payments ejecutable
```

Aliases: `@app`, `@shared`, `@features`, `@/*`.

## Cómo correr

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # tsc --noEmit + build de producción
npm run preview  # sirve el build
```

### Cuentas demo

El sandbox siembra varias identidades para probar ambos lados de un pago:
`@jose` (CRC), `@ana` (USD), `@maria` (MXN), `@carlos` (COP), `@lucia` (EUR), `@bruno` (BRL).
Inicia sesión con cualquiera (sin contraseña) o crea un nuevo `@username`.
Desde el menú de usuario puedes **reiniciar el demo**.

## Paleta

| Color | Hex | Uso |
|------|------|-----|
| Verde Fintech (Esmeralda) | `#00A86B` | CTA, saldos, éxito, activos (`brand-500`) |
| Negro Grafito | `#111827` | Fondos modo oscuro, encabezados (`gray-900`) |
| Blanco Nieve | `#F9FAFB` | Fondo modo claro, tarjetas (`gray-50`) |
| Gris Plata | `#6B7280` | Textos secundarios, divisores (`gray-500`) |

## Fase 2 — conectar Supabase

El data-layer vive en `src/shared/lib/store.ts` y se expone vía las funciones `api/` de cada
feature. Migrar consiste en reemplazar el cuerpo de esas funciones por llamadas a
`supabase.from(...)`; los hooks de React Query y la UI no cambian.

1. Crear el proyecto en Supabase y aplicar `supabase/schema.sql`.
2. Copiar `.env.example` a `.env` y completar las llaves.
3. Sustituir `store.ts` por un cliente Supabase (`src/shared/lib/supabase.ts`).

Las tablas previstas (`profiles`, `wallets_demo`, `payment_orders`, `ledger_entries`) ya están
modeladas en `src/shared/types.ts` y en `supabase/schema.sql`.
