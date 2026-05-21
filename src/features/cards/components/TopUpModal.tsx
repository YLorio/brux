import { useState } from 'react';
import type { BankCard } from '@/shared/types';
import { Button, Input } from '@shared/components/ui';
import { Modal, useToast } from '@shared/components/feedback';
import { formatMoney } from '@shared/lib/format';
import { useTopUp } from '../hooks/useCards';
import { BrandMark } from './BrandMark';

interface Props {
  open: boolean;
  onClose: () => void;
  profileId: string;
  card: BankCard | undefined;
}

export function TopUpModal({ open, onClose, profileId, card }: Props) {
  const toast = useToast();
  const topUp = useTopUp();
  const [amount, setAmount] = useState('');

  const amountNum = Number(amount);
  const canSubmit = amountNum > 0 && !!card;

  const submit = async () => {
    if (!canSubmit || !card) return;
    try {
      await topUp.mutateAsync({ profileId, currency: 'USD', amount: amountNum, cardLast4: card.last4 });
      toast.success('Saldo recargado', `${formatMoney(amountNum, 'USD')} con ····${card.last4}`);
      setAmount('');
      onClose();
    } catch (err) {
      toast.error('No se pudo recargar', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Recargar saldo"
      description="Agrega fondos demo (USD) a tu wallet desde una tarjeta."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={topUp.isPending}>
            Cancelar
          </Button>
          <Button onClick={submit} loading={topUp.isPending} disabled={!canSubmit}>
            Recargar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {card && (
          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Tarjeta ····{card.last4}
            </span>
            <BrandMark brand={card.brand} className="text-xs text-gray-500" />
          </div>
        )}
        <Input
          label="Monto (USD)"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          leftIcon={<span className="text-sm font-medium">$</span>}
        />
      </div>
    </Modal>
  );
}
