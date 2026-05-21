// Capa de datos de configuración de cuenta. Delega en el store (swappable a Supabase).
export {
  changeUsername,
  updateAvatar,
  listUsernameHistory,
  usernameChangeStatus,
  USERNAME_COOLDOWN_DAYS,
  listPayoutAccounts,
  addPayoutAccount,
  setDefaultPayoutAccount,
  removePayoutAccount,
  type UsernameChangeStatus,
  type AddPayoutInput,
} from '@shared/lib/store';
