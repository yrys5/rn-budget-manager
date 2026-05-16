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

import { currencies, months } from '@/shared/model/finance';
import { budgetStyles as styles } from './styles';
import type { Budget, Currency, LimitScreenMode } from '@/shared/model/finance';

type LimitFormScreenProps = {
  amount: string;
  budget: Budget;
  error: string;
  hasEditingLimit: boolean;
  limitScreenMode: Exclude<LimitScreenMode, null>;
  limitToDeleteId: string | null;
  onBack: () => void;
  onCancelDelete: () => void;
  onChangeAmount: (amount: string) => void;
  onChangeYear: (year: string) => void;
  onConfirmDelete: () => void;
  onRequestDelete: () => void;
  onSaveLimit: () => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectCurrency: (currency: Currency) => void;
  onSelectMonth: (month: number) => void;
  periodMonth: number;
  periodYear: string;
  selectedCategoryId: string;
  selectedCurrency: Currency;
};

export function LimitFormScreen({
  amount,
  budget,
  error,
  hasEditingLimit,
  limitScreenMode,
  limitToDeleteId,
  onBack,
  onCancelDelete,
  onChangeAmount,
  onChangeYear,
  onConfirmDelete,
  onRequestDelete,
  onSaveLimit,
  onSelectCategory,
  onSelectCurrency,
  onSelectMonth,
  periodMonth,
  periodYear,
  selectedCategoryId,
  selectedCurrency,
}: LimitFormScreenProps) {
  const isEditingLimit = limitScreenMode === 'edit';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formKeyboardView}>
        <ScrollView
          contentContainerStyle={styles.formScreenContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.formHeader}>
            <Pressable onPress={onBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color="#10251F" />
            </Pressable>
            <View style={styles.formHeaderCopy}>
              <Text style={styles.eyebrow}>{budget.name}</Text>
              <Text style={styles.title}>{isEditingLimit ? 'Edytuj limit' : 'Nowy limit'}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kategoria</Text>
              <Text style={styles.helperText}>
                Limit zostanie przypisany do aktywnego budżetu i wybranej kategorii.
              </Text>
              <View style={styles.selectList}>
                {budget.categories.map((category) => {
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

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kwota limitu</Text>
              <TextInput
                inputMode="decimal"
                keyboardType="decimal-pad"
                onChangeText={onChangeAmount}
                placeholder="np. 1500"
                placeholderTextColor="#8D9994"
                style={[styles.input, error ? styles.inputError : null]}
                value={amount}
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
              <Text style={styles.label}>Okres</Text>
              <TextInput
                inputMode="numeric"
                keyboardType="number-pad"
                maxLength={4}
                onChangeText={onChangeYear}
                placeholder="Rok"
                placeholderTextColor="#8D9994"
                style={styles.input}
                value={periodYear}
              />
              <View style={styles.compactGrid}>
                {months.map((month) => {
                  const isSelected = month.value === periodMonth;

                  return (
                    <Pressable
                      key={month.value}
                      onPress={() => onSelectMonth(month.value)}
                      style={[styles.compactOption, isSelected ? styles.compactOptionActive : null]}>
                      <Text
                        style={[
                          styles.compactOptionText,
                          isSelected ? styles.compactOptionTextActive : null,
                        ]}>
                        {month.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.formActions}>
            <Pressable
              accessibilityLabel={isEditingLimit ? 'Zapisz limit' : 'Dodaj limit'}
              onPress={onSaveLimit}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {isEditingLimit ? 'Zapisz zmiany' : 'Dodaj limit'}
              </Text>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </Pressable>

            {isEditingLimit && hasEditingLimit ? (
              <Pressable onPress={onRequestDelete} style={styles.destructiveButton}>
                <Ionicons name="trash-outline" size={20} color="#B73E3E" />
                <Text style={styles.destructiveButtonText}>Usuń limit</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent visible={Boolean(limitToDeleteId)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Ionicons name="trash-outline" size={24} color="#B73E3E" />
            </View>
            <Text style={styles.confirmTitle}>Czy na pewno chcesz usunąć limit?</Text>
            <Text style={styles.confirmText}>
              Limit dla tej kategorii i okresu zostanie usunięty z budżetu.
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
