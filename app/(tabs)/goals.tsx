import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="flag-outline" size={30} color="#157348" />
        </View>
        <Text style={styles.title}>Cele</Text>
        <Text style={styles.description}>
          Tutaj trafi lista celów budżetowych wraz z akcjami tworzenia, edycji i usuwania.
        </Text>
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
    justifyContent: 'center',
    padding: 24,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#E6F6EE',
    borderRadius: 8,
    height: 58,
    justifyContent: 'center',
    marginBottom: 18,
    width: 58,
  },
  title: {
    color: '#10251F',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 38,
  },
  description: {
    color: '#5D6B66',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },
});
