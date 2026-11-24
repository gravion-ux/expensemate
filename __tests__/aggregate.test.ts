import {
  categoryBreakdown,
  filterExpenses,
  isInMonth,
  largestExpense,
  monthlyTotals,
  totalAmount,
  totalForMonth,
} from '../src/utils/aggregate';
import type { Expense } from '../src/types';

function exp(partial: Partial<Expense>): Expense {
  return {
    id: partial.id ?? Math.random().toString(36),
    amount: 0,
    categoryId: 'food',
    note: '',
    date: '2026-11-10',
    createdAt: 1,
    updatedAt: 1,
    ...partial,
  };
}

const expenses: Expense[] = [
  exp({ id: 'a', amount: 200, categoryId: 'food', note: 'Lunch thali', date: '2026-11-05', createdAt: 3 }),
  exp({ id: 'b', amount: 300.5, categoryId: 'food', note: 'Groceries', date: '2026-11-12', createdAt: 2 }),
  exp({ id: 'c', amount: 150, categoryId: 'travel', note: 'Cab to office', date: '2026-11-12', createdAt: 5 }),
  exp({ id: 'd', amount: 999, categoryId: 'bills', note: 'Electricity bill', date: '2026-10-02', createdAt: 1 }),
  exp({ id: 'e', amount: 50, categoryId: 'travel', note: 'Metro card', date: '2026-10-20', createdAt: 4 }),
];

describe('totals', () => {
  it('totalAmount sums everything', () => {
    expect(totalAmount(expenses)).toBe(1699.5);
    expect(totalAmount([])).toBe(0);
  });
  it('totalForMonth only counts the given month', () => {
    expect(totalForMonth(expenses, 2026, 10)).toBe(650.5); // November (0-based 10)
    expect(totalForMonth(expenses, 2026, 9)).toBe(1049); // October
    expect(totalForMonth(expenses, 2026, 8)).toBe(0);
  });
  it('isInMonth matches year and month', () => {
    expect(isInMonth(expenses[0], 2026, 10)).toBe(true);
    expect(isInMonth(expenses[0], 2025, 10)).toBe(false);
  });
});

describe('categoryBreakdown', () => {
  it('groups, sums and sorts by total desc with shares', () => {
    const nov = expenses.filter((e) => isInMonth(e, 2026, 10));
    const breakdown = categoryBreakdown(nov);
    expect(breakdown.map((b) => b.category.id)).toEqual(['food', 'travel']);
    expect(breakdown[0].total).toBe(500.5);
    expect(breakdown[0].count).toBe(2);
    expect(breakdown[0].share).toBeCloseTo(500.5 / 650.5, 5);
    expect(breakdown[1].share).toBeCloseTo(150 / 650.5, 5);
  });
  it('handles an empty list', () => {
    expect(categoryBreakdown([])).toEqual([]);
  });
  it('falls back to the Other category for unknown ids', () => {
    const weird = [exp({ categoryId: 'spaceships', amount: 10 })];
    expect(categoryBreakdown(weird)[0].category.id).toBe('other');
  });
});

describe('monthlyTotals', () => {
  it('returns the last N months oldest-first, including empty months', () => {
    const result = monthlyTotals(expenses, 3, new Date(2026, 10, 24));
    expect(result).toEqual([
      { year: 2026, month: 8, total: 0 },
      { year: 2026, month: 9, total: 1049 },
      { year: 2026, month: 10, total: 650.5 },
    ]);
  });
  it('rolls over the year boundary', () => {
    const result = monthlyTotals([], 2, new Date(2026, 0, 15));
    expect(result[0]).toEqual({ year: 2025, month: 11, total: 0 });
    expect(result[1]).toEqual({ year: 2026, month: 0, total: 0 });
  });
});

describe('filterExpenses', () => {
  it('filters by month and sorts newest first', () => {
    const nov = filterExpenses(expenses, { year: 2026, month: 10 });
    expect(nov.map((e) => e.id)).toEqual(['c', 'b', 'a']);
  });
  it('filters by category', () => {
    const food = filterExpenses(expenses, { categoryId: 'food' });
    expect(food.map((e) => e.id)).toEqual(['b', 'a']);
  });
  it('searches note text and category label, case-insensitively', () => {
    expect(filterExpenses(expenses, { query: 'CAB' }).map((e) => e.id)).toEqual(['c']);
    expect(filterExpenses(expenses, { query: 'travel' }).map((e) => e.id)).toEqual(['c', 'e']);
  });
  it('combines filters', () => {
    const result = filterExpenses(expenses, { categoryId: 'travel', year: 2026, month: 9 });
    expect(result.map((e) => e.id)).toEqual(['e']);
  });
});

describe('largestExpense', () => {
  it('finds the biggest expense', () => {
    expect(largestExpense(expenses)?.id).toBe('d');
  });
  it('returns null for an empty list', () => {
    expect(largestExpense([])).toBeNull();
  });
});
