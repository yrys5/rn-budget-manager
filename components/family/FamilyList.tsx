import { Pressable, ScrollView, Text } from 'react-native';

import { familyStyles as styles } from './styles';
import type { Family, FamilyMember } from './types';

type FamilyListProps = {
  activeFamilyId?: string;
  families: Family[];
  members: FamilyMember[];
  onSelectFamily: (familyId: string) => void;
};

export function FamilyList({ activeFamilyId, families, members, onSelectFamily }: FamilyListProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.familyStrip}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {families.map((family) => {
        const isActive = family.id === activeFamilyId;
        const membersCount = members.filter((member) => member.familyId === family.id).length;

        return (
          <Pressable
            key={family.id}
            onPress={() => onSelectFamily(family.id)}
            style={[styles.familyCard, isActive ? styles.familyCardActive : null]}>
            <Text style={[styles.familyName, isActive ? styles.familyNameActive : null]}>
              {family.name}
            </Text>
            <Text style={[styles.familyMeta, isActive ? styles.familyMetaActive : null]}>
              {membersCount} członków
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
