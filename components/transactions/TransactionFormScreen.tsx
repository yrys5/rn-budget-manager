import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { currencies } from '@/components/budgets/data';
import type { Budget, Currency } from '@/components/budgets/types';

import { transactionStyles as styles } from './styles';
import type { TransactionScreenMode } from './types';

type TransactionFormScreenProps = {
  amount: string;
  budgets: Budget[];
  description: string;
  error: string;
  hasEditingTransaction: boolean;
  onBack: () => void;
  onCancelDelete: () => void;
  onChangeAmount: (amount: string) => void;
  onChangeDescription: (description: string) => void;
  onChangeTransactionDate: (date: string) => void;
  onConfirmDelete: () => void;
  onRequestDelete: () => void;
  onSaveTransaction: () => void;
  onSelectBudget: (budgetId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectCurrency: (currency: Currency) => void;
  selectedBudgetId: string;
  selectedCategoryId: string;
  selectedCurrency: Currency;
  transactionDate: string;
  transactionScreenMode: Exclude<TransactionScreenMode, null>;
  transactionToDeleteId: string | null;
};

export function TransactionFormScreen({
  amount,
  budgets,
  description,
  error,
  hasEditingTransaction,
  onBack,
  onCancelDelete,
  onChangeAmount,
  onChangeDescription,
  onChangeTransactionDate,
  onConfirmDelete,
  onRequestDelete,
  onSaveTransaction,
  onSelectBudget,
  onSelectCategory,
  onSelectCurrency,
  selectedBudgetId,
  selectedCategoryId,
  selectedCurrency,
  transactionDate,
  transactionScreenMode,
  transactionToDeleteId,
}: TransactionFormScreenProps) {
  const isEditingTransaction = transactionScreenMode === 'edit';
  const selectedBudget = budgets.find((budget) => budget.id === selectedBudgetId) ?? budgets[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formKeyboardView}>
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.formHeader}>
            <Pressable onPress={onBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color="#10251F" />
            </Pressable>
            <View style={styles.formHeaderCopy}>
              <Text style={styles.eyebrow}>Transakcje</Text>
              <Text style={styles.title}>
                {isEditingTransaction ? 'Edytuj transakcję' : 'Nowa transakcja'}
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Opis</Text>
              <TextInput
                onChangeText={onChangeDescription}
                placeholder="np. Zakupy spożywcze"
                placeholderTextColor="#8D9994"
                style={[styles.input, error ? styles.inputError : null]}
                value={description}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kwota</Text>
              <Text style={styles.helperText}>Użyj wartości ujemnej dla wydatku, np. -120.</Text>
              <TextInput
                inputMode="decimal"
                keyboardType="decimal-pad"
                onChangeText={onChangeAmount}
                placeholder="np. -120"
                placeholderTextColor="#8D9994"
                style={[styles.input, error ? styles.inputError : null]}
                value={amount}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Data transakcji</Text>
              <TextInput
                onChangeText={onChangeTransactionDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#8D9994"
                style={[styles.input, error ? styles.inputError : null]}
                value={transactionDate}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Waluta</Text>
              <View style={styles.compactGrid}>
                {currencies.map((currency) => {
                  const isSelected = currency === selectedCurrency;

                  return (
                    <Pressable
                      key={currency}
                      onPress={() => onSelectCurrency(currency)}
                      style={[styles.compactOption, isSelected ? styles.compactOptionActive : null]}>
                      <Text
                        style={[
                          styles.compactOptionText,
                          isSelected ? styles.compactOptionTextActive : null,
                        ]}>
                        {currency}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Budżet</Text>
              <View style={styles.selectList}>
                {budgets.map((budget) => {
                  const isSelected = budget.id === selectedBudgetId;

                  return (
                    <Pressable
                      key={budget.id}
                      onPress={() => onSelectBudget(budget.id)}
                      style={[styles.selectButton, isSelected ? styles.selectButtonActive : null]}>
                      <Ionicons
                        name="wallet-outline"
                        size={21}
                        color={isSelected ? '#FFFFFF' : '#157348'}
                      />
                      <View style={styles.selectButtonCopy}>
                        <Text
                          style={[
                            styles.selectButtonText,
                            isSelected ? styles.selectButtonTextActive : null,
                          ]}>
                          {budget.name}
                        </Text>
                        <Text
                          style={[
                            styles.selectButtonMeta,
                            isSelected ? styles.selectButtonMetaActive : null,
                          ]}>
                          {budget.categories.length} kategorii
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kategoria</Text>
              <View style={styles.selectList}>
                {selectedBudget.categories.map((category) => {
                  const isSelected = category.id === selectedCategoryId;

                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => onSelectCategory(category.id)}
                      style={[styles.selectButton, isSelected ? styles.selectButtonActive : null]}>
                      <Ionicons
                        name={category.icon}
                        size={21}
                        color={isSelected ? '#FFFFFF' : category.color}
                      />
                      <View style={styles.selectButtonCopy}>
                        <Text
                          style={[
                            styles.selectButtonText,
                            isSelected ? styles.selectButtonTextActive : null,
                          ]}>
                          {category.name}
                        </Text>
                        <Text
                          style={[
                            styles.selectButtonMeta,
                            isSelected ? styles.selectButtonMetaActive : null,
                          ]}>
                          {category.type}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.formActions}>
            <Pressable onPress={onSaveTransaction} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {isEditingTransaction ? 'Zapisz zmiany' : 'Dodaj transakcję'}
              </Text>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </Pressable>

            {isEditingTransaction && hasEditingTransaction ? (
              <Pressable onPress={onRequestDelete} style={styles.destructiveButton}>
                <Ionicons name="trash-outline" size={20} color="#B73E3E" />
                <Text style={styles.destructiveButtonText}>Usuń transakcję</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent visible={Boolean(transactionToDeleteId)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Ionicons name="trash-outline" size={24} color="#B73E3E" />
            </View>
            <Text style={styles.confirmTitle}>Czy na pewno chcesz usunąć transakcję?</Text>
            <Text style={styles.confirmText}>
              Ta operacja usunie transakcję z aktualnej listy.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable onPress={onCancelDelete} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Anuluj</Text>
              </Pressable>
              <Pressable onPress={onConfirmDelete} style={styles.confirmDeleteButton}>
                <Text style={styles.confirmDeleteButtonText}>Usuń</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
