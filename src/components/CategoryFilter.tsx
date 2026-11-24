import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { CATEGORIES } from '../utils/categories';

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

/** Horizontal-ish wrap of category chips for filtering; includes an "All" chip. */
export function CategoryFilter({ selectedId, onSelect }: Props) {
  return (
    <>
      <TouchableOpacity
        style={[styles.chip, selectedId === null && styles.chipActive]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.chipText, selectedId === null && styles.chipTextActive]}>All</Text>
      </TouchableOpacity>
      {CATEGORIES.map((c) => {
        const active = selectedId === c.id;
        return (
          <TouchableOpacity
            key={c.id}
            style={[styles.chip, active && { backgroundColor: c.color, borderColor: c.color }]}
            onPress={() => onSelect(active ? null : c.id)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {c.icon} {c.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: theme.accent, borderColor: theme.accent },
  chipText: { color: theme.textMuted, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: theme.accentText },
});
