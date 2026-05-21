// Validación y formato de IBAN (cuentas de liquidación).

export function normalizeIban(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

export function ibanCountry(value: string): string {
  return normalizeIban(value).slice(0, 2);
}

/** Valida estructura + checksum mod-97 (estándar IBAN). */
export function validateIban(value: string): boolean {
  const iban = normalizeIban(value);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;
  // Mueve los 4 primeros al final y reemplaza letras por números (A=10..Z=35).
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const expanded = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let remainder = 0;
  for (const digit of expanded) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}

/** Agrupa en bloques de 4 para mostrar mientras se escribe. */
export function formatIban(value: string): string {
  return normalizeIban(value).replace(/(.{4})/g, '$1 ').trim();
}

/** Enmascara dejando visibles país + últimos 4. Ej: CR05 •••• 4066. */
export function maskIban(value: string): string {
  const n = normalizeIban(value);
  if (n.length <= 8) return n;
  return `${n.slice(0, 4)} •••• ${n.slice(-4)}`;
}
