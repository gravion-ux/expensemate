import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { CategoryBreakdown } from '../types';
import { formatMoney } from '../utils/format';

interface Props {
  item: CategoryBreakdown;
  currency: string;
}

/** One row of the Stats breakdown: label, a proportional bar drawn with Views, total. */
export function BreakdownBar({ item, currency }: Props) {
  const pct = Math.round(item.share * 100);
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {item.category.icon} {item.category.label}
        </Text>
        <Text style={styles.value}>
          {formatMoney(item.total, currency)} · {pct}%
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.max(pct, 2)}%`, backgroundColor: item.category.color },
          ]}
        />
      </View>
      <Text style={styles.count}>
        {item.count} expense{item.count === 1 ? '' : 's'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: theme.text, fontSize: 14, fontWeight: '600' },
  value: { color: theme.text, fontSize: 14, fontWeight: '700' },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.surfaceAlt,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 5 },
  count: { color: theme.textMuted, fontSize: 12, marginTop: 4 },
});
