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

import { budgetStyles as styles } from './styles';
import type { CategoryScreenMode, CategoryTypeOption } from './types';

type CategoryFormScreenProps = {
  budgetName?: string;
  categoryName: string;
  categoryScreenMode: Exclude<CategoryScreenMode, null>;
  categoryToDeleteId: string | null;
  error: string;
  hasEditingCategory: boolean;
  onBack: () => void;
  onCancelDelete: () => void;
  onChangeCategoryName: (name: string) => void;
  onConfirmDelete: () => void;
  onRequestDelete: () => void;
  onSaveCategory: () => void;
  onSelectCategoryType: (categoryType: CategoryTypeOption) => void;
  selectedCategoryType: CategoryTypeOption;
  categoryTypes: CategoryTypeOption[];
};

export function CategoryFormScreen({
  budgetName,
  categoryName,
  categoryScreenMode,
  categoryToDeleteId,
  error,
  hasEditingCategory,
  onBack,
  onCancelDelete,
  onChangeCategoryName,
  onConfirmDelete,
  onRequestDelete,
  onSaveCategory,
  onSelectCategoryType,
  selectedCategoryType,
  categoryTypes,
}: CategoryFormScreenProps) {
  const isEditingCategory = categoryScreenMode === 'edit';

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
              <Text style={styles.eyebrow}>{budgetName}</Text>
              <Text style={styles.title}>
                {isEditingCategory ? 'Edytuj kategorię' : 'Nowa kategoria'}
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nazwa kategorii</Text>
              <TextInput
                autoFocus
                onChangeText={onChangeCategoryName}
                placeholder="np. Zwierzęta"
                placeholderTextColor="#8D9994"
                style={[styles.input, error ? styles.inputError : null]}
                value={categoryName}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Typ kategorii</Text>
              <Text style={styles.helperText}>
                Wybierz dokładnie jeden typ zgodny z tabelą Categories.
              </Text>
              <View style={styles.presetGrid}>
                {categoryTypes.map((categoryType) => {
                  const isSelected = categoryType.label === selectedCategoryType.label;

                  return (
                    <Pressable
                      key={categoryType.label}
                      onPress={() => onSelectCategoryType(categoryType)}
                      style={[styles.presetButton, isSelected ? styles.presetButtonActive : null]}>
                      <Ionicons
                        name={categoryType.icon}
                        size={20}
                        color={isSelected ? '#FFFFFF' : categoryType.color}
                      />
                      <Text
                        style={[
                          styles.presetButtonText,
                          isSelected ? styles.presetButtonTextActive : null,
                        ]}>
                        {categoryType.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.formActions}>
            <Pressable onPress={onSaveCategory} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {isEditingCategory ? 'Zapisz zmiany' : 'Dodaj kategorię'}
              </Text>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </Pressable>

            {isEditingCategory && hasEditingCategory ? (
              <Pressable onPress={onRequestDelete} style={styles.destructiveButton}>
                <Ionicons name="trash-outline" size={20} color="#B73E3E" />
                <Text style={styles.destructiveButtonText}>Usuń kategorię</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent visible={Boolean(categoryToDeleteId)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Ionicons name="trash-outline" size={24} color="#B73E3E" />
            </View>
            <Text style={styles.confirmTitle}>Czy na pewno chcesz usunąć kategorię?</Text>
            <Text style={styles.confirmText}>
              Tej akcji nie będzie można cofnąć w aktualnym widoku.
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
