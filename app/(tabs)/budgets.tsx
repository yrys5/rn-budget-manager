import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';

import { BudgetCreateModal } from '@/components/budgets/BudgetCreateModal';
import { BudgetList } from '@/components/budgets/BudgetList';
import { BudgetSummary } from '@/components/budgets/BudgetSummary';
import { CategoryFormScreen } from '@/components/budgets/CategoryFormScreen';
import { CategoryList } from '@/components/budgets/CategoryList';
import { categoryTypes, initialBudgets } from '@/components/budgets/data';
import { budgetStyles as styles } from '@/components/budgets/styles';
import type {
  Budget,
  Category,
  CategoryScreenMode,
  CategoryTypeOption,
} from '@/components/budgets/types';

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [activeBudgetId, setActiveBudgetId] = useState(initialBudgets[0].id);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryScreenMode, setCategoryScreenMode] = useState<CategoryScreenMode>(null);
  const [budgetName, setBudgetName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategoryType, setSelectedCategoryType] = useState<CategoryTypeOption>(
    categoryTypes[0],
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null);
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const activeBudget = useMemo(
    () => budgets.find((budget) => budget.id === activeBudgetId) ?? budgets[0],
    [activeBudgetId, budgets],
  );

  const editingCategory = useMemo(
    () => activeBudget?.categories.find((category) => category.id === editingCategoryId),
    [activeBudget, editingCategoryId],
  );

  const spentPercent =
    activeBudget && activeBudget.limit > 0
      ? Math.min(Math.round((activeBudget.spent / activeBudget.limit) * 100), 100)
      : 0;

  const closeCreateBudgetModal = () => {
    setIsCreateOpen(false);
    setBudgetName('');
    setNameError('');
  };

  const handleCreateBudget = () => {
    const nextName = budgetName.trim();

    if (nextName.length < 3) {
      setNameError('Nazwa budżetu musi mieć minimum 3 znaki.');
      return;
    }

    const nextBudget: Budget = {
      id: `${Date.now()}`,
      name: nextName,
      balance: 0,
      spent: 0,
      limit: 0,
      categories: [],
    };

    setBudgets((currentBudgets) => [nextBudget, ...currentBudgets]);
    setActiveBudgetId(nextBudget.id);
    setBudgetName('');
    setNameError('');
    setIsCreateOpen(false);
  };

  const handleDeleteBudget = () => {
    if (!activeBudget || budgets.length === 1) {
      return;
    }

    const nextBudgets = budgets.filter((budget) => budget.id !== activeBudget.id);

    setBudgets(nextBudgets);
    setActiveBudgetId(nextBudgets[0].id);
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

  const handleSaveCategory = () => {
    const nextName = categoryName.trim();

    if (!activeBudget) {
      return;
    }

    if (nextName.length < 3) {
      setCategoryError('Nazwa kategorii musi mieć minimum 3 znaki.');
      return;
    }

    const nextCategory: Category = {
      id: editingCategoryId ?? `${Date.now()}`,
      name: nextName,
      type: selectedCategoryType.label,
      amount: 0,
      icon: selectedCategoryType.icon,
      color: selectedCategoryType.color,
    };

    setBudgets((currentBudgets) =>
      currentBudgets.map((budget) => {
        if (budget.id !== activeBudget.id) {
          return budget;
        }

        if (editingCategoryId) {
          return {
            ...budget,
            categories: budget.categories.map((category) =>
              category.id === editingCategoryId
                ? { ...category, ...nextCategory, amount: category.amount }
                : category,
            ),
          };
        }

        return { ...budget, categories: [nextCategory, ...budget.categories] };
      }),
    );
    resetCategoryForm();
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!activeBudget) {
      return;
    }

    setBudgets((currentBudgets) =>
      currentBudgets.map((budget) =>
        budget.id === activeBudget.id
          ? {
              ...budget,
              categories: budget.categories.filter((category) => category.id !== categoryId),
            }
          : budget,
      ),
    );
    resetCategoryForm();
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDeleteId) {
      handleDeleteCategory(categoryToDeleteId);
    }
  };

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
