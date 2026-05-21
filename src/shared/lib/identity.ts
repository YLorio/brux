// Validación del documento de identidad según el país de lanzamiento.
// Se valida formato/longitud (no checksum) — suficiente para el sandbox.

export interface IdConfig {
  /** Nombre del documento en ese país. */
  label: string;
  placeholder: string;
  help: string;
  /** Patrón sobre el valor normalizado. */
  pattern: RegExp;
}

export const ID_CONFIG: Record<string, IdConfig> = {
  CR: { label: 'Cédula', placeholder: '1-2345-6789', help: '9 dígitos', pattern: /^\d{9}$/ },
  SV: { label: 'DUI', placeholder: '12345678-9', help: '9 dígitos', pattern: /^\d{9}$/ },
  AR: { label: 'DNI', placeholder: '12.345.678', help: '7 u 8 dígitos', pattern: /^\d{7,8}$/ },
  MX: {
    label: 'CURP',
    placeholder: 'GOMC900101HDFXXX09',
    help: '18 caracteres',
    pattern: /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]\d$/,
  },
  BR: { label: 'CPF', placeholder: '123.456.789-09', help: '11 dígitos', pattern: /^\d{11}$/ },
  CO: {
    label: 'Cédula de ciudadanía',
    placeholder: '1.234.567.890',
    help: '6 a 10 dígitos',
    pattern: /^\d{6,10}$/,
  },
};

const FALLBACK: IdConfig = {
  label: 'Documento',
  placeholder: '',
  help: '',
  pattern: /^.{4,}$/,
};

export function getIdConfig(countryCode: string): IdConfig {
  return ID_CONFIG[countryCode] ?? FALLBACK;
}

/** Normaliza el documento: CURP conserva letras (mayúsculas); el resto solo dígitos. */
export function normalizeId(countryCode: string, value: string): string {
  if (countryCode === 'MX') return value.replace(/[^a-z0-9]/gi, '').toUpperCase();
  return value.replace(/\D/g, '');
}

export function validateId(countryCode: string, value: string): boolean {
  return getIdConfig(countryCode).pattern.test(normalizeId(countryCode, value));
}
