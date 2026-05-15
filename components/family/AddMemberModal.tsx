import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { familyStyles as styles } from './styles';
import type { FamilyMember, User } from './types';

type AddMemberModalProps = {
  familyId?: string;
  members: FamilyMember[];
  onAddMember: (userId: string) => void;
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
  const availableUsers = users.filter(
    (user) =>
      !members.some((member) => member.familyId === familyId && member.userId === user.id),
  );

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <ScrollView
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dodaj członka</Text>
              <Pressable hitSlop={10} onPress={onClose}>
                <Ionicons name="close" size={24} color="#40534B" />
              </Pressable>
            </View>

            <View style={styles.selectList}>
              {availableUsers.length ? (
                availableUsers.map((user) => (
                  <Pressable
                    key={user.id}
                    onPress={() => onAddMember(user.id)}
                    style={styles.selectButton}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{user.username.slice(0, 2)}</Text>
                    </View>
                    <View style={styles.selectButtonCopy}>
                      <Text style={styles.selectButtonText}>{user.username}</Text>
                      <Text style={styles.selectButtonMeta}>{user.email}</Text>
                    </View>
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle-outline" size={28} color="#66736E" />
                  <Text style={styles.emptyTitle}>Wszyscy są już w rodzinie</Text>
                  <Text style={styles.emptyText}>Nie ma użytkowników do dodania.</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
