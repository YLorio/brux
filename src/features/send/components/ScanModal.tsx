import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { AtSign, CameraOff } from 'lucide-react';
import { Button, Input } from '@shared/components/ui';
import { Modal } from '@shared/components/feedback';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Devuelve el @username detectado (sin @). */
  onResult: (username: string) => void;
}

/** Extrae el @username de un QR brux (https://brux.app/@user, @user o user). */
function parseUsername(value: string): string | null {
  const at = value.match(/@([a-z0-9_]{3,20})/i);
  if (at) return at[1].toLowerCase();
  const url = value.match(/brux\.app\/@?([a-z0-9_]{3,20})/i);
  if (url) return url[1].toLowerCase();
  const plain = value.trim().match(/^([a-z0-9_]{3,20})$/i);
  if (plain) return plain[1].toLowerCase();
  return null;
}

export function ScanModal({ open, onClose, onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const [cameraError, setCameraError] = useState(false);
  const [manual, setManual] = useState('');

  const finish = (username: string) => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    onResult(username);
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    setCameraError(false);

    const tick = () => {
      const v = videoRef.current;
      const c = canvasRef.current;
      if (v && c && v.readyState === v.HAVE_ENOUGH_DATA) {
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(v, 0, 0, c.width, c.height);
          const img = ctx.getImageData(0, 0, c.width, c.height);
          const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
          if (code) {
            const user = parseUsername(code.data);
            if (user) {
              finish(user);
              return;
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const v = videoRef.current;
        if (v) {
          v.srcObject = stream;
          void v.play();
          rafRef.current = requestAnimationFrame(tick);
        }
      })
      .catch(() => {
        if (active) setCameraError(true);
      });

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submitManual = () => {
    const user = parseUsername(manual);
    if (user) {
      setManual('');
      finish(user);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Escanear y pagar"
      description="Apunta al QR de un @username para enviarle un pago."
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-gray-900">
          {cameraError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-gray-400">
              <CameraOff className="h-7 w-7" aria-hidden />
              <p className="text-xs">Sin acceso a la cámara. Ingresa el @usuario abajo.</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              {/* Marco de escaneo */}
              <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-white/70" />
              <div className="pointer-events-none absolute inset-x-6 top-6 h-0.5 animate-pulse bg-brand-400 shadow-glow" />
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
          <span className="text-xs text-gray-400 dark:text-gray-500">o ingresa el usuario</span>
          <span className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="flex items-end gap-2">
          <Input
            label="@username"
            value={manual}
            onChange={(e) => setManual(e.target.value.replace(/\s/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && submitManual()}
            leftIcon={<AtSign className="h-4 w-4" />}
            placeholder="usuario"
          />
          <Button onClick={submitManual} disabled={!parseUsername(manual)}>
            Usar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
