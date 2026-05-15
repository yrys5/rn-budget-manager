import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { Budget } from '@/shared/model/finance';

import { goalStyles as styles } from './styles';
import type { SavingsGoal } from '@/shared/model/finance';

type GoalListProps = {
  budgets: Budget[];
  goals: SavingsGoal[];
  onCreateGoal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
};

export function GoalList({ budgets, goals, onCreateGoal, onEditGoal }: GoalListProps) {
  return (
    <View style={styles.list}>
      {goals.length ? (
        goals.map((goal) => {
          const budget = budgets.find((item) => item.id === goal.budgetId);
          const progress =
            goal.targetAmount > 0
              ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
              : 0;

          return (
            <Pressable key={goal.id} onPress={() => onEditGoal(goal)} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Ionicons name="flag-outline" size={22} color="#157348" />
                </View>
                <View style={styles.goalCopy}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalMeta}>
                    {budget?.name ?? 'Budżet'} · do {goal.targetDate}
                  </Text>
                </View>
                <Text style={styles.percentText}>{progress}%</Text>
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <View style={styles.amountRow}>
                <Text style={styles.amountText}>
                  {goal.currentAmount.toLocaleString('pl-PL')} {goal.currency}
                </Text>
                <Text style={styles.goalMeta}>
                  z {goal.targetAmount.toLocaleString('pl-PL')} {goal.currency}
                </Text>
              </View>
            </Pressable>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="flag-outline" size={28} color="#66736E" />
          <Text style={styles.emptyTitle}>Brak celów</Text>
          <Text style={styles.emptyText}>
            Dodaj pierwszy cel oszczędnościowy przypisany do wybranego budżetu.
          </Text>
          <Pressable onPress={onCreateGoal} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Dodaj cel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
