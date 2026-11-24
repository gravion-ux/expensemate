import { expenseReducer } from '../src/store/expenseReducer';
import type { Expense } from '../src/types';

const base: Expense = {
  id: 'x1',
  amount: 100,
  categoryId: 'food',
  note: 'Test',
  date: '2026-11-01',
  createdAt: 1,
  updatedAt: 1,
};

describe('expenseReducer', () => {
  it('ADD prepends a new expense with id and timestamps', () => {
    const next = expenseReducer([], {
      type: 'ADD',
      expense: { amount: 250, categoryId: 'travel', note: 'Cab', date: '2026-11-24' },
    });
    expect(next).toHaveLength(1);
    expect(next[0].amount).toBe(250);
    expect(next[0].id).toBeTruthy();
    expect(next[0].createdAt).toBeGreaterThan(0);
  });

  it('UPDATE changes only the targeted expense', () => {
    const state = [base, { ...base, id: 'x2', amount: 5 }];
    const next = expenseReducer(state, {
      type: 'UPDATE',
      id: 'x2',
      changes: { amount: 42, note: 'Edited' },
    });
    expect(next[0].amount).toBe(100);
    expect(next[1].amount).toBe(42);
    expect(next[1].note).toBe('Edited');
    expect(next[1].updatedAt).toBeGreaterThanOrEqual(base.updatedAt);
  });

  it('DELETE removes the targeted expense', () => {
    const state = [base, { ...base, id: 'x2' }];
    const next = expenseReducer(state, { type: 'DELETE', id: 'x1' });
    expect(next.map((e) => e.id)).toEqual(['x2']);
  });

  it('HYDRATE replaces state and ignores non-arrays', () => {
    const next = expenseReducer([], { type: 'HYDRATE', expenses: [base] });
    expect(next).toEqual([base]);
    // @ts-expect-error deliberately malformed payload
    const same = expenseReducer([base], { type: 'HYDRATE', expenses: 'junk' });
    expect(same).toEqual([base]);
  });

  it('CLEAR empties the list', () => {
    expect(expenseReducer([base], { type: 'CLEAR' })).toEqual([]);
  });

  it('does not mutate the previous state', () => {
    const state = [base];
    const next = expenseReducer(state, { type: 'DELETE', id: 'nope' });
    expect(state).toHaveLength(1);
    expect(next).toHaveLength(1);
  });
});
