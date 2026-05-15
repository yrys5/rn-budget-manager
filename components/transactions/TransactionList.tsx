import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { Budget } from '@/components/budgets/types';

import { transactionStyles as styles } from './styles';
import type { Transaction } from './types';

type TransactionListProps = {
  budgets: Budget[];
  onCreateTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  transactions: Transaction[];
};

export function TransactionList({
  budgets,
  onCreateTransaction,
  onEditTransaction,
  transactions,
}: TransactionListProps) {
  return (
    <View style={styles.listCard}>
      {transactions.length ? (
        transactions.map((transaction) => {
          const budget = budgets.find((item) => item.id === transaction.budgetId);
          const category = budget?.categories.find((item) => item.id === transaction.categoryId);
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
                <Text style={styles.transactionMeta}>
                  {budget?.name ?? 'Budżet'} · {category?.name ?? 'Kategoria'} ·{' '}
                  {transaction.transactionDate}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  isIncome ? styles.positiveAmount : null,
                ]}>
                {isIncome ? '+' : '-'}
                {transaction.amount.toLocaleString('pl-PL')} {transaction.currency}
              </Text>
              <Pressable
                hitSlop={10}
                onPress={() => onEditTransaction(transaction)}
                style={styles.editButton}>
                <Ionicons name="create-outline" size={18} color="#40534B" />
              </Pressable>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="swap-horizontal-outline" size={28} color="#66736E" />
          <Text style={styles.emptyTitle}>Brak transakcji</Text>
          <Text style={styles.emptyText}>
            Dodaj pierwszą transakcję przypisaną do budżetu i kategorii.
          </Text>
          <Pressable onPress={onCreateTransaction} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Dodaj transakcję</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
