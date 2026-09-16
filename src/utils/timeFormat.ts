/**
 * Utilidades de conversión entre horas decimales (como las guarda el backend
 * en BigDecimal) y el formato HH:MM que capturan/leen los usuarios.
 * Punto 3 del reporte de Ingeniería.
 */

/** 9756.67 -> "9756:40" */
export function decimalAHHMM(horas: number | string | null | undefined): string {
  if (horas === null || horas === undefined || horas === '') return '';
  const n = typeof horas === 'string' ? parseFloat(horas) : horas;
  if (isNaN(n) || n < 0) return '';
  const h = Math.floor(n);
  const m = Math.round((n - h) * 60);
  if (m === 60) return `${h + 1}:00`;
  return `${h}:${String(m).padStart(2, '0')}`;
}

/** "9756:40" -> 9756.67 | "6:30" -> 6.5 | "" -> null */
export function hhmmADecimal(hhmm: string | null | undefined): number | null {
  if (!hhmm || !hhmm.trim()) return null;
  const limpio = hhmm.trim();
  if (/^\d+(\.\d+)?$/.test(limpio)) return parseFloat(limpio);
  const m = limpio.match(/^(\d+):([0-5]?\d)$/);
  if (!m) return null;
  const h = parseInt(m[1] ?? '0', 10);
  const min = parseInt(m[2] ?? '0', 10);
  return Math.round((h + min / 60) * 100) / 100;
}

/** Valida HH:MM (horas sin tope, minutos 00-59) */
export function esHHMMValido(hhmm: string): boolean {
  return /^\d+:[0-5]\d$/.test(hhmm.trim());
}

/** Técnicos × horas decimales -> H.H. con 2 decimales */
export function calcularHH(tecnicos: number | null | undefined, horasDecimal: number | null | undefined): number | null {
  if (!tecnicos || !horasDecimal) return null;
  return Math.round(tecnicos * horasDecimal * 100) / 100;
}
