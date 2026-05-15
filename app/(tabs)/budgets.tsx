import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Budget = {
  id: string;
  name: string;
  balance: number;
  spent: number;
  limit: number;
  categories: {
    id: string;
    name: string;
    amount: number;
    icon: IconName;
    color: string;
  }[];
};

const initialBudgets: Budget[] = [
  {
    id: 'home',
    name: 'Domowy',
    balance: 4280,
    spent: 3120,
    limit: 7400,
    categories: [
      { id: 'food', name: 'Jedzenie', amount: 1240, icon: 'cart-outline', color: '#1D8E62' },
      { id: 'bills', name: 'Rachunki', amount: 980, icon: 'receipt-outline', color: '#466B8F' },
      { id: 'fun', name: 'Rozrywka', amount: 420, icon: 'game-controller-outline', color: '#D89D26' },
    ],
  },
  {
    id: 'holidays',
    name: 'Wakacje',
    balance: 1850,
    spent: 650,
    limit: 2500,
    categories: [
      { id: 'travel', name: 'Transport', amount: 320, icon: 'airplane-outline', color: '#466B8F' },
      { id: 'hotel', name: 'Noclegi', amount: 330, icon: 'bed-outline', color: '#1D8E62' },
    ],
  },
  {
    id: 'family',
    name: 'Rodzina',
    balance: 6120,
    spent: 2380,
    limit: 8500,
    categories: [
      { id: 'school', name: 'Szkoła', amount: 760, icon: 'school-outline', color: '#D89D26' },
      { id: 'health', name: 'Zdrowie', amount: 540, icon: 'medical-outline', color: '#1D8E62' },
      { id: 'house', name: 'Dom', amount: 1080, icon: 'home-outline', color: '#466B8F' },
    ],
  },
];

const formatCurrency = (value: number) => `${value.toLocaleString('pl-PL')} zł`;

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [activeBudgetId, setActiveBudgetId] = useState(initialBudgets[0].id);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [nameError, setNameError] = useState('');

  const activeBudget = useMemo(
    () => budgets.find((budget) => budget.id === activeBudgetId) ?? budgets[0],
    [activeBudgetId, budgets],
  );

  const spentPercent = activeBudget && activeBudget.limit > 0
    ? Math.min(Math.round((activeBudget.spent / activeBudget.limit) * 100), 100)
    : 0;

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

        <ScrollView
          contentContainerStyle={styles.budgetList}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {budgets.map((budget) => {
            const isActive = budget.id === activeBudget?.id;

            return (
              <Pressable
                key={budget.id}
                onPress={() => setActiveBudgetId(budget.id)}
                style={[styles.budgetCard, isActive ? styles.budgetCardActive : null]}>
                <Text style={[styles.budgetName, isActive ? styles.budgetNameActive : null]}>
                  {budget.name}
                </Text>
                <Text style={[styles.budgetBalance, isActive ? styles.budgetBalanceActive : null]}>
                  {formatCurrency(budget.balance)}
                </Text>
                <Text style={[styles.budgetMeta, isActive ? styles.budgetMetaActive : null]}>
                  {budget.categories.length} kategorii
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {activeBudget ? (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.sectionLabel}>Aktywny budżet</Text>
                  <Text style={styles.activeTitle}>{activeBudget.name}</Text>
                </View>
                <Pressable
                  disabled={budgets.length === 1}
                  onPress={handleDeleteBudget}
                  style={[styles.deleteButton, budgets.length === 1 ? styles.disabledButton : null]}>
                  <Ionicons name="trash-outline" size={20} color="#B73E3E" />
                </Pressable>
              </View>

              <View style={styles.amountRow}>
                <View>
                  <Text style={styles.amountLabel}>Dostępne</Text>
                  <Text style={styles.amountValue}>{formatCurrency(activeBudget.balance)}</Text>
                </View>
                <View style={styles.percentBadge}>
                  <Text style={styles.percentText}>{spentPercent}% limitu</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${spentPercent}%` }]} />
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Wydane</Text>
                  <Text style={styles.statValue}>{formatCurrency(activeBudget.spent)}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Limit</Text>
                  <Text style={styles.statValue}>{formatCurrency(activeBudget.limit)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Zawartość budżetu</Text>
                <Text style={styles.sectionAction}>Kategorie</Text>
              </View>

              <View style={styles.categoryList}>
                {activeBudget.categories.length ? (
                  activeBudget.categories.map((category) => (
                    <View key={category.id} style={styles.categoryRow}>
                      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}1A` }]}>
                        <Ionicons name={category.icon} size={21} color={category.color} />
                      </View>
                      <View style={styles.categoryCopy}>
                        <Text style={styles.categoryName}>{category.name}</Text>
                        <Text style={styles.categoryMeta}>Wydatki w tym budżecie</Text>
                      </View>
                      <Text style={styles.categoryAmount}>{formatCurrency(category.amount)}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="folder-open-outline" size={28} color="#66736E" />
                    <Text style={styles.emptyTitle}>Budżet jest pusty</Text>
                    <Text style={styles.emptyText}>
                      Kategorie, limity i transakcje pojawią się tutaj po integracji kolejnych modułów.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      <Modal animationType="slide" transparent visible={isCreateOpen}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardView}>
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Nowy budżet</Text>
                  <Pressable
                    hitSlop={10}
                    onPress={() => {
                      setIsCreateOpen(false);
                      setBudgetName('');
                      setNameError('');
                    }}>
                    <Ionicons name="close" size={24} color="#40534B" />
                  </Pressable>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Nazwa budżetu</Text>
                  <TextInput
                    autoFocus
                    onChangeText={setBudgetName}
                    placeholder="np. Remont mieszkania"
                    placeholderTextColor="#8D9994"
                    style={[styles.input, nameError ? styles.inputError : null]}
                    value={budgetName}
                  />
                  {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>

                <Pressable onPress={handleCreateBudget} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Utwórz budżet</Text>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  addButton: {
    alignItems: 'center',
    backgroundColor: '#10251F',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  budgetList: {
    gap: 12,
    paddingRight: 20,
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    minWidth: 154,
    padding: 14,
  },
  budgetCardActive: {
    backgroundColor: '#10251F',
    borderColor: '#10251F',
  },
  budgetName: {
    color: '#40534B',
    fontSize: 14,
    fontWeight: '800',
  },
  budgetNameActive: {
    color: '#FFFFFF',
  },
  budgetBalance: {
    color: '#10251F',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  budgetBalanceActive: {
    color: '#FFFFFF',
  },
  budgetMeta: {
    color: '#66736E',
    fontSize: 13,
  },
  budgetMetaActive: {
    color: '#C9D8D1',
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
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    color: '#66736E',
    fontSize: 13,
    fontWeight: '700',
  },
  activeTitle: {
    color: '#10251F',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#FCEEEE',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  disabledButton: {
    opacity: 0.35,
  },
  amountRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountLabel: {
    color: '#66736E',
    fontSize: 13,
  },
  amountValue: {
    color: '#10251F',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 40,
  },
  percentBadge: {
    backgroundColor: '#E6F6EE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  percentText: {
    color: '#157348',
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
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    backgroundColor: '#F7FAF8',
    borderRadius: 8,
    flex: 1,
    gap: 4,
    padding: 12,
  },
  statLabel: {
    color: '#66736E',
    fontSize: 12,
  },
  statValue: {
    color: '#243A33',
    fontSize: 15,
    fontWeight: '800',
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
  categoryList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 72,
  },
  categoryIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  categoryCopy: {
    flex: 1,
  },
  categoryName: {
    color: '#243A33',
    fontSize: 15,
    fontWeight: '800',
  },
  categoryMeta: {
    color: '#66736E',
    fontSize: 13,
    marginTop: 2,
  },
  categoryAmount: {
    color: '#10251F',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 34,
  },
  emptyTitle: {
    color: '#243A33',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: '#66736E',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalOverlay: {
    backgroundColor: 'rgba(16, 37, 31, 0.28)',
    flex: 1,
  },
  modalKeyboardView: {
    flex: 1,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    gap: 18,
    padding: 20,
    shadowColor: '#10251F',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
  },
  modalHandle: {
    alignSelf: 'center',
    backgroundColor: '#DAE5DF',
    borderRadius: 999,
    height: 4,
    width: 42,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: '#10251F',
    fontSize: 22,
    fontWeight: '800',
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: '#243A33',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    color: '#142720',
    fontSize: 16,
    minHeight: 56,
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: '#C64747',
  },
  errorText: {
    color: '#B73E3E',
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#10251F',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
