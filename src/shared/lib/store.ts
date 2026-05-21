// Selector del data-layer: usa Supabase cuando hay credenciales (.env), si no
// cae al mock en localStorage. Los consumidores siguen importando @shared/lib/store.
import { hasSupabase } from './supabase';
import * as mock from './mockStore';
import * as remote from './supabaseStore';

const on = hasSupabase;

export const getProfile = on ? remote.getProfile : mock.getProfile;
export const getProfileByUsername = on ? remote.getProfileByUsername : mock.getProfileByUsername;
export const listProfiles = on ? remote.listProfiles : mock.listProfiles;
export const isUsernameAvailable = on ? remote.isUsernameAvailable : mock.isUsernameAvailable;
export const createProfile = on ? remote.createProfile : mock.createProfile;
export const changeUsername = on ? remote.changeUsername : mock.changeUsername;
export const updateAvatar = on ? remote.updateAvatar : mock.updateAvatar;
export const listUsernameHistory = on ? remote.listUsernameHistory : mock.listUsernameHistory;
export const listWallets = on ? remote.listWallets : mock.listWallets;
export const createOrder = on ? remote.createOrder : mock.createOrder;
export const getOrder = on ? remote.getOrder : mock.getOrder;
export const listOrdersForProfile = on ? remote.listOrdersForProfile : mock.listOrdersForProfile;
export const listAllOrders = on ? remote.listAllOrders : mock.listAllOrders;
export const adminSetStatus = on ? remote.adminSetStatus : mock.adminSetStatus;
export const listLedgerForProfile = on ? remote.listLedgerForProfile : mock.listLedgerForProfile;
export const listLedgerForOrder = on ? remote.listLedgerForOrder : mock.listLedgerForOrder;
export const countInFlight = on ? remote.countInFlight : mock.countInFlight;
export const listCards = on ? remote.listCards : mock.listCards;
export const addCard = on ? remote.addCard : mock.addCard;
export const setDefaultCard = on ? remote.setDefaultCard : mock.setDefaultCard;
export const removeCard = on ? remote.removeCard : mock.removeCard;
export const topUpWallet = on ? remote.topUpWallet : mock.topUpWallet;
export const listPayoutAccounts = on ? remote.listPayoutAccounts : mock.listPayoutAccounts;
export const addPayoutAccount = on ? remote.addPayoutAccount : mock.addPayoutAccount;
export const setDefaultPayoutAccount = on
  ? remote.setDefaultPayoutAccount
  : mock.setDefaultPayoutAccount;
export const removePayoutAccount = on ? remote.removePayoutAccount : mock.removePayoutAccount;
export const resetDemo = on ? remote.resetDemo : mock.resetDemo;

// Backend-agnóstico: sesión (localStorage), helpers puros y constantes.
export {
  getSessionProfileId,
  setSessionProfileId,
  usernameChangeStatus,
  USERNAME_COOLDOWN_DAYS,
} from './mockStore';

export type {
  CreateProfileInput,
  CreateOrderInput,
  AddCardInput,
  AddPayoutInput,
  TopUpInput,
  UsernameChangeStatus,
} from './mockStore';
