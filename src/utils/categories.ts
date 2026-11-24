import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'food', label: 'Food & Drink', icon: '🍔', color: '#f97316' },
  { id: 'travel', label: 'Travel', icon: '🚕', color: '#38bdf8' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#e879f9' },
  { id: 'bills', label: 'Bills & Utilities', icon: '💡', color: '#facc15' },
  { id: 'health', label: 'Health', icon: '💊', color: '#4ade80' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#fb7185' },
  { id: 'education', label: 'Education', icon: '📚', color: '#a78bfa' },
  { id: 'other', label: 'Other', icon: '📦', color: '#94a3b8' },
];

const FALLBACK: Category = CATEGORIES[CATEGORIES.length - 1];

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? FALLBACK;
}
