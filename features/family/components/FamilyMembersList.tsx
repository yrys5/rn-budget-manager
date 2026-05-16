import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { familyStyles as styles } from './styles';
import type { FamilyMember, User } from '@/shared/model/finance';

type FamilyMembersListProps = {
  familyId: string;
  members: FamilyMember[];
  onAddMember: () => void;
  onRemoveMember: (userId: string) => void;
  users: User[];
};

const getInitials = (username: string) => username.slice(0, 2);

export function FamilyMembersList({
  familyId,
  members,
  onAddMember,
  onRemoveMember,
  users,
}: FamilyMembersListProps) {
  const familyMembers = members.filter((member) => member.familyId === familyId);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Członkowie rodziny</Text>
        <Pressable
          accessibilityLabel="Dodaj członka rodziny"
          onPress={onAddMember}
          style={styles.sectionActionButton}>
          <Ionicons name="add" size={16} color="#157348" />
          <Text style={styles.sectionAction}>Członek</Text>
        </Pressable>
      </View>

      <View style={styles.listCard}>
        {familyMembers.length ? (
          familyMembers.map((member) => {
            const user = users.find((item) => item.id === member.userId);

            if (!user) {
              return null;
            }

            return (
              <View key={member.id} style={styles.memberRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(user.username)}</Text>
                </View>
                <View style={styles.memberCopy}>
                  <Text style={styles.memberName}>{user.username}</Text>
                  <Text style={styles.memberEmail}>{user.email}</Text>
                </View>
                <Pressable
                  hitSlop={10}
                  onPress={() => onRemoveMember(member.userId)}
                  style={styles.removeButton}>
                  <Ionicons name="trash-outline" size={18} color="#B73E3E" />
                </Pressable>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={28} color="#66736E" />
            <Text style={styles.emptyTitle}>Brak członków</Text>
            <Text style={styles.emptyText}>Dodaj pierwszego użytkownika do tej rodziny.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
