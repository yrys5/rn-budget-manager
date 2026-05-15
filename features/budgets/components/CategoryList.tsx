import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { budgetStyles as styles } from './styles';
import type { Budget, Category } from '@/shared/model/finance';

type CategoryListProps = {
  budget: Budget;
  onCreateCategory: () => void;
  onEditCategory: (category: Category) => void;
};

export function CategoryList({ budget, onCreateCategory, onEditCategory }: CategoryListProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Zawartość budżetu</Text>
        <Pressable onPress={onCreateCategory} style={styles.sectionActionButton}>
          <Ionicons name="add" size={16} color="#157348" />
          <Text style={styles.sectionAction}>Kategoria</Text>
        </Pressable>
      </View>

      <View style={styles.categoryList}>
        {budget.categories.length ? (
          budget.categories.map((category) => (
            <View key={category.id} style={styles.categoryRow}>
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}1A` }]}>
                <Ionicons name={category.icon} size={21} color={category.color} />
              </View>
              <View style={styles.categoryCopy}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryMeta}>{category.type}</Text>
              </View>
              <Pressable
                hitSlop={10}
                onPress={() => onEditCategory(category)}
                style={styles.categoryEditButton}>
                <Ionicons name="create-outline" size={18} color="#40534B" />
              </Pressable>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={28} color="#66736E" />
            <Text style={styles.emptyTitle}>Budżet jest pusty</Text>
            <Text style={styles.emptyText}>
              Dodaj pierwszą kategorię, żeby uporządkować przyszłe transakcje i limity.
            </Text>
            <Pressable onPress={onCreateCategory} style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Dodaj kategorię</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
