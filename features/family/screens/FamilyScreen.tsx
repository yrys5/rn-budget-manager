import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';

import { budgetsApi } from '@/features/budgets/api/budgetsApi';
import { familyApi } from '../api/familyApi';
import { AddMemberModal } from '../components/AddMemberModal';
import { FamilyBudgetsList } from '../components/FamilyBudgetsList';
import { FamilyList } from '../components/FamilyList';
import { FamilyMembersList } from '../components/FamilyMembersList';
import { FamilyModal } from '../components/FamilyModal';
import { familyStyles as styles } from '../components/styles';
import { useFamilyWorkspace } from '../hooks/useFamilyWorkspace';
import { validateFamily } from '../model/validation';
import type {
  Budget,
  Family,
  FamilyBudget,
  FamilyMember,
  FamilyScreenMode,
  User,
} from '@/shared/model/finance';
import { ErrorState, LoadingState } from '@/shared/ui';

export default function FamilyScreen() {
  const { reload, setIsSaving, state } = useFamilyWorkspace();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [familyBudgets, setFamilyBudgets] = useState<FamilyBudget[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeFamilyId, setActiveFamilyId] = useState('');
  const [familyScreenMode, setFamilyScreenMode] = useState<FamilyScreenMode>(null);
  const [familyName, setFamilyName] = useState('');
  const [selectedBudgetIds, setSelectedBudgetIds] = useState<string[]>([]);
  const [familyError, setFamilyError] = useState('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [familyToDeleteId, setFamilyToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (state.data) {
      setFamilies(state.data.families);
      setFamilyBudgets(state.data.familyBudgets);
      setMembers(state.data.members);
      setUsers(state.data.users);
      setActiveFamilyId((currentId) => currentId || state.data?.families[0]?.id || '');
    }
  }, [state.data]);

  useEffect(() => {
    let isMounted = true;

    const loadBudgets = async () => {
      const nextBudgets = await budgetsApi.list();

      if (isMounted) {
        setBudgets(nextBudgets);
      }
    };

    void loadBudgets();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeFamily = useMemo(
    () => families.find((family) => family.id === activeFamilyId) ?? families[0],
    [activeFamilyId, families],
  );

  const activeMembersCount = members.filter((member) => member.familyId === activeFamily?.id).length;
  const activeBudgetsCount = familyBudgets.filter(
    (item) => item.familyId === activeFamily?.id,
  ).length;

  const closeFamilyModal = () => {
    setFamilyScreenMode(null);
    setFamilyName('');
    setSelectedBudgetIds([]);
    setFamilyError('');
  };

  const openCreateFamilyModal = () => {
    setFamilyName('');
    setSelectedBudgetIds(budgets[0] ? [budgets[0].id] : []);
    setFamilyError('');
    setFamilyScreenMode('create');
  };

  const openEditFamilyModal = () => {
    if (!activeFamily) {
      return;
    }

    setFamilyName(activeFamily.name);
    setSelectedBudgetIds(
      familyBudgets
        .filter((item) => item.familyId === activeFamily.id)
        .map((item) => item.budgetId),
    );
    setFamilyError('');
    setFamilyScreenMode('edit');
  };

  const handleToggleBudget = (budgetId: string) => {
    setSelectedBudgetIds((currentBudgetIds) =>
      currentBudgetIds.includes(budgetId)
        ? currentBudgetIds.filter((id) => id !== budgetId)
        : [...currentBudgetIds, budgetId],
    );
    setFamilyError('');
  };

  const handleSaveFamily = async () => {
    const nextName = familyName.trim();
    const validationError = validateFamily({ budgetIds: selectedBudgetIds, name: nextName });

    if (validationError) {
      setFamilyError(validationError);
      return;
    }

    if (familyScreenMode === 'edit' && activeFamily) {
      setIsSaving(true);
      try {
        const result = await familyApi.saveFamily({
          budgetIds: selectedBudgetIds,
          family: { ...activeFamily, name: nextName },
        });
        setFamilies((currentFamilies) =>
          currentFamilies.map((family) =>
            family.id === activeFamily.id ? { ...family, name: nextName } : family,
          ),
        );
        setFamilyBudgets((currentFamilyBudgets) => [
          ...result.familyBudgets,
          ...currentFamilyBudgets.filter((item) => item.familyId !== activeFamily.id),
        ]);
        closeFamilyModal();
      } finally {
        setIsSaving(false);
      }
      return;
    }

    const nextFamily: Family = {
      id: '',
      name: nextName,
    };

    setIsSaving(true);
    try {
      const result = await familyApi.saveFamily({
        budgetIds: selectedBudgetIds,
        family: nextFamily,
        ownerUserId: 'current-user',
      });
      setFamilies((currentFamilies) => [result.family, ...currentFamilies]);
      if (result.member) {
        setMembers((currentMembers) => [result.member!, ...currentMembers]);
      }
      setFamilyBudgets((currentFamilyBudgets) => [
        ...result.familyBudgets,
        ...currentFamilyBudgets,
      ]);
      setActiveFamilyId(result.family.id);
      closeFamilyModal();
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!activeFamily) {
      return;
    }

    setIsSaving(true);
    try {
      const member = await familyApi.addMember(activeFamily.id, userId);
      setMembers((currentMembers) => [member, ...currentMembers]);
      setUsers((currentUsers) =>
        currentUsers.some((user) => user.id === member.userId)
          ? currentUsers
          : [
              {
                createdAt: '',
                email: '',
                id: member.userId,
                passwordHash: '',
                username: `Użytkownik ${member.userId}`,
              },
              ...currentUsers,
            ],
      );
      setIsAddMemberOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeFamily) {
      return;
    }

    setIsSaving(true);
    try {
      await familyApi.removeMember(activeFamily.id, userId);
      setMembers((currentMembers) =>
        currentMembers.filter(
          (member) => !(member.familyId === activeFamily.id && member.userId === userId),
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFamily = async () => {
    if (!familyToDeleteId) {
      return;
    }

    const nextFamilies = families.filter((family) => family.id !== familyToDeleteId);

    setIsSaving(true);
    try {
      await familyApi.deleteFamily(familyToDeleteId);
      setFamilies(nextFamilies);
      setMembers((currentMembers) =>
        currentMembers.filter((member) => member.familyId !== familyToDeleteId),
      );
      setFamilyBudgets((currentFamilyBudgets) =>
        currentFamilyBudgets.filter((item) => item.familyId !== familyToDeleteId),
      );
      setActiveFamilyId(nextFamilies[0]?.id ?? '');
      setFamilyToDeleteId(null);
    } finally {
      setIsSaving(false);
    }
  };

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <LoadingState title="Ładowanie rodzin" />
        </View>
      </SafeAreaView>
    );
  }

  if (state.status === 'error') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ErrorState
            message={state.error.message}
            onRetry={reload}
            title="Nie udało się pobrać rodzin"
          />
        </View>
      </SafeAreaView>
    );
  }

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
          familyBudgets={familyBudgets}
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
                  <Text style={styles.familyMeta}>
                    {activeMembersCount} członków · {activeBudgetsCount} budżetów
                  </Text>
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

            <FamilyBudgetsList
              budgets={budgets}
              familyBudgets={familyBudgets}
              familyId={activeFamily.id}
            />

            <FamilyMembersList
              familyId={activeFamily.id}
              members={members}
              onAddMember={() => setIsAddMemberOpen(true)}
              onRemoveMember={handleRemoveMember}
              users={users}
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
        budgets={budgets}
        error={familyError}
        familyName={familyName}
        mode={familyScreenMode === 'edit' ? 'edit' : 'create'}
        onChangeFamilyName={setFamilyName}
        onClose={closeFamilyModal}
        onSave={handleSaveFamily}
        onToggleBudget={handleToggleBudget}
        selectedBudgetIds={selectedBudgetIds}
        visible={Boolean(familyScreenMode)}
      />

      <AddMemberModal
        familyId={activeFamily?.id}
        members={members}
        onAddMember={handleAddMember}
        onClose={() => setIsAddMemberOpen(false)}
        users={users}
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
