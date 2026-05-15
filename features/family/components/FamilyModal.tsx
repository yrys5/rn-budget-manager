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

import type { Budget } from '@/shared/model/finance';

import { familyStyles as styles } from './styles';

type FamilyModalProps = {
  budgets: Budget[];
  error: string;
  familyName: string;
  mode: 'create' | 'edit';
  onChangeFamilyName: (name: string) => void;
  onClose: () => void;
  onSave: () => void;
  onToggleBudget: (budgetId: string) => void;
  selectedBudgetIds: string[];
  visible: boolean;
};

export function FamilyModal({
  budgets,
  error,
  familyName,
  mode,
  onChangeFamilyName,
  onClose,
  onSave,
  onToggleBudget,
  selectedBudgetIds,
  visible,
}: FamilyModalProps) {
  const nameError = error.startsWith('Nazwa') ? error : '';
  const budgetError = error && !nameError ? error : '';

  return (
    <Modal animationType="slide" transparent visible={visible}>
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
                <Text style={styles.modalTitle}>
                  {mode === 'edit' ? 'Edytuj rodzinę' : 'Nowa rodzina'}
                </Text>
                <Pressable hitSlop={10} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#40534B" />
                </Pressable>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nazwa rodziny</Text>
                <TextInput
                  autoFocus
                  onChangeText={onChangeFamilyName}
                  placeholder="np. Dom"
                  placeholderTextColor="#8D9994"
                  style={[styles.input, nameError ? styles.inputError : null]}
                  value={familyName}
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Powiązane budżety</Text>
                <View style={styles.selectList}>
                  {budgets.map((budget) => {
                    const isSelected = selectedBudgetIds.includes(budget.id);

                    return (
                      <Pressable
                        key={budget.id}
                        onPress={() => onToggleBudget(budget.id)}
                        style={[styles.selectButton, isSelected ? styles.selectButtonActive : null]}>
                        <View
                          style={[
                            styles.checkboxIcon,
                            isSelected ? styles.checkboxIconActive : null,
                          ]}>
                          {isSelected ? (
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          ) : null}
                        </View>
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
                {budgetError ? <Text style={styles.errorText}>{budgetError}</Text> : null}
              </View>

              <Pressable onPress={onSave} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  {mode === 'edit' ? 'Zapisz zmiany' : 'Utwórz rodzinę'}
                </Text>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
