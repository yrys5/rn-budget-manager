import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';

import { AddMemberModal } from '@/components/family/AddMemberModal';
import { FamilyList } from '@/components/family/FamilyList';
import { FamilyMembersList } from '@/components/family/FamilyMembersList';
import { FamilyModal } from '@/components/family/FamilyModal';
import {
  currentUserId,
  initialFamilies,
  initialFamilyMembers,
  initialUsers,
} from '@/components/family/data';
import { familyStyles as styles } from '@/components/family/styles';
import type { Family, FamilyScreenMode } from '@/components/family/types';

export default function FamilyScreen() {
  const [families, setFamilies] = useState(initialFamilies);
  const [members, setMembers] = useState(initialFamilyMembers);
  const [activeFamilyId, setActiveFamilyId] = useState(initialFamilies[0].id);
  const [familyScreenMode, setFamilyScreenMode] = useState<FamilyScreenMode>(null);
  const [familyName, setFamilyName] = useState('');
  const [familyError, setFamilyError] = useState('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [familyToDeleteId, setFamilyToDeleteId] = useState<string | null>(null);

  const activeFamily = useMemo(
    () => families.find((family) => family.id === activeFamilyId) ?? families[0],
    [activeFamilyId, families],
  );

  const activeMembersCount = members.filter((member) => member.familyId === activeFamily?.id).length;

  const closeFamilyModal = () => {
    setFamilyScreenMode(null);
    setFamilyName('');
    setFamilyError('');
  };

  const openCreateFamilyModal = () => {
    setFamilyName('');
    setFamilyError('');
    setFamilyScreenMode('create');
  };

  const openEditFamilyModal = () => {
    if (!activeFamily) {
      return;
    }

    setFamilyName(activeFamily.name);
    setFamilyError('');
    setFamilyScreenMode('edit');
  };

  const handleSaveFamily = () => {
    const nextName = familyName.trim();

    if (nextName.length < 3) {
      setFamilyError('Nazwa rodziny musi mieć minimum 3 znaki.');
      return;
    }

    if (familyScreenMode === 'edit' && activeFamily) {
      setFamilies((currentFamilies) =>
        currentFamilies.map((family) =>
          family.id === activeFamily.id ? { ...family, name: nextName } : family,
        ),
      );
      closeFamilyModal();
      return;
    }

    const nextFamily: Family = {
      id: `${Date.now()}`,
      name: nextName,
    };
    const nextMember = {
      id: `${Date.now()}-member`,
      familyId: nextFamily.id,
      userId: currentUserId,
    };

    setFamilies((currentFamilies) => [nextFamily, ...currentFamilies]);
    setMembers((currentMembers) => [nextMember, ...currentMembers]);
    setActiveFamilyId(nextFamily.id);
    closeFamilyModal();
  };

  const handleAddMember = (userId: string) => {
    if (!activeFamily) {
      return;
    }

    setMembers((currentMembers) => [
      {
        id: `${Date.now()}-${userId}`,
        familyId: activeFamily.id,
        userId,
      },
      ...currentMembers,
    ]);
    setIsAddMemberOpen(false);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((currentMembers) => currentMembers.filter((member) => member.id !== memberId));
  };

  const handleDeleteFamily = () => {
    if (!familyToDeleteId) {
      return;
    }

    const nextFamilies = families.filter((family) => family.id !== familyToDeleteId);

    setFamilies(nextFamilies);
    setMembers((currentMembers) =>
      currentMembers.filter((member) => member.familyId !== familyToDeleteId),
    );
    setActiveFamilyId(nextFamilies[0]?.id ?? '');
    setFamilyToDeleteId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Rodzina</Text>
            <Text style={styles.title}>Wspólne budżety</Text>
          </View>
          <Pressable onPress={openCreateFamilyModal} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <FamilyList
          activeFamilyId={activeFamily?.id}
          families={families}
          members={members}
          onSelectFamily={setActiveFamilyId}
        />

        {activeFamily ? (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.summaryLabel}>Aktywna rodzina</Text>
                  <Text style={styles.summaryTitle}>{activeFamily.name}</Text>
                  <Text style={styles.familyMeta}>{activeMembersCount} członków</Text>
                </View>
                <View style={styles.iconButtonRow}>
                  <Pressable onPress={openEditFamilyModal} style={styles.iconButton}>
                    <Ionicons name="create-outline" size={20} color="#40534B" />
                  </Pressable>
                  <Pressable
                    onPress={() => setFamilyToDeleteId(activeFamily.id)}
                    style={[styles.iconButton, styles.dangerIconButton]}>
                    <Ionicons name="trash-outline" size={20} color="#B73E3E" />
                  </Pressable>
                </View>
              </View>
            </View>

            <FamilyMembersList
              familyId={activeFamily.id}
              members={members}
              onAddMember={() => setIsAddMemberOpen(true)}
              onRemoveMember={handleRemoveMember}
              users={initialUsers}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={28} color="#66736E" />
            <Text style={styles.emptyTitle}>Brak rodzin</Text>
            <Text style={styles.emptyText}>Utwórz rodzinę, żeby dodać do niej użytkowników.</Text>
          </View>
        )}
      </ScrollView>

      <FamilyModal
        error={familyError}
        familyName={familyName}
        mode={familyScreenMode === 'edit' ? 'edit' : 'create'}
        onChangeFamilyName={setFamilyName}
        onClose={closeFamilyModal}
        onSave={handleSaveFamily}
        visible={Boolean(familyScreenMode)}
      />

      <AddMemberModal
        familyId={activeFamily?.id}
        members={members}
        onAddMember={handleAddMember}
        onClose={() => setIsAddMemberOpen(false)}
        users={initialUsers}
        visible={isAddMemberOpen}
      />

      <Modal animationType="fade" transparent visible={Boolean(familyToDeleteId)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Ionicons name="trash-outline" size={24} color="#B73E3E" />
            </View>
            <Text style={styles.confirmTitle}>Czy na pewno chcesz usunąć rodzinę?</Text>
            <Text style={styles.confirmText}>
              Rodzina i jej powiązania z użytkownikami zostaną usunięte z aktualnego widoku.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable onPress={() => setFamilyToDeleteId(null)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Anuluj</Text>
              </Pressable>
              <Pressable onPress={handleDeleteFamily} style={styles.confirmDeleteButton}>
                <Text style={styles.confirmDeleteButtonText}>Usuń</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
