import { useState } from 'react';
import { Plus, CreditCard, Wallet as WalletIcon, Star, Trash2 } from 'lucide-react';
import { Badge, Button, Card, CardHeader, CardTitle } from '@shared/components/ui';
import { ConfirmModal, EmptyState, Loader, useToast } from '@shared/components/feedback';
import { useAuth } from '@features/auth';
import { useCards, useRemoveCard, useSetDefaultCard } from '../hooks/useCards';
import { CreditCardVisual } from '../components/CreditCardVisual';
import { AddCardModal } from '../components/AddCardModal';
import { TopUpModal } from '../components/TopUpModal';

export function CardsPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const cards = useCards(profile?.id);
  const setDefault = useSetDefaultCard();
  const remove = useRemoveCard();

  const [addOpen, setAddOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);

  if (!profile) return null;

  const list = cards.data ?? [];
  const defaultCard = list.find((c) => c.is_default) ?? list[0];

  const handleSetDefault = async (id: string) => {
    await setDefault.mutateAsync(id);
    toast.success('Tarjeta predeterminada actualizada');
  };

  const handleRemove = async () => {
    if (!removeId) return;
    await remove.mutateAsync(removeId);
    setRemoveId(null);
    toast.success('Tarjeta eliminada');
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Guarda tus tarjetas para recargar tu saldo. Por seguridad solo almacenamos los últimos 4
        dígitos; nunca el número completo ni el CVV.
      </p>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle>Tarjetas guardadas</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setAddOpen(true)}
            >
              <span className="hidden sm:inline">Agregar tarjeta</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
            <Button
              size="sm"
              leftIcon={<WalletIcon className="h-4 w-4" />}
              disabled={list.length === 0}
              onClick={() => setTopUpOpen(true)}
            >
              Recargar
            </Button>
          </div>
        </CardHeader>

        {cards.isLoading ? (
          <Loader className="py-12" label="Cargando tarjetas…" />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-6 w-6" />}
            title="Sin tarjetas"
            description="Agrega una tarjeta para recargar tu saldo en el sandbox."
            action={
              <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
                Agregar tarjeta
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
            {list.map((c) => (
              <div key={c.id} className="flex flex-col gap-3">
                <CreditCardVisual card={c} />
                <div className="flex items-center justify-between px-1">
                  {c.is_default ? (
                    <Badge tone="brand" dot>
                      Predeterminada
                    </Badge>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(c.id)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                    >
                      <Star className="h-4 w-4" aria-hidden /> Predeterminada
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setRemoveId(c.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-danger-600 dark:text-gray-400 dark:hover:text-danger-500"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AddCardModal open={addOpen} onClose={() => setAddOpen(false)} profileId={profile.id} />
      <TopUpModal
        open={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        profileId={profile.id}
        card={defaultCard}
      />
      <ConfirmModal
        open={!!removeId}
        onClose={() => setRemoveId(null)}
        onConfirm={handleRemove}
        title="¿Eliminar esta tarjeta?"
        description="Dejará de estar disponible para recargas."
        confirmLabel="Eliminar"
        tone="danger"
        loading={remove.isPending}
      />
    </div>
  );
}
