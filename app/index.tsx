import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.brandMark}>
            <Ionicons name="wallet-outline" size={34} color="#0E2A21" />
          </View>

          <View style={styles.copy}>
            <Text style={styles.eyebrow}>Budget Manager</Text>
            <Text style={styles.title}>Twoje finanse pod ręką</Text>
            <Text style={styles.subtitle}>
              Planuj wydatki, kontroluj budżet i wracaj do swoich celów wtedy, kiedy ich
              potrzebujesz.
            </Text>
          </View>
        </View>

        <View style={styles.previewPanel}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Saldo miesiąca</Text>
            <Ionicons name="trending-up-outline" size={22} color="#157348" />
          </View>
          <Text style={styles.balance}>4 280 zł</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Wydatki</Text>
              <Text style={styles.statValue}>1 240 zł</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Cel</Text>
              <Text style={styles.statValue}>68%</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Link href="/login" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Zaloguj się</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </Link>

          <Link href="/register" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Utwórz konto</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  hero: {
    gap: 28,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: '#D9F2E4',
    borderRadius: 8,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  copy: {
    gap: 10,
  },
  eyebrow: {
    color: '#527469',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#10251F',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 44,
    maxWidth: 360,
  },
  subtitle: {
    color: '#5D6B66',
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 370,
  },
  previewPanel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 18,
    shadowColor: '#244035',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewTitle: {
    color: '#40534B',
    fontSize: 14,
    fontWeight: '700',
  },
  balance: {
    color: '#10251F',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0,
  },
  progressTrack: {
    backgroundColor: '#DBE4DF',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#1D8E62',
    borderRadius: 999,
    height: '100%',
    width: '68%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    backgroundColor: '#F7FAF8',
    borderRadius: 8,
    flex: 1,
    gap: 4,
    padding: 12,
  },
  statLabel: {
    color: '#66736E',
    fontSize: 13,
  },
  statValue: {
    color: '#243A33',
    fontSize: 16,
    fontWeight: '800',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#10251F',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#C9D8D1',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#10251F',
    fontSize: 16,
    fontWeight: '800',
  },
});
