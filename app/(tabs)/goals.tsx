import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';

import { initialBudgets } from '@/components/budgets/data';
import type { Currency } from '@/components/budgets/types';
import { initialGoals } from '@/components/goals/data';
import { GoalFormScreen } from '@/components/goals/GoalFormScreen';
import { GoalList } from '@/components/goals/GoalList';
import { goalStyles as styles } from '@/components/goals/styles';
import type { GoalScreenMode, SavingsGoal } from '@/components/goals/types';

export default function GoalsScreen() {
  const [goals, setGoals] = useState(initialGoals);
  const [goalScreenMode, setGoalScreenMode] = useState<GoalScreenMode>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalToDeleteId, setGoalToDeleteId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [startDate, setStartDate] = useState('2026-05-15');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [selectedBudgetId, setSelectedBudgetId] = useState(initialBudgets[0].id);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('PLN');
  const [error, setError] = useState('');

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
    setSelectedBudgetId(initialBudgets[0].id);
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
    setSelectedBudgetId(initialBudgets[0].id);
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

  const handleSaveGoal = () => {
    const normalizedTargetAmount = Number(targetAmount.replace(',', '.'));
    const normalizedCurrentAmount = Number(currentAmount.replace(',', '.'));

    if (name.trim().length < 3) {
      setError('Nazwa celu musi mieć minimum 3 znaki.');
      return;
    }

    if (!Number.isFinite(normalizedTargetAmount) || normalizedTargetAmount <= 0) {
      setError('Kwota docelowa musi być większa od zera.');
      return;
    }

    if (!Number.isFinite(normalizedCurrentAmount) || normalizedCurrentAmount < 0) {
      setError('Aktualna kwota nie może być ujemna.');
      return;
    }

    if (normalizedCurrentAmount > normalizedTargetAmount) {
      setError('Aktualna kwota nie może być większa niż kwota docelowa.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      setError('Daty celu muszą mieć format YYYY-MM-DD.');
      return;
    }

    if (new Date(`${targetDate}T00:00:00`) < new Date(`${startDate}T00:00:00`)) {
      setError('Data celu nie może być wcześniejsza niż data startu.');
      return;
    }

    if (!selectedBudgetId) {
      setError('Wybierz budżet dla celu.');
      return;
    }

    const nextGoal: SavingsGoal = {
      id: editingGoalId ?? `${Date.now()}`,
      name: name.trim(),
      targetAmount: normalizedTargetAmount,
      currentAmount: normalizedCurrentAmount,
      startDate,
      targetDate,
      budgetId: selectedBudgetId,
      currency: selectedCurrency,
    };

    setGoals((currentGoals) => {
      if (editingGoalId) {
        return currentGoals.map((goal) => (goal.id === editingGoalId ? nextGoal : goal));
      }

      return [nextGoal, ...currentGoals];
    });
    resetGoalForm();
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId));
    resetGoalForm();
  };

  const handleConfirmDeleteGoal = () => {
    if (goalToDeleteId) {
      handleDeleteGoal(goalToDeleteId);
    }
  };

  if (goalScreenMode) {
    return (
      <GoalFormScreen
        budgets={initialBudgets}
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
          <Pressable onPress={openCreateGoalScreen} style={styles.addButton}>
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
          budgets={initialBudgets}
          goals={goals}
          onCreateGoal={openCreateGoalScreen}
          onEditGoal={openEditGoalScreen}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
