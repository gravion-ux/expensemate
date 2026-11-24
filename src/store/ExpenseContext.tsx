import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { Expense, NewExpense } from '../types';
import { expenseReducer } from './expenseReducer';

const EXPENSES_KEY = 'expensemate.expenses.v1';
const CURRENCY_KEY = 'expensemate.currency.v1';

interface ExpenseStore {
  expenses: Expense[];
  hydrated: boolean;
  currency: string;
  addExpense: (e: NewExpense) => void;
  updateExpense: (id: string, changes: Partial<NewExpense>) => void;
  deleteExpense: (id: string) => void;
  clearAll: () => void;
  setCurrency: (code: string) => void;
}

const ExpenseContext = createContext<ExpenseStore | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, dispatch] = useReducer(expenseReducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [currency, setCurrencyState] = useState('INR');

  // Load persisted state once on mount.
  useEffect(() => {
    (async () => {
      try {
        const [rawExpenses, rawCurrency] = await Promise.all([
          AsyncStorage.getItem(EXPENSES_KEY),
          AsyncStorage.getItem(CURRENCY_KEY),
        ]);
        if (rawExpenses) {
          dispatch({ type: 'HYDRATE', expenses: JSON.parse(rawExpenses) as Expense[] });
        }
        if (rawCurrency) setCurrencyState(rawCurrency);
      } catch {
        // Corrupt storage should never crash the app — start fresh.
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist on every change, but only after the initial load has finished
  // (otherwise the empty initial state would wipe stored data).
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)).catch(() => {});
  }, [expenses, hydrated]);

  const store = useMemo<ExpenseStore>(
    () => ({
      expenses,
      hydrated,
      currency,
      addExpense: (e) => dispatch({ type: 'ADD', expense: e }),
      updateExpense: (id, changes) => dispatch({ type: 'UPDATE', id, changes }),
      deleteExpense: (id) => dispatch({ type: 'DELETE', id }),
      clearAll: () => dispatch({ type: 'CLEAR' }),
      setCurrency: (code) => {
        setCurrencyState(code);
        AsyncStorage.setItem(CURRENCY_KEY, code).catch(() => {});
      },
    }),
    [expenses, hydrated, currency],
  );

  return <ExpenseContext.Provider value={store}>{children}</ExpenseContext.Provider>;
}

export function useExpenses(): ExpenseStore {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used inside <ExpenseProvider>');
  return ctx;
}
