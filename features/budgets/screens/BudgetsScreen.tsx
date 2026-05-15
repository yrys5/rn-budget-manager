import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';

import { budgetsApi } from '../api/budgetsApi';
import { BudgetCreateModal } from '../components/BudgetCreateModal';
import { BudgetList } from '../components/BudgetList';
import { BudgetSummary } from '../components/BudgetSummary';
import { CategoryFormScreen } from '../components/CategoryFormScreen';
import { CategoryList } from '../components/CategoryList';
import { LimitFormScreen } from '../components/LimitFormScreen';
import { LimitList } from '../components/LimitList';
import { budgetStyles as styles } from '../components/styles';
import { useBudgets } from '../hooks/useBudgets';
import { validateBudgetLimit, validateBudgetName, validateCategoryName } from '../model/validation';
import { ErrorState, LoadingState } from '@/shared/ui';
import { categoryTypes } from '@/shared/model/finance';
import type {
  Budget,
  BudgetLimit,
  Category,
  CategoryScreenMode,
  CategoryTypeOption,
  Currency,
  LimitScreenMode,
} from '@/shared/model/finance';

export default function BudgetsScreen() {
  const { reload, setIsSaving, state } = useBudgets();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activeBudgetId, setActiveBudgetId] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryScreenMode, setCategoryScreenMode] = useState<CategoryScreenMode>(null);
  const [limitScreenMode, setLimitScreenMode] = useState<LimitScreenMode>(null);
  const [budgetName, setBudgetName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategoryType, setSelectedCategoryType] = useState<CategoryTypeOption>(
    categoryTypes[0],
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null);
  const [limitAmount, setLimitAmount] = useState('');
  const [limitPeriodYear, setLimitPeriodYear] = useState('2026');
  const [limitPeriodMonth, setLimitPeriodMonth] = useState(5);
  const [limitCurrency, setLimitCurrency] = useState<Currency>('PLN');
  const [selectedLimitCategoryId, setSelectedLimitCategoryId] = useState<string | null>(null);
  const [editingLimitId, setEditingLimitId] = useState<string | null>(null);
  const [limitToDeleteId, setLimitToDeleteId] = useState<string | null>(null);
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [limitError, setLimitError] = useState('');

  useEffect(() => {
    if (state.data) {
      setBudgets(state.data);
      setActiveBudgetId((currentId) => currentId || state.data?.[0]?.id || '');
    }
  }, [state.data]);

  const activeBudget = useMemo(
    () => budgets.find((budget) => budget.id === activeBudgetId) ?? budgets[0],
    [activeBudgetId, budgets],
  );

  const editingCategory = useMemo(
    () => activeBudget?.categories.find((category) => category.id === editingCategoryId),
    [activeBudget, editingCategoryId],
  );

  const editingLimit = useMemo(
    () => activeBudget?.limits.find((limit) => limit.id === editingLimitId),
    [activeBudget, editingLimitId],
  );

  const spentPercent =
    activeBudget && activeBudget.limit > 0
      ? Math.min(Math.round((activeBudget.spent / activeBudget.limit) * 100), 100)
      : 0;

  useEffect(() => {
    if (!activeBudgetId && budgets[0]) {
      setActiveBudgetId(budgets[0].id);
    }
  }, [activeBudgetId, budgets]);

  const closeCreateBudgetModal = () => {
    setIsCreateOpen(false);
    setBudgetName('');
    setNameError('');
  };

  const handleCreateBudget = async () => {
    const nextName = budgetName.trim();
    const validationError = validateBudgetName(nextName);

    if (validationError) {
      setNameError(validationError);
      return;
    }

    const nextBudget: Budget = {
      id: `${Date.now()}`,
      name: nextName,
      balance: 0,
      spent: 0,
      limit: 0,
      categories: [],
      limits: [],
    };

    setIsSaving(true);
    try {
      await budgetsApi.saveBudget(nextBudget);
      setBudgets((currentBudgets) => [nextBudget, ...currentBudgets]);
      setActiveBudgetId(nextBudget.id);
      setBudgetName('');
      setNameError('');
      setIsCreateOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!activeBudget || budgets.length === 1) {
      return;
    }

    const nextBudgets = budgets.filter((budget) => budget.id !== activeBudget.id);

    setIsSaving(true);
    try {
      await budgetsApi.deleteBudget(activeBudget.id);
      setBudgets(nextBudgets);
      setActiveBudgetId(nextBudgets[0].id);
    } finally {
      setIsSaving(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryError('');
    setSelectedCategoryType(categoryTypes[0]);
    setEditingCategoryId(null);
    setCategoryToDeleteId(null);
    setCategoryScreenMode(null);
  };

  const openCreateCategoryScreen = () => {
    setCategoryName('');
    setCategoryError('');
    setSelectedCategoryType(categoryTypes[0]);
    setEditingCategoryId(null);
    setCategoryToDeleteId(null);
    setCategoryScreenMode('create');
  };

  const openEditCategoryScreen = (category: Category) => {
    const nextType =
      categoryTypes.find((categoryType) => categoryType.label === category.type) ?? categoryTypes[0];

    setCategoryName(category.name);
    setCategoryError('');
    setSelectedCategoryType(nextType);
    setEditingCategoryId(category.id);
    setCategoryToDeleteId(null);
    setCategoryScreenMode('edit');
  };

  const handleSaveCategory = async () => {
    const nextName = categoryName.trim();

    if (!activeBudget) {
      return;
    }

    const validationError = validateCategoryName(nextName);

    if (validationError) {
      setCategoryError(validationError);
      return;
    }

    const nextCategory: Category = {
      id: editingCategoryId ?? `${Date.now()}`,
      name: nextName,
      type: selectedCategoryType.label,
      icon: selectedCategoryType.icon,
      color: selectedCategoryType.color,
    };

    setIsSaving(true);
    try {
      await budgetsApi.saveCategory(activeBudget.id, nextCategory);
      setBudgets((currentBudgets) =>
        currentBudgets.map((budget) => {
          if (budget.id !== activeBudget.id) {
            return budget;
          }

          if (editingCategoryId) {
            return {
              ...budget,
              categories: budget.categories.map((category) =>
                category.id === editingCategoryId ? { ...category, ...nextCategory } : category,
              ),
            };
          }

          return { ...budget, categories: [nextCategory, ...budget.categories] };
        }),
      );
      resetCategoryForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!activeBudget) {
      return;
    }

    setIsSaving(true);
    try {
      await budgetsApi.deleteCategory(activeBudget.id, categoryId);
      setBudgets((currentBudgets) =>
        currentBudgets.map((budget) =>
          budget.id === activeBudget.id
            ? {
                ...budget,
                categories: budget.categories.filter((category) => category.id !== categoryId),
                limits: budget.limits.filter((limit) => limit.categoryId !== categoryId),
              }
            : budget,
        ),
      );
      resetCategoryForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDeleteId) {
      void handleDeleteCategory(categoryToDeleteId);
    }
  };

  const resetLimitForm = () => {
    setLimitAmount('');
    setLimitError('');
    setLimitPeriodYear('2026');
    setLimitPeriodMonth(5);
    setLimitCurrency('PLN');
    setSelectedLimitCategoryId(null);
    setEditingLimitId(null);
    setLimitToDeleteId(null);
    setLimitScreenMode(null);
  };

  const openCreateLimitScreen = () => {
    setLimitAmount('');
    setLimitError('');
    setLimitPeriodYear('2026');
    setLimitPeriodMonth(5);
    setLimitCurrency('PLN');
    setSelectedLimitCategoryId(activeBudget?.categories[0]?.id ?? null);
    setEditingLimitId(null);
    setLimitToDeleteId(null);
    setLimitScreenMode('create');
  };

  const openEditLimitScreen = (limit: BudgetLimit) => {
    setLimitAmount(`${limit.limitAmount}`);
    setLimitError('');
    setLimitPeriodYear(`${limit.periodYear}`);
    setLimitPeriodMonth(limit.periodMonth);
    setLimitCurrency(limit.currency);
    setSelectedLimitCategoryId(limit.categoryId);
    setEditingLimitId(limit.id);
    setLimitToDeleteId(null);
    setLimitScreenMode('edit');
  };

  const handleSaveLimit = async () => {
    if (!activeBudget) {
      return;
    }

    const normalizedAmount = Number(limitAmount.replace(',', '.'));
    const normalizedYear = Number(limitPeriodYear);
    const validationError = validateBudgetLimit({
      amount: limitAmount,
      categoryId: selectedLimitCategoryId ?? '',
      year: limitPeriodYear,
    });

    if (validationError) {
      setLimitError(validationError);
      return;
    }

    const nextLimit: BudgetLimit = {
      id: editingLimitId ?? `${Date.now()}`,
      limitAmount: normalizedAmount,
      periodYear: normalizedYear,
      periodMonth: limitPeriodMonth,
      createdAt: editingLimit?.createdAt ?? new Date().toISOString(),
      budgetId: activeBudget.id,
      categoryId: selectedLimitCategoryId ?? '',
      currency: limitCurrency,
    };

    setIsSaving(true);
    try {
      await budgetsApi.saveLimit(activeBudget.id, nextLimit);
      setBudgets((currentBudgets) =>
        currentBudgets.map((budget) => {
          if (budget.id !== activeBudget.id) {
            return budget;
          }

          if (editingLimitId) {
            return {
              ...budget,
              limits: budget.limits.map((limit) =>
                limit.id === editingLimitId ? nextLimit : limit,
              ),
            };
          }

          return { ...budget, limits: [nextLimit, ...budget.limits] };
        }),
      );
      resetLimitForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLimit = async (limitId: string) => {
    if (!activeBudget) {
      return;
    }

    setIsSaving(true);
    try {
      await budgetsApi.deleteLimit(activeBudget.id, limitId);
      setBudgets((currentBudgets) =>
        currentBudgets.map((budget) =>
          budget.id === activeBudget.id
            ? { ...budget, limits: budget.limits.filter((limit) => limit.id !== limitId) }
            : budget,
        ),
      );
      resetLimitForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteLimit = () => {
    if (limitToDeleteId) {
      void handleDeleteLimit(limitToDeleteId);
    }
  };

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <LoadingState title="Ładowanie budżetów" />
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
            title="Nie udało się pobrać budżetów"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (categoryScreenMode) {
    return (
      <CategoryFormScreen
        budgetName={activeBudget?.name}
        categoryName={categoryName}
        categoryScreenMode={categoryScreenMode}
        categoryToDeleteId={categoryToDeleteId}
        categoryTypes={categoryTypes}
        error={categoryError}
        hasEditingCategory={Boolean(editingCategory)}
        onBack={resetCategoryForm}
        onCancelDelete={() => setCategoryToDeleteId(null)}
        onChangeCategoryName={setCategoryName}
        onConfirmDelete={handleConfirmDeleteCategory}
        onRequestDelete={() => {
          if (editingCategory) {
            setCategoryToDeleteId(editingCategory.id);
          }
        }}
        onSaveCategory={handleSaveCategory}
        onSelectCategoryType={setSelectedCategoryType}
        selectedCategoryType={selectedCategoryType}
      />
    );
  }

  if (limitScreenMode && activeBudget) {
    return (
      <LimitFormScreen
        amount={limitAmount}
        budget={activeBudget}
        error={limitError}
        hasEditingLimit={Boolean(editingLimit)}
        limitScreenMode={limitScreenMode}
        limitToDeleteId={limitToDeleteId}
        onBack={resetLimitForm}
        onCancelDelete={() => setLimitToDeleteId(null)}
        onChangeAmount={setLimitAmount}
        onChangeYear={setLimitPeriodYear}
        onConfirmDelete={handleConfirmDeleteLimit}
        onRequestDelete={() => {
          if (editingLimit) {
            setLimitToDeleteId(editingLimit.id);
          }
        }}
        onSaveLimit={handleSaveLimit}
        onSelectCategory={setSelectedLimitCategoryId}
        onSelectCurrency={setLimitCurrency}
        onSelectMonth={setLimitPeriodMonth}
        periodMonth={limitPeriodMonth}
        periodYear={limitPeriodYear}
        selectedCategoryId={selectedLimitCategoryId ?? ''}
        selectedCurrency={limitCurrency}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Budżety</Text>
            <Text style={styles.title}>Zarządzaj planami</Text>
          </View>
          <Pressable onPress={() => setIsCreateOpen(true)} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <BudgetList
          activeBudgetId={activeBudget?.id}
          budgets={budgets}
          onSelectBudget={setActiveBudgetId}
        />

        {activeBudget ? (
          <>
            <BudgetSummary
              budget={activeBudget}
              budgetsCount={budgets.length}
              onDeleteBudget={handleDeleteBudget}
              spentPercent={spentPercent}
            />

            <CategoryList
              budget={activeBudget}
              onCreateCategory={openCreateCategoryScreen}
              onEditCategory={openEditCategoryScreen}
            />

            <LimitList
              budget={activeBudget}
              onCreateLimit={openCreateLimitScreen}
              onEditLimit={openEditLimitScreen}
            />
          </>
        ) : null}
      </ScrollView>

      <BudgetCreateModal
        budgetName={budgetName}
        error={nameError}
        onChangeBudgetName={setBudgetName}
        onClose={closeCreateBudgetModal}
        onCreateBudget={handleCreateBudget}
        visible={isCreateOpen}
      />
    </SafeAreaView>
  );
}
