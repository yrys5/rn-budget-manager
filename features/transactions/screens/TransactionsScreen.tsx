import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';

import { budgetsApi } from '@/features/budgets/api/budgetsApi';
import { transactionsApi } from '../api/transactionsApi';
import { TransactionFormScreen } from '../components/TransactionFormScreen';
import { TransactionList } from '../components/TransactionList';
import { transactionStyles as styles } from '../components/styles';
import { useTransactions } from '../hooks/useTransactions';
import { validateTransaction } from '../model/validation';
import type { Budget, Currency, Transaction, TransactionScreenMode } from '@/shared/model/finance';
import { ErrorState, LoadingState } from '@/shared/ui';

export default function TransactionsScreen() {
  const { reload, setIsSaving, state } = useTransactions();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionScreenMode, setTransactionScreenMode] = useState<TransactionScreenMode>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState('2026-05-15');
  const [selectedBudgetId, setSelectedBudgetId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('PLN');
  const [error, setError] = useState('');

  useEffect(() => {
    if (state.data) {
      setTransactions(state.data);
    }
  }, [state.data]);

  useEffect(() => {
    let isMounted = true;

    const loadBudgets = async () => {
      const nextBudgets = await budgetsApi.list();

      if (isMounted) {
        setBudgets(nextBudgets);
        setSelectedBudgetId((currentId) => currentId || nextBudgets[0]?.id || '');
        setSelectedCategoryId((currentId) => currentId || nextBudgets[0]?.categories[0]?.id || '');
      }
    };

    void loadBudgets();

    return () => {
      isMounted = false;
    };
  }, []);

  const editingTransaction = useMemo(
    () => transactions.find((transaction) => transaction.id === editingTransactionId),
    [editingTransactionId, transactions],
  );

  const monthTotal = transactions.reduce((sum, transaction) => {
    const budget = budgets.find((item) => item.id === transaction.budgetId);
    const category = budget?.categories.find((item) => item.id === transaction.categoryId);
    const signedAmount = category?.type === 'Przychód' ? transaction.amount : -transaction.amount;

    return sum + signedAmount;
  }, 0);

  const resetTransactionForm = () => {
    setAmount('');
    setDescription('');
    setTransactionDate('2026-05-15');
    setSelectedBudgetId(budgets[0]?.id ?? '');
    setSelectedCategoryId(budgets[0]?.categories[0]?.id ?? '');
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
    setSelectedBudgetId(budgets[0]?.id ?? '');
    setSelectedCategoryId(budgets[0]?.categories[0]?.id ?? '');
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
    const nextBudget = budgets.find((budget) => budget.id === budgetId);

    setSelectedBudgetId(budgetId);
    setSelectedCategoryId(nextBudget?.categories[0]?.id ?? '');
  };

  const handleSaveTransaction = async () => {
    const normalizedAmount = Number(amount.replace(',', '.'));
    const validationError = validateTransaction({
      amount,
      budgetId: selectedBudgetId,
      categoryId: selectedCategoryId,
      description,
      transactionDate,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    const nextTransaction: Transaction = {
      id: editingTransactionId ?? '',
      amount: normalizedAmount,
      description: description.trim(),
      transactionDate,
      createdAt: editingTransaction?.createdAt ?? new Date().toISOString(),
      budgetId: selectedBudgetId,
      userId: editingTransaction?.userId ?? 'current-user',
      categoryId: selectedCategoryId,
      currency: selectedCurrency,
    };

    setIsSaving(true);
    try {
      const savedTransaction = await transactionsApi.save(nextTransaction);
      setTransactions((currentTransactions) => {
        if (editingTransactionId) {
          return currentTransactions.map((transaction) =>
            transaction.id === editingTransactionId ? savedTransaction : transaction,
          );
        }

        return [savedTransaction, ...currentTransactions];
      });
      resetTransactionForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const transaction = transactions.find((item) => item.id === transactionId);

    setIsSaving(true);
    try {
      await transactionsApi.delete(transactionId, transaction?.budgetId);
      setTransactions((currentTransactions) =>
        currentTransactions.filter((transaction) => transaction.id !== transactionId),
      );
      resetTransactionForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteTransaction = () => {
    if (transactionToDeleteId) {
      void handleDeleteTransaction(transactionToDeleteId);
    }
  };

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <LoadingState title="Ładowanie transakcji" />
        </View>
      </SafeAreaView>
    );
  }

  if (state.status === 'error') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ErrorState
            message={state.error.message}
            onRetry={reload}
            title="Nie udało się pobrać transakcji"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (transactionScreenMode) {
    return (
      <TransactionFormScreen
        amount={amount}
        budgets={budgets}
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
          <Pressable
            accessibilityLabel="Dodaj transakcję"
            onPress={openCreateTransactionScreen}
            style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Suma widocznych transakcji</Text>
          <Text style={styles.summaryValue}>
            {monthTotal > 0 ? '+' : ''}
            {monthTotal.toLocaleString('pl-PL')} PLN
          </Text>
        </View>

        <TransactionList
          budgets={budgets}
          onCreateTransaction={openCreateTransactionScreen}
          onEditTransaction={openEditTransactionScreen}
          transactions={transactions}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
