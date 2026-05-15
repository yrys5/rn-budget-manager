import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';

import { initialBudgets } from '@/components/budgets/data';
import type { Currency } from '@/components/budgets/types';
import { currentUserId, formatTransactionAmount, initialTransactions } from '@/components/transactions/data';
import { transactionStyles as styles } from '@/components/transactions/styles';
import { TransactionFormScreen } from '@/components/transactions/TransactionFormScreen';
import { TransactionList } from '@/components/transactions/TransactionList';
import type { Transaction, TransactionScreenMode } from '@/components/transactions/types';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [transactionScreenMode, setTransactionScreenMode] = useState<TransactionScreenMode>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState('2026-05-15');
  const [selectedBudgetId, setSelectedBudgetId] = useState(initialBudgets[0].id);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialBudgets[0].categories[0].id);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('PLN');
  const [error, setError] = useState('');

  const editingTransaction = useMemo(
    () => transactions.find((transaction) => transaction.id === editingTransactionId),
    [editingTransactionId, transactions],
  );

  const monthTotal = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const resetTransactionForm = () => {
    setAmount('');
    setDescription('');
    setTransactionDate('2026-05-15');
    setSelectedBudgetId(initialBudgets[0].id);
    setSelectedCategoryId(initialBudgets[0].categories[0].id);
    setSelectedCurrency('PLN');
    setEditingTransactionId(null);
    setTransactionToDeleteId(null);
    setError('');
    setTransactionScreenMode(null);
  };

  const openCreateTransactionScreen = () => {
    setAmount('');
    setDescription('');
    setTransactionDate('2026-05-15');
    setSelectedBudgetId(initialBudgets[0].id);
    setSelectedCategoryId(initialBudgets[0].categories[0].id);
    setSelectedCurrency('PLN');
    setEditingTransactionId(null);
    setTransactionToDeleteId(null);
    setError('');
    setTransactionScreenMode('create');
  };

  const openEditTransactionScreen = (transaction: Transaction) => {
    setAmount(`${transaction.amount}`);
    setDescription(transaction.description);
    setTransactionDate(transaction.transactionDate);
    setSelectedBudgetId(transaction.budgetId);
    setSelectedCategoryId(transaction.categoryId);
    setSelectedCurrency(transaction.currency);
    setEditingTransactionId(transaction.id);
    setTransactionToDeleteId(null);
    setError('');
    setTransactionScreenMode('edit');
  };

  const handleSelectBudget = (budgetId: string) => {
    const nextBudget = initialBudgets.find((budget) => budget.id === budgetId);

    setSelectedBudgetId(budgetId);
    setSelectedCategoryId(nextBudget?.categories[0]?.id ?? '');
  };

  const handleSaveTransaction = () => {
    const normalizedAmount = Number(amount.replace(',', '.'));

    if (!Number.isFinite(normalizedAmount) || normalizedAmount === 0) {
      setError('Kwota transakcji musi być różna od zera.');
      return;
    }

    if (description.trim().length < 3) {
      setError('Opis transakcji musi mieć minimum 3 znaki.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(transactionDate)) {
      setError('Data transakcji musi mieć format YYYY-MM-DD.');
      return;
    }

    if (!selectedBudgetId || !selectedCategoryId) {
      setError('Wybierz budżet oraz kategorię.');
      return;
    }

    const nextTransaction: Transaction = {
      id: editingTransactionId ?? `${Date.now()}`,
      amount: normalizedAmount,
      description: description.trim(),
      transactionDate,
      createdAt: editingTransaction?.createdAt ?? new Date().toISOString(),
      budgetId: selectedBudgetId,
      userId: editingTransaction?.userId ?? currentUserId,
      categoryId: selectedCategoryId,
      currency: selectedCurrency,
    };

    setTransactions((currentTransactions) => {
      if (editingTransactionId) {
        return currentTransactions.map((transaction) =>
          transaction.id === editingTransactionId ? nextTransaction : transaction,
        );
      }

      return [nextTransaction, ...currentTransactions];
    });
    resetTransactionForm();
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    );
    resetTransactionForm();
  };

  const handleConfirmDeleteTransaction = () => {
    if (transactionToDeleteId) {
      handleDeleteTransaction(transactionToDeleteId);
    }
  };

  if (transactionScreenMode) {
    return (
      <TransactionFormScreen
        amount={amount}
        budgets={initialBudgets}
        description={description}
        error={error}
        hasEditingTransaction={Boolean(editingTransaction)}
        onBack={resetTransactionForm}
        onCancelDelete={() => setTransactionToDeleteId(null)}
        onChangeAmount={setAmount}
        onChangeDescription={setDescription}
        onChangeTransactionDate={setTransactionDate}
        onConfirmDelete={handleConfirmDeleteTransaction}
        onRequestDelete={() => {
          if (editingTransaction) {
            setTransactionToDeleteId(editingTransaction.id);
          }
        }}
        onSaveTransaction={handleSaveTransaction}
        onSelectBudget={handleSelectBudget}
        onSelectCategory={setSelectedCategoryId}
        onSelectCurrency={setSelectedCurrency}
        selectedBudgetId={selectedBudgetId}
        selectedCategoryId={selectedCategoryId}
        selectedCurrency={selectedCurrency}
        transactionDate={transactionDate}
        transactionScreenMode={transactionScreenMode}
        transactionToDeleteId={transactionToDeleteId}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Transakcje</Text>
            <Text style={styles.title}>Historia wydatków</Text>
          </View>
          <Pressable onPress={openCreateTransactionScreen} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Suma widocznych transakcji</Text>
          <Text style={styles.summaryValue}>{formatTransactionAmount(monthTotal, 'PLN')}</Text>
        </View>

        <TransactionList
          budgets={initialBudgets}
          onCreateTransaction={openCreateTransactionScreen}
          onEditTransaction={openEditTransactionScreen}
          transactions={transactions}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
