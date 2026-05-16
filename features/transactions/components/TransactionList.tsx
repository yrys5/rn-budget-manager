import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { Budget } from '@/shared/model/finance';

import { transactionStyles as styles } from './styles';
import type { Transaction } from '@/shared/model/finance';

const toDateOnly = (date: string) => date.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? date;

const getMonthHeader = (date: string) =>
  new Intl.DateTimeFormat('pl-PL', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${toDateOnly(date)}T00:00:00`));

const getMonthKey = (date: string) => toDateOnly(date).slice(0, 7);

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
  const groupedTransactions = transactions
    .slice()
    .sort((firstTransaction, secondTransaction) =>
      secondTransaction.transactionDate.localeCompare(firstTransaction.transactionDate),
    )
    .reduce<{ key: string; title: string; transactions: Transaction[] }[]>((groups, transaction) => {
      const key = getMonthKey(transaction.transactionDate);
      const existingGroup = groups.find((group) => group.key === key);

      if (existingGroup) {
        existingGroup.transactions.push(transaction);
        return groups;
      }

      groups.push({
        key,
        title: getMonthHeader(transaction.transactionDate),
        transactions: [transaction],
      });

      return groups;
    }, []);

  return (
    <View style={styles.transactionSections}>
      {transactions.length ? (
        groupedTransactions.map((group) => (
          <View key={group.key} style={styles.transactionSection}>
            <Text style={styles.monthHeader}>{group.title}</Text>
            <View style={styles.listCard}>
              {group.transactions.map((transaction) => {
                const budget = budgets.find((item) => item.id === transaction.budgetId);
                const category = budget?.categories.find((item) => item.id === transaction.categoryId);
                const isIncome = category?.type === 'Przychód';

                return (
                  <Pressable
                    key={transaction.id}
                    onPress={() => onEditTransaction(transaction)}
                    style={styles.transactionRow}>
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
                        {toDateOnly(transaction.transactionDate)}
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
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))
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
