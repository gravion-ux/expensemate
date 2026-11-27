import {
  currencySymbol,
  formatDate,
  formatMoney,
  makeId,
  monthLabel,
  parseAmount,
  roundMoney,
  toISODate,
} from '../src/utils/format';

describe('roundMoney', () => {
  it('removes floating point noise', () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
    expect(roundMoney(10.005)).toBe(10.01);
  });
});

describe('formatMoney', () => {
  it('formats whole amounts without decimals', () => {
    expect(formatMoney(42, 'USD')).toBe('$42');
    expect(formatMoney(1200, 'INR')).toBe('₹1,200');
  });
  it('formats fractional amounts with 2 decimals', () => {
    expect(formatMoney(99.5, 'USD')).toBe('$99.50');
  });
  it('handles zero', () => {
    expect(formatMoney(0, 'EUR')).toBe('€0');
  });
});

describe('currencySymbol', () => {
  it('knows the built-in currencies', () => {
    expect(currencySymbol('INR')).toBe('₹');
    expect(currencySymbol('GBP')).toBe('£');
  });
  it('falls back to the code for unknown currencies', () => {
    expect(currencySymbol('JPY')).toBe('JPY ');
  });
});

describe('parseAmount', () => {
  it('parses plain and decorated input', () => {
    expect(parseAmount('250')).toBe(250);
    expect(parseAmount('250.5')).toBe(250.5);
    expect(parseAmount('₹1,200')).toBe(1200);
  });
  it('returns NaN for empty or non-numeric input', () => {
    expect(parseAmount('')).toBeNaN();
    expect(parseAmount('abc')).toBeNaN();
  });
});

describe('dates', () => {
  it('toISODate pads month and day', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toISODate(new Date(2026, 10, 24))).toBe('2026-11-24');
  });
  it('formatDate renders a friendly date', () => {
    expect(formatDate('2026-11-24')).toBe('24 Nov 2026');
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
  it('monthLabel names the month', () => {
    expect(monthLabel(2026, 10)).toBe('November 2026');
  });
});

describe('makeId', () => {
  it('produces non-empty unique-ish ids', () => {
    const a = makeId(1000);
    const b = makeId(1000);
    expect(a).toBeTruthy();
    expect(a).not.toBe(b);
  });
});

describe('parseAmount hardening', () => {
  it('rejects signs, letters and multiple decimal points', () => {
    expect(parseAmount('-5')).toBeNaN();
    expect(parseAmount('12a34')).toBeNaN();
    expect(parseAmount('1.2.3')).toBeNaN();
    expect(parseAmount('250.555')).toBeNaN();
  });
  it('still accepts grouped and symbol-prefixed amounts', () => {
    expect(parseAmount('$1,200.50')).toBe(1200.5);
    expect(parseAmount(' 42 ')).toBe(42);
  });
});

describe('date guards', () => {
  it('formatDate returns input for out-of-range months', () => {
    expect(formatDate('2026-13-01')).toBe('2026-13-01');
    expect(formatDate('2026-00-10')).toBe('2026-00-10');
  });
  it('monthLabel never renders undefined', () => {
    expect(monthLabel(2026, 12)).toBe('2026');
  });
});
