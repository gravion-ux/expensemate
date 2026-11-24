import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CategoryFilter } from '../components/CategoryFilter';
import { ExpenseItem } from '../components/ExpenseItem';
import type { RootStackParamList } from '../../App';
import { useExpenses } from '../store/ExpenseContext';
import { theme } from '../theme';
import type { Expense } from '../types';
import { filterExpenses, totalAmount } from '../utils/aggregate';
import { formatMoney, monthLabel } from '../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { expenses, hydrated, currency, deleteExpense } = useExpenses();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const now = new Date();
  const thisMonth = useMemo(
    () => expenses.filter((e) => {
      const [y, m] = e.date.split('-').map(Number);
      return y === now.getFullYear() && m - 1 === now.getMonth();
    }),
    [expenses],
  );
  const visible = useMemo(
    () => filterExpenses(expenses, { query, categoryId }),
    [expenses, query, categoryId],
  );

  const openEditor = (expense?: Expense) =>
    navigation.navigate('AddExpense', expense ? { expenseId: expense.id } : {});

  const confirmDelete = (expense: Expense) =>
    Alert.alert('Delete expense?', `${expense.note || 'This expense'} — ${formatMoney(expense.amount, currency)}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(expense.id) },
    ]);

  if (!hydrated) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Spent in {monthLabel(now.getFullYear(), now.getMonth())}</Text>
        <Text style={styles.summaryValue}>{formatMoney(totalAmount(thisMonth), currency)}</Text>
        <Text style={styles.summarySub}>
          {thisMonth.length} expense{thisMonth.length === 1 ? '' : 's'} this month · {expenses.length} total
        </Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search expenses…"
        placeholderTextColor={theme.textMuted}
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.chips}>
        <CategoryFilter selectedId={categoryId} onSelect={setCategoryId} />
      </View>

      <FlatList
        data={visible}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            currency={currency}
            onPress={openEditor}
            onLongPress={confirmDelete}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {expenses.length === 0
              ? 'No expenses yet. Tap + Add to record your first one.'
              : 'Nothing matches your search or filter.'}
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => openEditor()}>
        <Text style={styles.fabText}>+ Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 16 },
  centered: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  summaryCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 18,
    marginBottom: 14,
  },
  summaryLabel: { color: theme.textMuted, fontSize: 13 },
  summaryValue: { color: theme.text, fontSize: 32, fontWeight: '800', marginVertical: 4 },
  summarySub: { color: theme.textMuted, fontSize: 12 },
  search: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    color: theme.text,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 10,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  empty: { color: theme.textMuted, textAlign: 'center', marginTop: 40, fontSize: 14, lineHeight: 20 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: theme.accent,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 14,
    elevation: 4,
  },
  fabText: { color: theme.accentText, fontSize: 16, fontWeight: '800' },
});
