import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconName = ComponentProps<typeof Ionicons>['name'];

const budgets = [
  { name: 'Domowy', amount: '4 280 zł', active: true },
  { name: 'Wakacje', amount: '1 850 zł', active: false },
  { name: 'Rodzina', amount: '6 120 zł', active: false },
];

const quickActions: { label: string; icon: IconName }[] = [
  { label: 'Budżet', icon: 'wallet-outline' },
  { label: 'Transakcja', icon: 'swap-horizontal-outline' },
  { label: 'Limit', icon: 'speedometer-outline' },
  { label: 'Cel', icon: 'flag-outline' },
];

const transactions: { title: string; category: string; amount: string; icon: IconName }[] = [
  { title: 'Zakupy spożywcze', category: 'Jedzenie', amount: '-184 zł', icon: 'cart-outline' },
  { title: 'Wynagrodzenie', category: 'Przychody', amount: '+5 800 zł', icon: 'cash-outline' },
  { title: 'Netflix', category: 'Subskrypcje', amount: '-43 zł', icon: 'play-circle-outline' },
];

const limits = [
  { name: 'Jedzenie', value: '72%', color: '#1D8E62' },
  { name: 'Rozrywka', value: '48%', color: '#D89D26' },
  { name: 'Transport', value: '31%', color: '#466B8F' },
];

const goals = [
  { name: 'Poduszka finansowa', saved: '8 400 zł', progress: '56%' },
  { name: 'Nowy laptop', saved: '2 100 zł', progress: '42%' },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Dzień dobry</Text>
            <Text style={styles.title}>Twój pulpit</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MK</Text>
          </View>
        </View>

        <View style={styles.budgetStrip}>
          {budgets.map((budget) => (
            <View
              key={budget.name}
              style={[styles.budgetPill, budget.active ? styles.budgetPillActive : null]}>
              <Text style={[styles.budgetName, budget.active ? styles.budgetNameActive : null]}>
                {budget.name}
              </Text>
              <Text style={[styles.budgetAmount, budget.active ? styles.budgetAmountActive : null]}>
                {budget.amount}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionLabel}>Budżet Domowy</Text>
              <Text style={styles.balance}>4 280 zł</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="analytics-outline" size={24} color="#157348" />
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Wydane</Text>
              <Text style={styles.statValue}>3 120 zł</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Limit</Text>
              <Text style={styles.statValue}>7 400 zł</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Okres</Text>
              <Text style={styles.statValue}>Maj</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <View key={action.label} style={styles.quickAction}>
              <View style={styles.quickIcon}>
                <Ionicons name={action.icon} size={22} color="#10251F" />
              </View>
              <Text style={styles.quickText}>{action.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Limity kategorii</Text>
            <Text style={styles.sectionAction}>Edytuj</Text>
          </View>
          <View style={styles.limitList}>
            {limits.map((limit) => (
              <View key={limit.name} style={styles.limitRow}>
                <View style={[styles.limitDot, { backgroundColor: limit.color }]} />
                <Text style={styles.limitName}>{limit.name}</Text>
                <Text style={styles.limitValue}>{limit.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ostatnie transakcje</Text>
            <Text style={styles.sectionAction}>Wszystkie</Text>
          </View>
          <View style={styles.listCard}>
            {transactions.map((transaction) => (
              <View key={transaction.title} style={styles.transactionRow}>
                <View style={styles.transactionIcon}>
                  <Ionicons name={transaction.icon} size={21} color="#40534B" />
                </View>
                <View style={styles.transactionCopy}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.amount.startsWith('+') ? styles.positiveAmount : null,
                  ]}>
                  {transaction.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.smallCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cele</Text>
              <Ionicons name="add-circle-outline" size={22} color="#157348" />
            </View>
            {goals.map((goal) => (
              <View key={goal.name} style={styles.goalItem}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalMeta}>
                  {goal.saved} · {goal.progress}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.smallCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rodzina</Text>
              <Ionicons name="people-outline" size={22} color="#157348" />
            </View>
            <Text style={styles.familyCount}>4 członków</Text>
            <Text style={styles.familyMeta}>Anna, Marek, Ola i Ty</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
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
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 38,
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
  budgetStrip: {
    flexDirection: 'row',
    gap: 10,
  },
  budgetPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    padding: 12,
  },
  budgetPillActive: {
    backgroundColor: '#10251F',
    borderColor: '#10251F',
  },
  budgetName: {
    color: '#66736E',
    fontSize: 12,
    fontWeight: '700',
  },
  budgetNameActive: {
    color: '#C9D8D1',
  },
  budgetAmount: {
    color: '#243A33',
    fontSize: 15,
    fontWeight: '800',
  },
  budgetAmountActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
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
  balance: {
    color: '#10251F',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 42,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: '#E6F6EE',
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    width: 46,
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
    width: '58%',
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    backgroundColor: '#F7FAF8',
    borderRadius: 8,
    flex: 1,
    gap: 4,
    padding: 10,
  },
  statLabel: {
    color: '#66736E',
    fontSize: 12,
  },
  statValue: {
    color: '#243A33',
    fontSize: 14,
    fontWeight: '800',
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
    gap: 8,
    minHeight: 86,
    padding: 10,
  },
  quickIcon: {
    alignItems: 'center',
    backgroundColor: '#F0F5F2',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  quickText: {
    color: '#243A33',
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '800',
  },
  limitList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  limitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 36,
  },
  limitDot: {
    borderRadius: 999,
    height: 10,
    marginRight: 10,
    width: 10,
  },
  limitName: {
    color: '#40534B',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
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
    backgroundColor: '#F0F5F2',
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
    minHeight: 146,
    padding: 14,
  },
  goalItem: {
    gap: 3,
  },
  goalName: {
    color: '#243A33',
    fontSize: 14,
    fontWeight: '800',
  },
  goalMeta: {
    color: '#66736E',
    fontSize: 13,
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
