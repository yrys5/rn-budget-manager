import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
}>;

export function Screen({ children, scroll = true }: ScreenProps) {
  if (!scroll) {
    return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  safeArea: {
    backgroundColor: '#F7FAF8',
    flex: 1,
  },
});
