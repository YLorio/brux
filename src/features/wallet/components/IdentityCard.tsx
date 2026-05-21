import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, AtSign } from 'lucide-react';
import type { Profile } from '@/shared/types';
import { Modal, useToast } from '@shared/components/feedback';
import { Button } from '@shared/components/ui';

export function paymentLink(username: string): string {
  return `https://brux.app/@${username}`;
}

interface QrModalProps {
  profile: Profile;
  open: boolean;
  onClose: () => void;
}

export function QrModal({ profile, open, onClose }: QrModalProps) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const link = paymentLink(profile.username);

  const copy = async () => {
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
    <Modal open={open} onClose={onClose} title="Recibir un pago" size="sm">
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Comparte tu @username o este QR. No necesitas dar datos bancarios.
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700">
          <QRCodeSVG value={link} size={176} fgColor="#111827" bgColor="#FFFFFF" level="M" />
        </div>
        <div className="flex w-full items-center justify-between gap-3 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
          <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
            <AtSign className="h-4 w-4 text-brand-500" aria-hidden />
            {profile.username}
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <Button variant="outline" fullWidth onClick={onClose}>
          Listo
        </Button>
      </div>
    </Modal>
  );
}
