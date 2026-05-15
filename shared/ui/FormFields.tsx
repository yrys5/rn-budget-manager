import { Text, TextInput, View } from 'react-native';

import { fieldStyles as styles } from './fieldStyles';

type FieldProps = {
  label: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function AmountInput({ label, onChangeText, placeholder, value }: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        inputMode="decimal"
        keyboardType="decimal-pad"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8D9994"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

export function DateField({ label, onChangeText, placeholder = 'YYYY-MM-DD', value }: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        inputMode="text"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8D9994"
        style={styles.input}
        value={value}
      />
    </View>
  );
}
