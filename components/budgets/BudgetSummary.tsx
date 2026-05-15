import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { formatCurrency } from './data';
import { budgetStyles as styles } from './styles';
import type { Budget } from './types';

type BudgetSummaryProps = {
  budget: Budget;
  budgetsCount: number;
  onDeleteBudget: () => void;
  spentPercent: number;
};

export function BudgetSummary({
  budget,
  budgetsCount,
  onDeleteBudget,
  spentPercent,
}: BudgetSummaryProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <View>
          <Text style={styles.sectionLabel}>Aktywny budżet</Text>
          <Text style={styles.activeTitle}>{budget.name}</Text>
        </View>
        <Pressable
          disabled={budgetsCount === 1}
          onPress={onDeleteBudget}
          style={[styles.deleteButton, budgetsCount === 1 ? styles.disabledButton : null]}>
          <Ionicons name="trash-outline" size={20} color="#B73E3E" />
        </Pressable>
      </View>

      <View style={styles.amountRow}>
        <View>
          <Text style={styles.amountLabel}>Dostępne</Text>
          <Text style={styles.amountValue}>{formatCurrency(budget.balance)}</Text>
        </View>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{spentPercent}% limitu</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${spentPercent}%` }]} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Wydane</Text>
          <Text style={styles.statValue}>{formatCurrency(budget.spent)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Limit</Text>
          <Text style={styles.statValue}>{formatCurrency(budget.limit)}</Text>
        </View>
      </View>
    </View>
  );
}
