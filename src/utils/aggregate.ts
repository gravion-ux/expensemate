import type { CategoryBreakdown, Expense, ExpenseFilter } from '../types';
import { getCategory } from './categories';
import { roundMoney } from './format';

/** Extract {year, month(0-based)} from an ISO date string. */
export function yearMonthOf(iso: string): { year: number; month: number } {
  const [y, m] = iso.split('-').map(Number);
  return { year: y, month: m - 1 };
}

export function isInMonth(expense: Expense, year: number, month: number): boolean {
  const ym = yearMonthOf(expense.date);
  return ym.year === year && ym.month === month;
}

export function totalAmount(expenses: Expense[]): number {
  return roundMoney(expenses.reduce((sum, e) => sum + e.amount, 0));
}

export function totalForMonth(expenses: Expense[], year: number, month: number): number {
  return totalAmount(expenses.filter((e) => isInMonth(e, year, month)));
}

/** Per-category totals for a set of expenses, sorted by total descending. */
export function categoryBreakdown(expenses: Expense[]): CategoryBreakdown[] {
  const total = totalAmount(expenses);
  const byCategory = new Map<string, { total: number; count: number }>();
  for (const e of expenses) {
    const entry = byCategory.get(e.categoryId) ?? { total: 0, count: 0 };
    entry.total = roundMoney(entry.total + e.amount);
    entry.count += 1;
    byCategory.set(e.categoryId, entry);
  }
  return [...byCategory.entries()]
    .map(([categoryId, entry]) => ({
      category: getCategory(categoryId),
      total: entry.total,
      count: entry.count,
      share: total > 0 ? entry.total / total : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

/** Totals for each of the last `count` months, oldest first, including empty months. */
export function monthlyTotals(
  expenses: Expense[],
  count: number,
  now: Date = new Date(),
): { year: number; month: number; total: number }[] {
  const result: { year: number; month: number; total: number }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    result.push({ year, month, total: totalForMonth(expenses, year, month) });
  }
  return result;
}

/** Apply search text + category + month filters; result sorted newest first. */
export function filterExpenses(expenses: Expense[], filter: ExpenseFilter): Expense[] {
  const query = filter.query?.trim().toLowerCase();
  return expenses
    .filter((e) => {
      if (filter.categoryId && e.categoryId !== filter.categoryId) return false;
      if (filter.year !== undefined && filter.month !== undefined) {
        if (!isInMonth(e, filter.year, filter.month)) return false;
      }
      if (query) {
        const haystack = `${e.note} ${getCategory(e.categoryId).label}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));
}

/** The single biggest expense in a set, or null when empty. */
export function largestExpense(expenses: Expense[]): Expense | null {
  if (expenses.length === 0) return null;
  return expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0]);
}
