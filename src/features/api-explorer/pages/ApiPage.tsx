import { useState } from 'react';
import { Play, Terminal, Copy, Check } from 'lucide-react';
import type { CurrencyCode, PaymentOrder, Profile } from '@/shared/types';
import { cn } from '@shared/lib/cn';
import {
  getProfileByUsername,
  listAllOrders,
} from '@shared/lib/store';
import { quote as buildQuote } from '@shared/lib/fx';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@shared/components/ui';
import { useToast } from '@shared/components/feedback';

type Method = 'GET' | 'POST';
type EndpointId = 'list' | 'detail' | 'create' | 'resolve';

interface Endpoint {
  id: EndpointId;
  method: Method;
  path: string;
  summary: string;
}

const ENDPOINTS: Endpoint[] = [
  { id: 'list', method: 'GET', path: '/v1/payments', summary: 'Lista las órdenes de pago' },
  { id: 'detail', method: 'GET', path: '/v1/payments/{ref}', summary: 'Obtiene una orden por referencia' },
  { id: 'create', method: 'POST', path: '/v1/payments', summary: 'Cotiza/crea una orden (dry-run)' },
  { id: 'resolve', method: 'GET', path: '/v1/identity/{username}', summary: 'Resuelve un @username' },
];

function toApiOrder(o: PaymentOrder) {
  return {
    id: o.id,
    reference: o.reference,
    status: o.status,
    sender: `@${o.sender_username}`,
    sender_country: o.sender_country_code,
    receiver: `@${o.receiver_username}`,
    receiver_country: o.receiver_country_code,
    currency: o.source_currency,
    amount: o.amount,
    fee: o.fee,
    amount_received: o.amount_received,
    note: o.note,
    created_at: o.created_at,
  };
}

function toApiIdentity(p: Profile) {
  return {
    username: `@${p.username}`,
    display_name: p.display_name,
    country: p.country,
    country_code: p.country_code,
    currency: p.currency,
    payment_link: `https://brux.app/@${p.username}`,
  };
}

const methodColor: Record<Method, string> = {
  GET: 'text-info-500',
  POST: 'text-brand-400',
};

export function ApiPage() {
  const toast = useToast();
  const [selected, setSelected] = useState<EndpointId>('list');
  const [refParam, setRefParam] = useState('');
  const [usernameParam, setUsernameParam] = useState('maria');
  const [fromUser, setFromUser] = useState('ana');
  const [toUser, setToUser] = useState('jose');
  const [amount, setAmount] = useState('25');
  const currency: CurrencyCode = 'USD'; // moneda única
  const [response, setResponse] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoint = ENDPOINTS.find((e) => e.id === selected)!;

  const run = async () => {
    setRunning(true);
    try {
      let result: unknown;
      if (selected === 'list') {
        const orders = await listAllOrders();
        result = {
          object: 'list',
          count: orders.length,
          data: orders.slice(0, 8).map(toApiOrder),
        };
      } else if (selected === 'detail') {
        const orders = await listAllOrders();
        const found = orders.find(
          (o) => o.reference.toLowerCase() === refParam.trim().toLowerCase(),
        );
        result = found
          ? toApiOrder(found)
          : { error: { code: 'not_found', message: `Orden ${refParam} no encontrada` } };
      } else if (selected === 'resolve') {
        const p = await getProfileByUsername(usernameParam);
        result = p
          ? toApiIdentity(p)
          : { error: { code: 'identity_not_found', message: `@${usernameParam} no existe` } };
      } else {
        // POST dry-run: cotiza sin persistir.
        const receiver = await getProfileByUsername(toUser);
        if (!receiver) {
          result = { error: { code: 'identity_not_found', message: `@${toUser} no existe` } };
        } else {
          const q = buildQuote(Number(amount) || 0, currency);
          result = {
            object: 'payment_order',
            dry_run: true,
            status: 'created',
            sender: `@${fromUser}`,
            receiver: `@${receiver.username}`,
            receiver_country: receiver.country_code,
            currency: q.currency,
            amount: q.amount,
            fee: q.fee,
            total_debit: q.totalDebit,
            amount_received: q.amountReceived,
          };
        }
      }
      setResponse(JSON.stringify(result, null, 2));
    } finally {
      setRunning(false);
    }
  };

  const copyResponse = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Respuesta copiada');
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Misma orquestación, expuesta como API. Pruébala contra el sandbox.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Endpoints */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Endpoints</CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-1 px-3 pb-4">
            {ENDPOINTS.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => {
                  setSelected(e.id);
                  setResponse('');
                }}
                className={cn(
                  'flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors',
                  selected === e.id
                    ? 'bg-brand-50 dark:bg-brand-500/10'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                )}
              >
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className={cn('font-semibold', methodColor[e.method])}>{e.method}</span>
                  <span className="text-gray-700 dark:text-gray-200">{e.path}</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{e.summary}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Consola */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-mono text-sm">
              <span className={cn('font-semibold', methodColor[endpoint.method])}>
                {endpoint.method}
              </span>
              {endpoint.path}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {selected === 'detail' && (
              <Input
                label="Referencia"
                placeholder="BRX-XXXXXX"
                value={refParam}
                onChange={(e) => setRefParam(e.target.value.toUpperCase())}
              />
            )}
            {selected === 'resolve' && (
              <Input
                label="username"
                placeholder="maria"
                value={usernameParam}
                onChange={(e) => setUsernameParam(e.target.value.replace(/^@/, ''))}
              />
            )}
            {selected === 'create' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="from (sender)" value={fromUser} onChange={(e) => setFromUser(e.target.value.replace(/^@/, ''))} />
                <Input label="to (receiver)" value={toUser} onChange={(e) => setToUser(e.target.value.replace(/^@/, ''))} />
                <Input
                  label="amount (USD)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            )}

            <Button leftIcon={<Play className="h-4 w-4" />} loading={running} onClick={run}>
              Ejecutar
            </Button>

            <div className="overflow-hidden rounded-xl border border-gray-800 bg-surface-dark">
              <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
                <span className="flex items-center gap-2 font-mono text-xs text-gray-400">
                  <Terminal className="h-3.5 w-3.5" aria-hidden /> response
                </span>
                {response && (
                  <button
                    type="button"
                    onClick={copyResponse}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                )}
              </div>
              <pre className="max-h-96 overflow-auto px-4 py-3 font-mono text-xs leading-relaxed text-brand-300">
                {response || '// Pulsa "Ejecutar" para ver la respuesta del sandbox'}
              </pre>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500">
              Respuestas generadas en vivo desde el sandbox. En producción, estos endpoints
              orquestan rails reales (Wise, SPEI, PIX, SINPE, ACH, SWIFT).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
