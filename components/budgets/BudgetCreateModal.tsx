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

import { budgetStyles as styles } from './styles';

type BudgetCreateModalProps = {
  budgetName: string;
  error: string;
  onChangeBudgetName: (name: string) => void;
  onClose: () => void;
  onCreateBudget: () => void;
  visible: boolean;
};

export function BudgetCreateModal({
  budgetName,
  error,
  onChangeBudgetName,
  onClose,
  onCreateBudget,
  visible,
}: BudgetCreateModalProps) {
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
                <Text style={styles.modalTitle}>Nowy budżet</Text>
                <Pressable hitSlop={10} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#40534B" />
                </Pressable>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nazwa budżetu</Text>
                <TextInput
                  autoFocus
                  onChangeText={onChangeBudgetName}
                  placeholder="np. Remont mieszkania"
                  placeholderTextColor="#8D9994"
                  style={[styles.input, error ? styles.inputError : null]}
                  value={budgetName}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <Pressable onPress={onCreateBudget} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Utwórz budżet</Text>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
