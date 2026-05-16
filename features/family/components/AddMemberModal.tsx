import { Ionicons } from '@expo/vector-icons';
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

import { familyStyles as styles } from './styles';
import type { FamilyMember, User } from '@/shared/model/finance';

type AddMemberModalProps = {
  familyId?: string;
  members: FamilyMember[];
  onAddMember: (email: string) => void;
  onClose: () => void;
  users: User[];
  visible: boolean;
};

export function AddMemberModal({
  familyId,
  members,
  onAddMember,
  onClose,
  users,
  visible,
}: AddMemberModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const resetAndClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  const handleAddMember = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError('Podaj poprawny adres e-mail.');
      return;
    }

    const isAlreadyMember =
      user &&
      members.some((member) => member.familyId === familyId && member.userId === user.id);

    if (isAlreadyMember) {
      setError('Ten użytkownik jest już członkiem tej rodziny.');
      return;
    }

    onAddMember(normalizedEmail);
    setEmail('');
    setError('');
  };

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
                <Text style={styles.modalTitle}>Dodaj członka</Text>
                <Pressable hitSlop={10} onPress={resetAndClose}>
                  <Ionicons name="close" size={24} color="#40534B" />
                </Pressable>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>E-mail użytkownika</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  inputMode="email"
                  keyboardType="email-address"
                  onChangeText={(value) => {
                    setEmail(value);
                    setError('');
                  }}
                  placeholder="np. anna@example.com"
                  placeholderTextColor="#8D9994"
                  style={[styles.input, error ? styles.inputError : null]}
                  value={email}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <Pressable
                accessibilityLabel="Dodaj do rodziny"
                onPress={handleAddMember}
                style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Dodaj do rodziny</Text>
                <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
