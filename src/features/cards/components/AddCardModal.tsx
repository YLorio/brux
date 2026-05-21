import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button, Input } from '@shared/components/ui';
import { Modal, useToast } from '@shared/components/feedback';
import {
  BRAND_LABEL,
  detectBrand,
  formatCardNumber,
  luhnValid,
  onlyDigits,
} from '@shared/lib/cards';
import { useAddCard } from '../hooks/useCards';
import { BrandMark } from './BrandMark';

interface Props {
  open: boolean;
  onClose: () => void;
  profileId: string;
}

export function AddCardModal({ open, onClose, profileId }: Props) {
  const toast = useToast();
  const addCard = useAddCard();
  const [number, setNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const digits = onlyDigits(number);
  const brand = detectBrand(digits);
  const numberValid = luhnValid(digits);

  const expDigits = onlyDigits(expiry).slice(0, 4);
  const expMonth = Number(expDigits.slice(0, 2));
  const expYear = Number(expDigits.slice(2, 4));
  const now = new Date();
  const curYear = now.getFullYear() % 100;
  const curMonth = now.getMonth() + 1;
  const expiryValid =
    expDigits.length === 4 &&
    expMonth >= 1 &&
    expMonth <= 12 &&
    (expYear > curYear || (expYear === curYear && expMonth >= curMonth));

  const holderValid = holder.trim().length >= 2;
  const cvvValid = cvv.length >= 3 && cvv.length <= 4;
  const canSubmit = numberValid && expiryValid && holderValid && cvvValid;

  const reset = () => {
    setNumber('');
    setHolder('');
    setExpiry('');
    setCvv('');
    setMakeDefault(false);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleExpiry = (value: string) => {
    const d = onlyDigits(value).slice(0, 4);
    setExpiry(d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    try {
      const card = await addCard.mutateAsync({
        profileId,
        number: digits,
        holder,
        expMonth,
        expYear,
        makeDefault,
      });
      toast.success('Tarjeta agregada', `${BRAND_LABEL[card.brand]} ····${card.last4}`);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar la tarjeta.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Agregar tarjeta"
      description="Solo guardamos los últimos 4 dígitos. El CVV no se almacena."
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={addCard.isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="add-card-form" loading={addCard.isPending} disabled={!canSubmit}>
            Guardar tarjeta
          </Button>
        </>
      }
    >
      <form id="add-card-form" onSubmit={submit} className="flex flex-col gap-4">
        <Input
          label="Número de tarjeta"
          value={number}
          onChange={(e) => setNumber(formatCardNumber(e.target.value))}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          rightIcon={
            digits.length >= 2 ? (
              <BrandMark brand={brand} className="text-xs text-gray-500" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )
          }
          error={number.length > 0 && !numberValid ? 'Número de tarjeta inválido.' : undefined}
        />

        <Input
          label="Titular"
          value={holder}
          onChange={(e) => setHolder(e.target.value)}
          autoComplete="cc-name"
          placeholder="Como aparece en la tarjeta"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Vence (MM/YY)"
            value={expiry}
            onChange={(e) => handleExpiry(e.target.value)}
            inputMode="numeric"
            placeholder="11/28"
            error={expiry.length >= 5 && !expiryValid ? 'Fecha inválida.' : undefined}
          />
          <Input
            label="CVV"
            type="password"
            value={cvv}
            onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
            inputMode="numeric"
            placeholder="123"
            hint="No se guarda"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={makeDefault}
            onChange={(e) => setMakeDefault(e.target.checked)}
            className="h-4 w-4 accent-brand-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Establecer como predeterminada
          </span>
        </label>

        {error && (
          <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700 dark:bg-danger-500/10 dark:text-danger-500">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
