import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthActions } from '../hooks/useAuthActions';
import { validateLogin, type LoginErrors } from '../model/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { error: apiError, isLoading, login } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const nextErrors = validateLogin({ email, password });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    setIsSubmitted(false);

    if (validateForm()) {
      const session = await login(email.trim(), password);

      if (session) {
        setIsSubmitted(true);
        router.replace('/dashboard');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.brandMark}>
              <Ionicons name="wallet-outline" size={30} color="#0E2A21" />
            </View>
            <Text style={styles.eyebrow}>Budget Manager</Text>
            <Text style={styles.title}>Witaj ponownie</Text>
            <Text style={styles.subtitle}>
              Zaloguj się, żeby wrócić do swojego budżetu i ostatnich planów.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrap, errors.email ? styles.inputError : null]}>
                <Ionicons name="mail-outline" size={20} color="#66736E" />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  inputMode="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="twoj@email.com"
                  placeholderTextColor="#8D9994"
                  returnKeyType="next"
                  style={styles.input}
                  value={email}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Hasło</Text>
              <View style={[styles.inputWrap, errors.password ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color="#66736E" />
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setPassword}
                  placeholder="Wpisz hasło"
                  placeholderTextColor="#8D9994"
                  returnKeyType="done"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                />
                <Pressable
                  accessibilityLabel={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                  hitSlop={10}
                  onPress={() => setShowPassword((value) => !value)}
                  style={styles.iconButton}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color="#42534C"
                  />
                </Pressable>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <View style={styles.optionsRow}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                onPress={() => setRememberMe((value) => !value)}
                style={styles.rememberRow}>
                <View style={[styles.checkbox, rememberMe ? styles.checkboxChecked : null]}>
                  {rememberMe ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
                </View>
                <Text style={styles.optionText}>Zapamiętaj mnie</Text>
              </Pressable>

              <Pressable>
                <Text style={styles.optionLink}>Nie pamiętam hasła</Text>
              </Pressable>
            </View>

            {isSubmitted ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={20} color="#157348" />
                <Text style={styles.successText}>Sesja została utworzona przez warstwę API.</Text>
              </View>
            ) : null}

            {apiError ? (
              <View style={styles.successBox}>
                <Ionicons name="warning-outline" size={20} color="#B73E3E" />
                <Text style={styles.successText}>{apiError}</Text>
              </View>
            ) : null}

            <Pressable disabled={isLoading} onPress={handleLogin} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{isLoading ? 'Logowanie...' : 'Zaloguj się'}</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Nie masz konta?</Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text style={styles.footerLink}>Zarejestruj się</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 30,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: '#D9F2E4',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    marginBottom: 18,
    width: 56,
  },
  eyebrow: {
    color: '#527469',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#10251F',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 40,
  },
  subtitle: {
    color: '#5D6B66',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
    maxWidth: 360,
  },
  form: {
    gap: 18,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: '#243A33',
    fontSize: 14,
    fontWeight: '700',
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DAE5DF',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 15,
    shadowColor: '#244035',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
  inputError: {
    borderColor: '#C64747',
  },
  input: {
    color: '#142720',
    flex: 1,
    fontSize: 16,
    minHeight: 54,
  },
  iconButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  errorText: {
    color: '#B73E3E',
    fontSize: 13,
    lineHeight: 18,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  rememberRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#A9B8B1',
    borderRadius: 6,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxChecked: {
    backgroundColor: '#157348',
    borderColor: '#157348',
  },
  optionText: {
    color: '#40534B',
    fontSize: 14,
    lineHeight: 21,
  },
  optionLink: {
    color: '#157348',
    fontSize: 14,
    fontWeight: '800',
  },
  successBox: {
    alignItems: 'center',
    backgroundColor: '#E6F6EE',
    borderColor: '#BFE5CF',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  successText: {
    color: '#155E3D',
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
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
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  footerText: {
    color: '#66736E',
    fontSize: 14,
  },
  footerLink: {
    color: '#157348',
    fontSize: 14,
    fontWeight: '800',
  },
});
