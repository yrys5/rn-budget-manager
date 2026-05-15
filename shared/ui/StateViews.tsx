import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type StateProps = {
  message?: string;
  onRetry?: () => void;
  title: string;
};

export function LoadingState({ title = 'Ładowanie danych' }: Partial<StateProps>) {
  return (
    <View style={styles.stateCard}>
      <ActivityIndicator color="#157348" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export function EmptyState({ message, title }: StateProps) {
  return (
    <View style={styles.stateCard}>
      <Ionicons name="file-tray-outline" size={26} color="#66736E" />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry, title }: StateProps) {
  return (
    <View style={styles.stateCard}>
      <Ionicons name="warning-outline" size={26} color="#B73E3E" />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Spróbuj ponownie</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    color: '#5D6B66',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#10251F',
    borderRadius: 8,
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  stateCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  title: {
    color: '#10251F',
    fontSize: 16,
    fontWeight: '800',
  },
});
