import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExpenses } from '../store/ExpenseContext';
import { theme } from '../theme';
import { CURRENCIES } from '../utils/format';

export function SettingsScreen() {
  const { expenses, currency, setCurrency, clearAll } = useExpenses();

  const confirmClear = () =>
    Alert.alert(
      'Delete all expenses?',
      `${expenses.length} expense(s) will be permanently removed from this device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete all', style: 'destructive', onPress: clearAll },
      ],
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Currency</Text>
      <View style={styles.card}>
        {CURRENCIES.map((c) => {
          const active = currency === c.code;
          return (
            <TouchableOpacity
              key={c.code}
              style={[styles.row, active && styles.rowActive]}
              onPress={() => setCurrency(c.code)}
            >
              <Text style={[styles.rowText, active && styles.rowTextActive]}>{c.label}</Text>
              {active && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Your data</Text>
      <View style={styles.card}>
        <Text style={styles.infoText}>
          {expenses.length} expense{expenses.length === 1 ? '' : 's'} stored locally on this
          device. ExpenseMate works fully offline — nothing leaves your phone.
        </Text>
        <TouchableOpacity style={styles.dangerButton} onPress={confirmClear}>
          <Text style={styles.dangerText}>Delete all expenses</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        ExpenseMate v1.0.0 · Built by Priyanshu Kumar Thakur (Gravion)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  sectionTitle: { color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 8 },
  card: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 6,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 10,
  },
  rowActive: { backgroundColor: theme.surfaceAlt },
  rowText: { color: theme.textMuted, fontSize: 15 },
  rowTextActive: { color: theme.text, fontWeight: '700' },
  check: { color: theme.accent, fontSize: 16, fontWeight: '800' },
  infoText: { color: theme.textMuted, fontSize: 13, lineHeight: 19, padding: 10 },
  dangerButton: {
    borderColor: theme.danger,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 6,
  },
  dangerText: { color: theme.danger, fontSize: 14, fontWeight: '700' },
  footer: { color: theme.textMuted, fontSize: 12, textAlign: 'center', marginTop: 8 },
});
