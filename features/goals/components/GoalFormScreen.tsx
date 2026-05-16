import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
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

import { currencies } from '@/shared/model/finance';
import type { Budget, Currency } from '@/shared/model/finance';

import { goalStyles as styles } from './styles';
import type { GoalScreenMode } from '@/shared/model/finance';

const formatDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseDateValue = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date();
  }

  return parsedDate;
};

type DateField = 'startDate' | 'targetDate';

type GoalFormScreenProps = {
  budgets: Budget[];
  currentAmount: string;
  error: string;
  goalScreenMode: Exclude<GoalScreenMode, null>;
  goalToDeleteId: string | null;
  hasEditingGoal: boolean;
  name: string;
  onBack: () => void;
  onCancelDelete: () => void;
  onChangeCurrentAmount: (amount: string) => void;
  onChangeName: (name: string) => void;
  onChangeStartDate: (date: string) => void;
  onChangeTargetAmount: (amount: string) => void;
  onChangeTargetDate: (date: string) => void;
  onConfirmDelete: () => void;
  onRequestDelete: () => void;
  onSaveGoal: () => void;
  onSelectBudget: (budgetId: string) => void;
  onSelectCurrency: (currency: Currency) => void;
  selectedBudgetId: string;
  selectedCurrency: Currency;
  startDate: string;
  targetAmount: string;
  targetDate: string;
};

export function GoalFormScreen({
  budgets,
  currentAmount,
  error,
  goalScreenMode,
  goalToDeleteId,
  hasEditingGoal,
  name,
  onBack,
  onCancelDelete,
  onChangeCurrentAmount,
  onChangeName,
  onChangeStartDate,
  onChangeTargetAmount,
  onChangeTargetDate,
  onConfirmDelete,
  onRequestDelete,
  onSaveGoal,
  onSelectBudget,
  onSelectCurrency,
  selectedBudgetId,
  selectedCurrency,
  startDate,
  targetAmount,
  targetDate,
}: GoalFormScreenProps) {
  const [activeDateField, setActiveDateField] = useState<DateField | null>(null);
  const isEditingGoal = goalScreenMode === 'edit';
  const selectedDate = parseDateValue(activeDateField === 'startDate' ? startDate : targetDate);
  const datePickerTitle = activeDateField === 'startDate' ? 'Data startu' : 'Data celu';

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setActiveDateField(null);
    }

    if (!date || !activeDateField) {
      return;
    }

    const nextDate = formatDateValue(date);

    if (activeDateField === 'startDate') {
      onChangeStartDate(nextDate);
      return;
    }

    onChangeTargetDate(nextDate);
  };

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
              <Text style={styles.eyebrow}>Cele</Text>
              <Text style={styles.title}>{isEditingGoal ? 'Edytuj cel' : 'Nowy cel'}</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nazwa celu</Text>
              <TextInput
                onChangeText={onChangeName}
                placeholder="np. Poduszka bezpieczeństwa"
                placeholderTextColor="#8D9994"
                style={[styles.input, error ? styles.inputError : null]}
                value={name}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kwota docelowa</Text>
              <TextInput
                inputMode="decimal"
                keyboardType="decimal-pad"
                onChangeText={onChangeTargetAmount}
                placeholder="np. 12000"
                placeholderTextColor="#8D9994"
                style={[styles.input, error ? styles.inputError : null]}
                value={targetAmount}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Aktualnie odłożone</Text>
              <TextInput
                inputMode="decimal"
                keyboardType="decimal-pad"
                onChangeText={onChangeCurrentAmount}
                placeholder="np. 2500"
                placeholderTextColor="#8D9994"
                style={[styles.input, error ? styles.inputError : null]}
                value={currentAmount}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Daty</Text>
              <Pressable onPress={() => setActiveDateField('startDate')} style={styles.dateButton}>
                <Ionicons name="calendar-outline" size={21} color="#40534B" />
                <Text style={styles.dateButtonText}>Start: {startDate}</Text>
              </Pressable>
              <Pressable onPress={() => setActiveDateField('targetDate')} style={styles.dateButton}>
                <Ionicons name="flag-outline" size={21} color="#40534B" />
                <Text style={styles.dateButtonText}>Cel: {targetDate}</Text>
              </Pressable>
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

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.formActions}>
            <Pressable
              accessibilityLabel={isEditingGoal ? 'Zapisz cel' : 'Dodaj cel'}
              onPress={onSaveGoal}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {isEditingGoal ? 'Zapisz zmiany' : 'Dodaj cel'}
              </Text>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </Pressable>

            {isEditingGoal && hasEditingGoal ? (
              <Pressable onPress={onRequestDelete} style={styles.destructiveButton}>
                <Ionicons name="trash-outline" size={20} color="#B73E3E" />
                <Text style={styles.destructiveButtonText}>Usuń cel</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent visible={Boolean(goalToDeleteId)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Ionicons name="trash-outline" size={24} color="#B73E3E" />
            </View>
            <Text style={styles.confirmTitle}>Czy na pewno chcesz usunąć cel?</Text>
            <Text style={styles.confirmText}>Ta operacja usunie cel z aktualnej listy.</Text>
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

      <Modal animationType="fade" transparent visible={Boolean(activeDateField)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.datePickerCard}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.confirmTitle}>{datePickerTitle}</Text>
              <Pressable hitSlop={10} onPress={() => setActiveDateField(null)}>
                <Ionicons name="close" size={24} color="#40534B" />
              </Pressable>
            </View>
            <DateTimePicker
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              mode="date"
              onChange={handleDateChange}
              themeVariant="light"
              value={selectedDate}
            />
            {Platform.OS === 'ios' ? (
              <Pressable onPress={() => setActiveDateField(null)} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Gotowe</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
