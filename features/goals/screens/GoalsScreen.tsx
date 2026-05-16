import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';

import { budgetsApi } from '@/features/budgets/api/budgetsApi';
import { goalsApi } from '../api/goalsApi';
import { GoalFormScreen } from '../components/GoalFormScreen';
import { GoalList } from '../components/GoalList';
import { goalStyles as styles } from '../components/styles';
import { useGoals } from '../hooks/useGoals';
import { validateGoal } from '../model/validation';
import type { Budget, Currency, GoalScreenMode, SavingsGoal } from '@/shared/model/finance';
import { ErrorState, LoadingState } from '@/shared/ui';

export default function GoalsScreen() {
  const { reload, setIsSaving, state } = useGoals();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [goalScreenMode, setGoalScreenMode] = useState<GoalScreenMode>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalToDeleteId, setGoalToDeleteId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [startDate, setStartDate] = useState('2026-05-15');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [selectedBudgetId, setSelectedBudgetId] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('PLN');
  const [error, setError] = useState('');

  useEffect(() => {
    if (state.data) {
      setGoals(state.data);
    }
  }, [state.data]);

  useEffect(() => {
    let isMounted = true;

    const loadBudgets = async () => {
      const nextBudgets = await budgetsApi.list();

      if (isMounted) {
        setBudgets(nextBudgets);
        setSelectedBudgetId((currentId) => currentId || nextBudgets[0]?.id || '');
      }
    };

    void loadBudgets();

    return () => {
      isMounted = false;
    };
  }, []);

  const editingGoal = useMemo(
    () => goals.find((goal) => goal.id === editingGoalId),
    [editingGoalId, goals],
  );

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalProgress =
    totalTargetAmount > 0 ? Math.min(Math.round((totalCurrentAmount / totalTargetAmount) * 100), 100) : 0;

  const resetGoalForm = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setStartDate('2026-05-15');
    setTargetDate('2026-12-31');
    setSelectedBudgetId(budgets[0]?.id ?? '');
    setSelectedCurrency('PLN');
    setEditingGoalId(null);
    setGoalToDeleteId(null);
    setError('');
    setGoalScreenMode(null);
  };

  const openCreateGoalScreen = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setStartDate('2026-05-15');
    setTargetDate('2026-12-31');
    setSelectedBudgetId(budgets[0]?.id ?? '');
    setSelectedCurrency('PLN');
    setEditingGoalId(null);
    setGoalToDeleteId(null);
    setError('');
    setGoalScreenMode('create');
  };

  const openEditGoalScreen = (goal: SavingsGoal) => {
    setName(goal.name);
    setTargetAmount(`${goal.targetAmount}`);
    setCurrentAmount(`${goal.currentAmount}`);
    setStartDate(goal.startDate);
    setTargetDate(goal.targetDate);
    setSelectedBudgetId(goal.budgetId);
    setSelectedCurrency(goal.currency);
    setEditingGoalId(goal.id);
    setGoalToDeleteId(null);
    setError('');
    setGoalScreenMode('edit');
  };

  const handleSaveGoal = async () => {
    const normalizedTargetAmount = Number(targetAmount.replace(',', '.'));
    const normalizedCurrentAmount = Number(currentAmount.replace(',', '.'));
    const validationError = validateGoal({
      budgetId: selectedBudgetId,
      currentAmount,
      name,
      startDate,
      targetAmount,
      targetDate,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    const nextGoal: SavingsGoal = {
      id: editingGoalId ?? '',
      name: name.trim(),
      targetAmount: normalizedTargetAmount,
      currentAmount: normalizedCurrentAmount,
      startDate,
      targetDate,
      budgetId: selectedBudgetId,
      currency: selectedCurrency,
    };

    setIsSaving(true);
    try {
      const savedGoal = await goalsApi.save(nextGoal);
      setGoals((currentGoals) => {
        if (editingGoalId) {
          return currentGoals.map((goal) => (goal.id === editingGoalId ? savedGoal : goal));
        }

        return [savedGoal, ...currentGoals];
      });
      resetGoalForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const goal = goals.find((item) => item.id === goalId);

    setIsSaving(true);
    try {
      await goalsApi.delete(goalId, goal?.budgetId);
      setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId));
      resetGoalForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteGoal = () => {
    if (goalToDeleteId) {
      void handleDeleteGoal(goalToDeleteId);
    }
  };

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <LoadingState title="Ładowanie celów" />
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
            title="Nie udało się pobrać celów"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (goalScreenMode) {
    return (
      <GoalFormScreen
        budgets={budgets}
        currentAmount={currentAmount}
        error={error}
        goalScreenMode={goalScreenMode}
        goalToDeleteId={goalToDeleteId}
        hasEditingGoal={Boolean(editingGoal)}
        name={name}
        onBack={resetGoalForm}
        onCancelDelete={() => setGoalToDeleteId(null)}
        onChangeCurrentAmount={setCurrentAmount}
        onChangeName={setName}
        onChangeStartDate={setStartDate}
        onChangeTargetAmount={setTargetAmount}
        onChangeTargetDate={setTargetDate}
        onConfirmDelete={handleConfirmDeleteGoal}
        onRequestDelete={() => {
          if (editingGoal) {
            setGoalToDeleteId(editingGoal.id);
          }
        }}
        onSaveGoal={handleSaveGoal}
        onSelectBudget={setSelectedBudgetId}
        onSelectCurrency={setSelectedCurrency}
        selectedBudgetId={selectedBudgetId}
        selectedCurrency={selectedCurrency}
        startDate={startDate}
        targetAmount={targetAmount}
        targetDate={targetDate}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Cele</Text>
            <Text style={styles.title}>Oszczędności</Text>
          </View>
          <Pressable
            accessibilityLabel="Dodaj cel"
            onPress={openCreateGoalScreen}
            style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Łączny postęp celów</Text>
          <Text style={styles.summaryValue}>{totalProgress}%</Text>
          <Text style={styles.summaryMeta}>
            {totalCurrentAmount.toLocaleString('pl-PL')} PLN z{' '}
            {totalTargetAmount.toLocaleString('pl-PL')} PLN
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${totalProgress}%` }]} />
          </View>
        </View>

        <GoalList
          budgets={budgets}
          goals={goals}
          onCreateGoal={openCreateGoalScreen}
          onEditGoal={openEditGoalScreen}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
