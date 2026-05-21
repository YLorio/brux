// Capa de datos de tarjetas. Delega en el store mock (swappable a Supabase).
export {
  listCards,
  addCard,
  setDefaultCard,
  removeCard,
  topUpWallet,
  type AddCardInput,
  type TopUpInput,
} from '@shared/lib/store';
