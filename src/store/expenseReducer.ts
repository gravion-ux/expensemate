import type { Expense, NewExpense } from '../types';
import { makeId } from '../utils/format';

export type ExpenseAction =
  | { type: 'ADD'; expense: NewExpense }
  | { type: 'UPDATE'; id: string; changes: Partial<NewExpense> }
  | { type: 'DELETE'; id: string }
  | { type: 'HYDRATE'; expenses: Expense[] }
  | { type: 'CLEAR' };

/**
 * Pure reducer for the expense list — the heart of the store.
 * Kept free of React / AsyncStorage so it is fully unit-testable.
 */
export function expenseReducer(state: Expense[], action: ExpenseAction): Expense[] {
  switch (action.type) {
    case 'ADD': {
      const now = Date.now();
      const expense: Expense = {
        ...action.expense,
        id: makeId(now),
        createdAt: now,
        updatedAt: now,
      };
      return [expense, ...state];
    }
    case 'UPDATE':
      return state.map((e) =>
        e.id === action.id ? { ...e, ...action.changes, updatedAt: Date.now() } : e,
      );
    case 'DELETE':
      return state.filter((e) => e.id !== action.id);
    case 'HYDRATE':
      return Array.isArray(action.expenses) ? action.expenses : state;
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}
