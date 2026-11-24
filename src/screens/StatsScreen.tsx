import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BreakdownBar } from '../components/BreakdownBar';
import { useExpenses } from '../store/ExpenseContext';
import { theme } from '../theme';
import {
  categoryBreakdown,
  filterExpenses,
  largestExpense,
  monthlyTotals,
  totalAmount,
} from '../utils/aggregate';
import { getCategory } from '../utils/categories';
import { formatDate, formatMoney, monthLabel } from '../utils/format';

export function StatsScreen() {
  const { expenses, currency } = useExpenses();
  const now = new Date();
  const [offset, setOffset] = useState(0); // 0 = this month, 1 = last month, …

  const view = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  const year = view.getFullYear();
  const month = view.getMonth();

  const monthExpenses = useMemo(
    () => filterExpenses(expenses, { year, month }),
    [expenses, year, month],
  );
  const breakdown = useMemo(() => categoryBreakdown(monthExpenses), [monthExpenses]);
  const trend = useMemo(() => monthlyTotals(expenses, 6), [expenses]);
  const maxTrend = Math.max(...trend.map((t) => t.total), 1);
  const biggest = largestExpense(monthExpenses);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.monthNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => setOffset((o) => o + 1)}>
          <Text style={styles.navText}>‹ Prev</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{monthLabel(year, month)}</Text>
        <TouchableOpacity
          style={[styles.navButton, offset === 0 && styles.navDisabled]}
          onPress={() => offset > 0 && setOffset((o) => o - 1)}
        >
          <Text style={styles.navText}>Next ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total spent</Text>
        <Text style={styles.totalValue}>{formatMoney(totalAmount(monthExpenses), currency)}</Text>
        <Text style={styles.totalSub}>
          {monthExpenses.length} expense{monthExpenses.length === 1 ? '' : 's'}
          {biggest
            ? ` · biggest: ${getCategory(biggest.categoryId).icon} ${formatMoney(biggest.amount, currency)} on ${formatDate(biggest.date)}`
            : ''}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>By category</Text>
      {breakdown.length === 0 ? (
        <Text style={styles.empty}>No expenses in this month.</Text>
      ) : (
        breakdown.map((item) => (
          <BreakdownBar key={item.category.id} item={item} currency={currency} />
        ))
      )}

      <Text style={styles.sectionTitle}>Last 6 months</Text>
      <View style={styles.trendCard}>
        {trend.map((t) => (
          <View key={`${t.year}-${t.month}`} style={styles.trendRow}>
            <Text style={styles.trendLabel}>{monthLabel(t.year, t.month).slice(0, 3)}</Text>
            <View style={styles.trendTrack}>
              <View
                style={[
                  styles.trendFill,
                  {
                    width: `${Math.max((t.total / maxTrend) * 100, t.total > 0 ? 3 : 0)}%`,
                    backgroundColor:
                      t.year === year && t.month === month ? theme.accent : '#64748b',
                  },
                ]}
              />
            </View>
            <Text style={styles.trendValue}>{formatMoney(t.total, currency)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navButton: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  navDisabled: { opacity: 0.4 },
  navText: { color: theme.text, fontSize: 13, fontWeight: '700' },
  monthTitle: { color: theme.text, fontSize: 17, fontWeight: '800' },
  totalCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 18,
    marginBottom: 20,
  },
  totalLabel: { color: theme.textMuted, fontSize: 13 },
  totalValue: { color: theme.text, fontSize: 30, fontWeight: '800', marginVertical: 4 },
  totalSub: { color: theme.textMuted, fontSize: 12, lineHeight: 17 },
  sectionTitle: { color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  empty: { color: theme.textMuted, fontSize: 14, marginBottom: 20 },
  trendCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 14,
  },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  trendLabel: { color: theme.textMuted, width: 38, fontSize: 12, fontWeight: '600' },
  trendTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.surfaceAlt,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  trendFill: { height: '100%', borderRadius: 4 },
  trendValue: { color: theme.text, width: 84, textAlign: 'right', fontSize: 12, fontWeight: '700' },
});
