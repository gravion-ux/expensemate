import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme';
import type { Expense } from '../types';
import { getCategory } from '../utils/categories';
import { formatDate, formatMoney } from '../utils/format';

interface Props {
  expense: Expense;
  currency: string;
  onPress: (expense: Expense) => void;
  onLongPress?: (expense: Expense) => void;
}

export function ExpenseItem({ expense, currency, onPress, onLongPress }: Props) {
  const category = getCategory(expense.categoryId);
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(expense)}
      onLongPress={onLongPress ? () => onLongPress(expense) : undefined}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBadge, { backgroundColor: category.color + '26' }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.note} numberOfLines={1}>
          {expense.note || category.label}
        </Text>
        <Text style={styles.sub}>
          {category.label} · {formatDate(expense.date)}
        </Text>
      </View>
      <Text style={styles.amount}>{formatMoney(expense.amount, currency)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 12,
    marginBottom: 10,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 20 },
  middle: { flex: 1 },
  note: { color: theme.text, fontSize: 15, fontWeight: '600' },
  sub: { color: theme.textMuted, fontSize: 12, marginTop: 2 },
  amount: { color: theme.text, fontSize: 15, fontWeight: '700' },
});
