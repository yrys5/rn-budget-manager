import { Pressable, ScrollView, Text } from 'react-native';

import { formatCurrency } from '@/shared/model/finance';
import { budgetStyles as styles } from './styles';
import type { Budget } from '@/shared/model/finance';

type BudgetListProps = {
  activeBudgetId?: string;
  budgets: Budget[];
  onSelectBudget: (budgetId: string) => void;
};

export function BudgetList({ activeBudgetId, budgets, onSelectBudget }: BudgetListProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.budgetList}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {budgets.map((budget) => {
        const isActive = budget.id === activeBudgetId;

        return (
          <Pressable
            key={budget.id}
            onPress={() => onSelectBudget(budget.id)}
            style={[styles.budgetCard, isActive ? styles.budgetCardActive : null]}>
            <Text style={[styles.budgetName, isActive ? styles.budgetNameActive : null]}>
              {budget.name}
            </Text>
            <Text style={[styles.budgetBalance, isActive ? styles.budgetBalanceActive : null]}>
              {formatCurrency(budget.balance)}
            </Text>
            <Text style={[styles.budgetMeta, isActive ? styles.budgetMetaActive : null]}>
              {budget.categories.length} kategorii
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
