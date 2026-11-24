export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: string;
  /** Amount in major currency units (e.g. rupees / dollars). */
  amount: number;
  categoryId: string;
  note: string;
  /** ISO date string, yyyy-mm-dd. */
  date: string;
  createdAt: number;
  updatedAt: number;
}

export type NewExpense = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

export interface CategoryBreakdown {
  category: Category;
  total: number;
  count: number;
  /** Share of the period total, 0..1. */
  share: number;
}

export interface ExpenseFilter {
  query?: string;
  categoryId?: string | null;
  /** 0-based month + full year; both must be set together to filter by month. */
  year?: number;
  month?: number;
}
