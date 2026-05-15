import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { formatCurrency } from '@/shared/model/finance';
import type { Budget } from '@/shared/model/finance';

import { familyStyles as styles } from './styles';
import type { FamilyBudget } from '@/shared/model/finance';

type FamilyBudgetsListProps = {
  budgets: Budget[];
  familyBudgets: FamilyBudget[];
  familyId: string;
};

export function FamilyBudgetsList({ budgets, familyBudgets, familyId }: FamilyBudgetsListProps) {
  const linkedBudgets = familyBudgets
    .filter((item) => item.familyId === familyId)
    .map((item) => budgets.find((budget) => budget.id === item.budgetId))
    .filter((budget): budget is Budget => Boolean(budget));

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Powiązane budżety</Text>
      </View>

      <View style={styles.listCard}>
        {linkedBudgets.length ? (
          linkedBudgets.map((budget) => (
            <View key={budget.id} style={styles.budgetRow}>
              <View style={styles.budgetIcon}>
                <Ionicons name="wallet-outline" size={19} color="#157348" />
              </View>
              <View style={styles.memberCopy}>
                <Text style={styles.memberName}>{budget.name}</Text>
                <Text style={styles.memberEmail}>
                  {formatCurrency(budget.balance)} · {budget.categories.length} kategorii
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={28} color="#66736E" />
            <Text style={styles.emptyTitle}>Brak budżetów</Text>
            <Text style={styles.emptyText}>Edytuj rodzinę i wybierz budżety, które ma obejmować.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
