// Capa de datos de pagos. Hoy delega en el store mock; al migrar a Supabase
// solo cambia el cuerpo de estas funciones (o de las del store) por queries
// a `supabase.from('payment_orders')` / `ledger_entries`.
export {
  listOrdersForProfile,
  getOrder,
  listAllOrders,
  listLedgerForProfile,
  listLedgerForOrder,
  adminSetStatus,
  createOrder,
  type CreateOrderInput,
} from '@shared/lib/store';
