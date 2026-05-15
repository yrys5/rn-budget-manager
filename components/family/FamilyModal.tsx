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

import { familyStyles as styles } from './styles';

type FamilyModalProps = {
  error: string;
  familyName: string;
  mode: 'create' | 'edit';
  onChangeFamilyName: (name: string) => void;
  onClose: () => void;
  onSave: () => void;
  visible: boolean;
};

export function FamilyModal({
  error,
  familyName,
  mode,
  onChangeFamilyName,
  onClose,
  onSave,
  visible,
}: FamilyModalProps) {
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
                  style={[styles.input, error ? styles.inputError : null]}
                  value={familyName}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
