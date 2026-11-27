/** Pure formatting helpers — no React Native imports, unit-testable anywhere. */

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

export function currencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code + ' ';
}

/** Round to 2 decimals without floating-point noise (e.g. 0.1 + 0.2). */
export function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** "₹1,234.50" / "$42" — trailing .00 is trimmed for whole amounts. */
export function formatMoney(amount: number, currencyCode: string = 'INR'): string {
  const symbol = currencySymbol(currencyCode);
  const rounded = roundMoney(amount);
  const isWhole = Number.isInteger(rounded);
  const body = rounded.toLocaleString('en-IN', {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${body}`;
}

/** Parse user input like "250", "250.5", "₹250" or "1,200" into a number. NaN if invalid. */
export function parseAmount(input: string): number {
  // Accept "250", "250.5", "₹250", "1,200" — reject anything with letters,
  // a sign, or more than one decimal point instead of silently mangling it
  // (the old strip-everything approach turned "-5" into 5).
  const trimmed = input.trim().replace(/^[₹$€£]\s*/, '').replace(/,/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return NaN;
  const value = Number(trimmed);
  return Number.isFinite(value) ? roundMoney(value) : NaN;
}

/** yyyy-mm-dd for a Date, in local time. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function monthLabel(year: number, month: number): string {
  const name = MONTH_NAMES[month];
  return name ? `${name} ${year}` : `${year}`;
}

/** "2026-11-24" -> "24 Nov 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return iso;
  return `${d} ${MONTH_NAMES[m - 1].slice(0, 3)} ${y}`;
}

/** Small unique-enough id without an external uuid dependency. */
export function makeId(now: number = Date.now()): string {
  return `${now.toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}
