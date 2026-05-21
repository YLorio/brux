import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import { Button } from '@shared/components/ui';

type Size = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: Size;
  footer?: ReactNode;
  children?: ReactNode;
  hideClose?: boolean;
}

const sizes: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
  hideClose = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative w-full rounded-t-2xl sm:rounded-2xl bg-white shadow-floating animate-scale-in',
          'dark:bg-surface-dark-elevated',
          'max-h-[92dvh] overflow-y-auto',
          sizes[size],
        )}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 sm:pt-6">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              )}
            </div>
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="shrink-0 -mr-1.5 -mt-1.5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>
        )}
        {children && <div className="px-5 sm:px-6 py-4">{children}</div>}
        {footer && (
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'brand';
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'brand',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3.5">
        {tone === 'danger' && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-500">
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
