import { useState, type RefObject } from 'react';
import { Download, Share2, Check, Loader2 } from 'lucide-react';
import { toBlob, toPng } from 'html-to-image';
import { Button } from '@shared/components/ui';
import { useToast } from '@shared/components/feedback';

interface Props {
  /** Ref al nodo del comprobante que se va a renderizar como imagen. */
  targetRef: RefObject<HTMLElement>;
  /** Nombre base del archivo (sin extensión). */
  fileName: string;
}

const COMMON_OPTS = {
  pixelRatio: 2,
  cacheBust: true,
  backgroundColor: '#ffffff',
  // No empaquetamos las fonts en la captura: la Inter de Google ya está en
  // el documento y embeber WOFF2 dispara CORS en algunos navegadores.
  // El render se ve igual porque el navegador resuelve la fuente al pintar.
  skipFonts: true,
};

async function waitForReady(node: HTMLElement): Promise<void> {
  // Espera a que las fuentes estén listas — sin esto los primeros 200ms tras
  // mount la tipografía cae al sistema y la imagen sale distinta.
  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignoramos: si el browser no expone fonts.ready, seguimos */
    }
  }
  // Espera a que todas las <img> dentro del nodo estén cargadas. No hay
  // ninguna en el Receipt actual, pero queda como red de seguridad si se
  // añaden en el futuro.
  const imgs = Array.from(node.querySelectorAll('img'));
  await Promise.all(
    imgs.map(
      (img) =>
        img.complete ||
        new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  );
}

async function captureToPngBlob(node: HTMLElement): Promise<Blob> {
  await waitForReady(node);
  // Intento principal: toBlob (más eficiente, ideal para Web Share).
  try {
    const blob = await toBlob(node, COMMON_OPTS);
    if (blob && blob.size > 0) return blob;
    throw new Error('toBlob devolvió vacío');
  } catch (firstErr) {
    // Fallback: toPng → fetch → Blob. Algunas combos de navegador/
    // contenido fallan en toBlob pero no en toPng. Nos da una segunda chance
    // y un mensaje útil si también revienta.
    const dataUrl = await toPng(node, COMMON_OPTS).catch((err) => {
      throw new Error(
        `No se pudo renderizar la imagen. ` +
          `(${err instanceof Error ? err.message : String(err)} / ` +
          `${firstErr instanceof Error ? firstErr.message : String(firstErr)})`,
      );
    });
    const res = await fetch(dataUrl);
    return res.blob();
  }
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/** Botones de "Compartir" y "Descargar" para el comprobante. */
export function ShareReceipt({ targetRef, fileName }: Props) {
  const toast = useToast();
  const [busy, setBusy] = useState<'share' | 'download' | null>(null);
  const [doneShare, setDoneShare] = useState(false);
  const [doneDownload, setDoneDownload] = useState(false);

  const handleShare = async () => {
    if (!targetRef.current) {
      toast.error('No se pudo compartir', 'El comprobante aún no está listo.');
      return;
    }
    setBusy('share');
    try {
      const blob = await captureToPngBlob(targetRef.current);
      const file = new File([blob], `${fileName}.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        // Solo el archivo — nada de `title` ni `text`. Apps como WhatsApp,
        // si reciben texto + archivo, lo mandan como dos mensajes separados
        // y el usuario ve doble (imagen + caption suelta).
        await navigator.share({ files: [file] });
        setDoneShare(true);
        setTimeout(() => setDoneShare(false), 1500);
      } else {
        // Sin Web Share API (escritorio en general) → descargamos.
        downloadBlob(blob, `${fileName}.png`);
        toast.success(
          'Imagen descargada',
          'Tu navegador no soporta compartir archivos. Te la guardamos.',
        );
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return; // canceló el sheet
      toast.error(
        'No se pudo compartir',
        err instanceof Error ? err.message : 'Error desconocido.',
      );
    } finally {
      setBusy(null);
    }
  };

  const handleDownload = async () => {
    if (!targetRef.current) {
      toast.error('No se pudo descargar', 'El comprobante aún no está listo.');
      return;
    }
    setBusy('download');
    try {
      const blob = await captureToPngBlob(targetRef.current);
      downloadBlob(blob, `${fileName}.png`);
      setDoneDownload(true);
      setTimeout(() => setDoneDownload(false), 1500);
    } catch (err) {
      toast.error(
        'No se pudo descargar',
        err instanceof Error ? err.message : 'Error desconocido.',
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        fullWidth
        leftIcon={
          busy === 'share' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : doneShare ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )
        }
        disabled={busy !== null}
        onClick={handleShare}
      >
        {doneShare ? 'Compartido' : 'Compartir'}
      </Button>
      <Button
        variant="outline"
        fullWidth
        leftIcon={
          busy === 'download' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : doneDownload ? (
            <Check className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )
        }
        disabled={busy !== null}
        onClick={handleDownload}
      >
        {doneDownload ? 'Descargado' : 'Descargar PNG'}
      </Button>
    </div>
  );
}
