import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../../App';
import { useExpenses } from '../store/ExpenseContext';
import { theme } from '../theme';
import { CATEGORIES } from '../utils/categories';
import { parseAmount, todayISO } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

/** One screen for both adding a new expense and editing an existing one. */
export function AddExpenseScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();

  const existing = route.params?.expenseId
    ? expenses.find((e) => e.id === route.params.expenseId)
    : undefined;

  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? CATEGORIES[0].id);
  const [date, setDate] = useState(existing?.date ?? todayISO());

  const save = () => {
    const value = parseAmount(amount);
    if (Number.isNaN(value) || value <= 0) {
      Alert.alert('Invalid amount', 'Please enter an amount greater than zero.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Invalid date', 'Use the format YYYY-MM-DD.');
      return;
    }
    const payload = { amount: value, note: note.trim(), categoryId, date };
    if (existing) {
      updateExpense(existing.id, payload);
    } else {
      addExpense(payload);
    }
    navigation.goBack();
  };

  const remove = () => {
    if (!existing) return;
    Alert.alert('Delete expense?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteExpense(existing.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.amountInput}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={theme.textMuted}
        value={amount}
        onChangeText={setAmount}
        autoFocus={!existing}
      />

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={styles.input}
        placeholder="What was this for?"
        placeholderTextColor={theme.textMuted}
        value={note}
        onChangeText={setNote}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((c) => {
          const active = categoryId === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.categoryTile,
                active && { borderColor: c.color, backgroundColor: c.color + '22' },
              ]}
              onPress={() => setCategoryId(c.id)}
            >
              <Text style={styles.categoryIcon}>{c.icon}</Text>
              <Text style={[styles.categoryLabel, active && { color: theme.text }]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="2026-11-24"
        placeholderTextColor={theme.textMuted}
      />

      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Text style={styles.saveText}>{existing ? 'Save changes' : 'Add expense'}</Text>
      </TouchableOpacity>

      {existing && (
        <TouchableOpacity style={styles.deleteButton} onPress={remove}>
          <Text style={styles.deleteText}>Delete expense</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  label: { color: theme.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  amountInput: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    color: theme.text,
    fontSize: 30,
    fontWeight: '800',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    color: theme.text,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryTile: {
    width: '31%',
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    paddingVertical: 12,
    alignItems: 'center',
  },
  categoryIcon: { fontSize: 22, marginBottom: 4 },
  categoryLabel: { color: theme.textMuted, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  saveButton: {
    backgroundColor: theme.accent,
    borderRadius: theme.radius,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  saveText: { color: theme.accentText, fontSize: 16, fontWeight: '800' },
  deleteButton: { paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  deleteText: { color: theme.danger, fontSize: 15, fontWeight: '600' },
});
