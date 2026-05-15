import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatCurrency, getMonthLabel, initialBudgets } from '@/components/budgets/data';
import type { Budget, Category } from '@/components/budgets/types';
import {
  initialFamilies,
  initialFamilyBudgets,
  initialFamilyMembers,
  initialUsers,
} from '@/components/family/data';
import { initialGoals } from '@/components/goals/data';
import { initialTransactions } from '@/components/transactions/data';
import type { Transaction } from '@/components/transactions/types';

type IconName = ComponentProps<typeof Ionicons>['name'];

const currentMonth = 5;
const currentYear = 2026;

const quickStats: { label: string; icon: IconName; value: string }[] = [
  { label: 'Budżety', icon: 'wallet-outline', value: `${initialBudgets.length}` },
  { label: 'Transakcje', icon: 'swap-horizontal-outline', value: `${initialTransactions.length}` },
  { label: 'Cele', icon: 'flag-outline', value: `${initialGoals.length}` },
  { label: 'Rodziny', icon: 'people-outline', value: `${initialFamilies.length}` },
];

const findCategory = (transaction: Transaction) => {
  const budget = initialBudgets.find((item) => item.id === transaction.budgetId);
  const category = budget?.categories.find((item) => item.id === transaction.categoryId);

  return { budget, category };
};

const formatSignedCurrency = (value: number) => {
  const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${prefix}${Math.abs(value).toLocaleString('pl-PL')} PLN`;
};

const getBudgetUsage = (budget: Budget) =>
  budget.limit > 0 ? Math.min(Math.round((budget.spent / budget.limit) * 100), 100) : 0;

const getGoalProgress = (currentAmount: number, targetAmount: number) =>
  targetAmount > 0 ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100) : 0;

const getCategorySpend = (budgetId: string, category: Category) =>
  initialTransactions
    .filter((transaction) => {
      const isCurrentPeriod = transaction.transactionDate.startsWith(
        `${currentYear}-${`${currentMonth}`.padStart(2, '0')}`,
      );

      return (
        isCurrentPeriod &&
        transaction.budgetId === budgetId &&
        transaction.categoryId === category.id &&
        category.type === 'Wydatek'
      );
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);

const monthTransactions = initialTransactions.filter((transaction) =>
  transaction.transactionDate.startsWith(`${currentYear}-${`${currentMonth}`.padStart(2, '0')}`),
);

const monthBalance = monthTransactions.reduce((sum, transaction) => {
  const { category } = findCategory(transaction);
  const signedAmount = category?.type === 'Przychód' ? transaction.amount : -transaction.amount;

  return sum + signedAmount;
}, 0);

const monthExpenses = monthTransactions.reduce((sum, transaction) => {
  const { category } = findCategory(transaction);

  return category?.type === 'Wydatek' ? sum + transaction.amount : sum;
}, 0);

const totalBalance = initialBudgets.reduce((sum, budget) => sum + budget.balance, 0);
const totalSpent = initialBudgets.reduce((sum, budget) => sum + budget.spent, 0);
const totalLimit = initialBudgets.reduce((sum, budget) => sum + budget.limit, 0);
const totalUsage = totalLimit > 0 ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100) : 0;
const totalGoalTarget = initialGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
const totalGoalSaved = initialGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
const goalsProgress = getGoalProgress(totalGoalSaved, totalGoalTarget);
const pulseScore = Math.round((100 - totalUsage) * 0.45 + goalsProgress * 0.35 + 20);
const pulseLabel = pulseScore >= 75 ? 'Spokojny rytm' : pulseScore >= 55 ? 'Pod kontrolą' : 'Wymaga uwagi';

const limitInsights = initialBudgets
  .flatMap((budget) =>
    budget.limits.map((limit) => {
      const category = budget.categories.find((item) => item.id === limit.categoryId);
      const spent = category ? getCategorySpend(budget.id, category) : 0;
      const progress =
        limit.limitAmount > 0 ? Math.min(Math.round((spent / limit.limitAmount) * 100), 100) : 0;

      return {
        id: limit.id,
        budgetName: budget.name,
        category,
        limit,
        progress,
        spent,
      };
    }),
  )
  .sort((firstLimit, secondLimit) => secondLimit.progress - firstLimit.progress)
  .slice(0, 3);

const latestTransactions = initialTransactions
  .slice()
  .sort((firstTransaction, secondTransaction) =>
    secondTransaction.transactionDate.localeCompare(firstTransaction.transactionDate),
  )
  .slice(0, 3);

const nearestGoals = initialGoals
  .slice()
  .sort((firstGoal, secondGoal) => firstGoal.targetDate.localeCompare(secondGoal.targetDate))
  .slice(0, 2);

const primaryFamily = initialFamilies[0];
const primaryFamilyMembers = initialFamilyMembers.filter(
  (member) => member.familyId === primaryFamily.id,
);
const primaryFamilyBudgets = initialFamilyBudgets.filter(
  (familyBudget) => familyBudget.familyId === primaryFamily.id,
);
const familyMemberNames = primaryFamilyMembers
  .map((member) => initialUsers.find((user) => user.id === member.userId)?.username)
  .filter((username): username is string => Boolean(username))
  .join(', ');

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Dzień dobry</Text>
            <Text style={styles.title}>Pulpit finansów</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MK</Text>
          </View>
        </View>

        <View style={styles.pulseCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionLabel}>Puls finansów</Text>
              <Text style={styles.pulseTitle}>{pulseLabel}</Text>
            </View>
            <View style={styles.pulseScore}>
              <Text style={styles.pulseScoreText}>{pulseScore}</Text>
            </View>
          </View>

          <View style={styles.pulseRows}>
            <View style={styles.pulseRow}>
              <Text style={styles.pulseLabel}>Wykorzystanie budżetów</Text>
              <Text style={styles.pulseValue}>{totalUsage}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${totalUsage}%` }]} />
            </View>

            <View style={styles.pulseRow}>
              <Text style={styles.pulseLabel}>Postęp celów</Text>
              <Text style={styles.pulseValue}>{goalsProgress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.goalProgressFill, { width: `${goalsProgress}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Saldo budżetów</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalBalance)}</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>{getMonthLabel(currentMonth)} {currentYear}</Text>
            <Text style={[styles.summaryValue, monthBalance >= 0 ? styles.positiveAmount : null]}>
              {formatSignedCurrency(monthBalance)}
            </Text>
          </View>
        </View>

        <View style={styles.quickGrid}>
          {quickStats.map((stat) => (
            <View key={stat.label} style={styles.quickAction}>
              <View style={styles.quickIcon}>
                <Ionicons name={stat.icon} size={21} color="#10251F" />
              </View>
              <Text style={styles.quickValue}>{stat.value}</Text>
              <Text style={styles.quickText}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budżety</Text>
            <Text style={styles.sectionAction}>{formatCurrency(monthExpenses)} wydatków</Text>
          </View>
          <View style={styles.budgetList}>
            {initialBudgets.map((budget) => {
              const usage = getBudgetUsage(budget);

              return (
                <View key={budget.id} style={styles.budgetRow}>
                  <View style={styles.budgetHeader}>
                    <View>
                      <Text style={styles.budgetName}>{budget.name}</Text>
                      <Text style={styles.budgetMeta}>
                        {formatCurrency(budget.spent)} z {formatCurrency(budget.limit)}
                      </Text>
                    </View>
                    <Text style={styles.budgetUsage}>{usage}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${usage}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Limity warte uwagi</Text>
            <Text style={styles.sectionAction}>Maj</Text>
          </View>
          <View style={styles.limitList}>
            {limitInsights.map(({ budgetName, category, id, limit, progress, spent }) => (
              <View key={id} style={styles.limitRow}>
                <View
                  style={[
                    styles.limitIcon,
                    { backgroundColor: `${category?.color ?? '#66736E'}1A` },
                  ]}>
                  <Ionicons
                    name={category?.icon ?? 'speedometer-outline'}
                    size={20}
                    color={category?.color ?? '#66736E'}
                  />
                </View>
                <View style={styles.limitCopy}>
                  <Text style={styles.limitName}>{category?.name ?? 'Kategoria'}</Text>
                  <Text style={styles.limitMeta}>
                    {budgetName} · {spent.toLocaleString('pl-PL')} z{' '}
                    {limit.limitAmount.toLocaleString('pl-PL')} {limit.currency}
                  </Text>
                </View>
                <Text style={styles.limitValue}>{progress}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ostatnie transakcje</Text>
            <Text style={styles.sectionAction}>Najnowsze</Text>
          </View>
          <View style={styles.listCard}>
            {latestTransactions.map((transaction) => {
              const { budget, category } = findCategory(transaction);
              const isIncome = category?.type === 'Przychód';

              return (
                <View key={transaction.id} style={styles.transactionRow}>
                  <View
                    style={[
                      styles.transactionIcon,
                      { backgroundColor: `${category?.color ?? '#66736E'}1A` },
                    ]}>
                    <Ionicons
                      name={category?.icon ?? 'swap-horizontal-outline'}
                      size={21}
                      color={category?.color ?? '#66736E'}
                    />
                  </View>
                  <View style={styles.transactionCopy}>
                    <Text style={styles.transactionTitle}>{transaction.description}</Text>
                    <Text style={styles.transactionCategory}>
                      {budget?.name ?? 'Budżet'} · {category?.name ?? 'Kategoria'}
                    </Text>
                  </View>
                  <Text style={[styles.transactionAmount, isIncome ? styles.positiveAmount : null]}>
                    {isIncome ? '+' : '-'}
                    {transaction.amount.toLocaleString('pl-PL')} {transaction.currency}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.smallCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cele</Text>
              <Ionicons name="flag-outline" size={22} color="#157348" />
            </View>
            {nearestGoals.map((goal) => {
              const progress = getGoalProgress(goal.currentAmount, goal.targetAmount);

              return (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalPercent}>{progress}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.goalProgressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.goalMeta}>do {goal.targetDate}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.smallCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rodzina</Text>
              <Ionicons name="people-outline" size={22} color="#157348" />
            </View>
            <Text style={styles.familyCount}>{primaryFamilyMembers.length} członków</Text>
            <Text style={styles.familyMeta}>{familyMemberNames}</Text>
            <Text style={styles.familyMeta}>{primaryFamilyBudgets.length} powiązane budżety</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },
  content: {
    gap: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#527469',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#10251F',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 36,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#D9F2E4',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    color: '#0E2A21',
    fontSize: 15,
    fontWeight: '800',
  },
  pulseCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    padding: 18,
    shadowColor: '#244035',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    color: '#66736E',
    fontSize: 14,
    fontWeight: '700',
  },
  pulseTitle: {
    color: '#10251F',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 38,
  },
  pulseScore: {
    alignItems: 'center',
    backgroundColor: '#E6F6EE',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  pulseScoreText: {
    color: '#0E2A21',
    fontSize: 20,
    fontWeight: '800',
  },
  pulseRows: {
    gap: 9,
  },
  pulseRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pulseLabel: {
    color: '#66736E',
    fontSize: 13,
    fontWeight: '700',
  },
  pulseValue: {
    color: '#243A33',
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    backgroundColor: '#DBE4DF',
    borderRadius: 999,
    height: 9,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#1D8E62',
    borderRadius: 999,
    height: '100%',
  },
  goalProgressFill: {
    backgroundColor: '#526E9E',
    borderRadius: 999,
    height: '100%',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryTile: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    padding: 14,
  },
  summaryLabel: {
    color: '#66736E',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryValue: {
    color: '#10251F',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 5,
    minHeight: 92,
    padding: 10,
  },
  quickIcon: {
    alignItems: 'center',
    backgroundColor: '#F0F5F2',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  quickValue: {
    color: '#10251F',
    fontSize: 16,
    fontWeight: '800',
  },
  quickText: {
    color: '#66736E',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#10251F',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionAction: {
    color: '#157348',
    fontSize: 13,
    fontWeight: '800',
  },
  budgetList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 14,
  },
  budgetRow: {
    gap: 8,
  },
  budgetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetName: {
    color: '#243A33',
    fontSize: 15,
    fontWeight: '800',
  },
  budgetMeta: {
    color: '#66736E',
    fontSize: 12,
    marginTop: 2,
  },
  budgetUsage: {
    color: '#10251F',
    fontSize: 14,
    fontWeight: '800',
  },
  limitList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  limitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 72,
  },
  limitIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  limitCopy: {
    flex: 1,
  },
  limitName: {
    color: '#243A33',
    fontSize: 15,
    fontWeight: '800',
  },
  limitMeta: {
    color: '#66736E',
    fontSize: 12,
    marginTop: 2,
  },
  limitValue: {
    color: '#10251F',
    fontSize: 15,
    fontWeight: '800',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  transactionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 68,
  },
  transactionIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  transactionCopy: {
    flex: 1,
  },
  transactionTitle: {
    color: '#243A33',
    fontSize: 15,
    fontWeight: '800',
  },
  transactionCategory: {
    color: '#66736E',
    fontSize: 13,
    marginTop: 2,
  },
  transactionAmount: {
    color: '#B73E3E',
    fontSize: 15,
    fontWeight: '800',
  },
  positiveAmount: {
    color: '#157348',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 12,
    minHeight: 176,
    padding: 14,
  },
  goalItem: {
    gap: 7,
  },
  goalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  goalName: {
    color: '#243A33',
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  goalPercent: {
    color: '#526E9E',
    fontSize: 13,
    fontWeight: '800',
  },
  goalMeta: {
    color: '#66736E',
    fontSize: 12,
  },
  familyCount: {
    color: '#243A33',
    fontSize: 20,
    fontWeight: '800',
  },
  familyMeta: {
    color: '#66736E',
    fontSize: 13,
    lineHeight: 18,
  },
});
