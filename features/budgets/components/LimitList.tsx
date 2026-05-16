import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { formatLimitCurrency, getMonthLabel } from '@/shared/model/finance';
import { budgetStyles as styles } from './styles';
import type { Budget, BudgetLimit } from '@/shared/model/finance';

type LimitListProps = {
  budget: Budget;
  onCreateLimit: () => void;
  onEditLimit: (limit: BudgetLimit) => void;
};

export function LimitList({ budget, onCreateLimit, onEditLimit }: LimitListProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Limity budżetowe</Text>
        <Pressable
          accessibilityLabel="Dodaj limit budżetowy"
          onPress={onCreateLimit}
          style={styles.sectionActionButton}>
          <Ionicons name="add" size={16} color="#157348" />
          <Text style={styles.sectionAction}>Limit</Text>
        </Pressable>
      </View>

      <View style={styles.limitList}>
        {budget.limits.length ? (
          budget.limits.map((limit) => {
            const category = budget.categories.find((item) => item.id === limit.categoryId);
            const progress = 0;

            return (
              <View key={limit.id} style={styles.limitRow}>
                <View
                  style={[
                    styles.limitIcon,
                    { backgroundColor: `${category?.color ?? '#66736E'}1A` },
                  ]}>
                  <Ionicons
                    name={category?.icon ?? 'speedometer-outline'}
                    size={21}
                    color={category?.color ?? '#66736E'}
                  />
                </View>
                <View style={styles.limitCopy}>
                  <Text style={styles.limitName}>{category?.name ?? 'Usunięta kategoria'}</Text>
                  <Text style={styles.limitMeta}>
                    {getMonthLabel(limit.periodMonth)} {limit.periodYear} · {progress}% użycia
                  </Text>
                  <View style={styles.limitProgressTrack}>
                    <View
                      style={[
                        styles.limitProgressFill,
                        {
                          backgroundColor: category?.color ?? '#66736E',
                          width: `${progress}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.limitAmount}>
                  {formatLimitCurrency(limit.limitAmount, limit.currency)}
                </Text>
                <Pressable
                  hitSlop={10}
                  onPress={() => onEditLimit(limit)}
                  style={styles.categoryEditButton}>
                  <Ionicons name="create-outline" size={18} color="#40534B" />
                </Pressable>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="speedometer-outline" size={28} color="#66736E" />
            <Text style={styles.emptyTitle}>Brak limitów</Text>
            <Text style={styles.emptyText}>
              Dodaj limit miesięczny do wybranej kategorii w tym budżecie.
            </Text>
            <Pressable
              accessibilityLabel="Dodaj limit budżetowy"
              onPress={onCreateLimit}
              style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Dodaj limit</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
