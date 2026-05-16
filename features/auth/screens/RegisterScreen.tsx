import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
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
import { validateRegister, type RegisterErrors } from '../model/validation';

export default function RegisterScreen() {
  const { error: apiError, isLoading, register } = useAuthActions();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;

    return score;
  }, [password]);

  const validateForm = () => {
    const nextErrors = validateRegister({ acceptedTerms, email, password, username });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    setIsSubmitted(false);

    if (validateForm()) {
      const session = await register({
        acceptTerms: acceptedTerms,
        email: email.trim(),
        password,
        username: username.trim(),
      });

      if (session) {
        setIsSubmitted(true);
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
            <Text style={styles.title}>Utwórz konto</Text>
            <Text style={styles.subtitle}>
              Zacznij porządkować swoje finanse w jednym, spokojnym miejscu.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputWrap, errors.username ? styles.inputError : null]}>
                <Ionicons name="person-outline" size={20} color="#66736E" />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setUsername}
                  placeholder="np. kasia_nowak"
                  placeholderTextColor="#8D9994"
                  returnKeyType="next"
                  style={styles.input}
                  value={username}
                />
              </View>
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            </View>

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
                  placeholder="Minimum 8 znaków"
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
              <View style={styles.strengthTrack}>
                {[0, 1, 2].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthSegment,
                      passwordStrength > level ? styles.strengthSegmentActive : null,
                    ]}
                  />
                ))}
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acceptedTerms }}
              onPress={() => setAcceptedTerms((value) => !value)}
              style={styles.termsRow}>
              <View style={[styles.checkbox, acceptedTerms ? styles.checkboxChecked : null]}>
                {acceptedTerms ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
              </View>
              <Text style={styles.termsText}>
                Akceptuję regulamin oraz zasady przetwarzania danych.
              </Text>
            </Pressable>
            {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

            {isSubmitted ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={20} color="#157348" />
                <Text style={styles.successText}>Konto zostało utworzone przez warstwę API.</Text>
              </View>
            ) : null}

            {apiError ? (
              <View style={styles.successBox}>
                <Ionicons name="warning-outline" size={20} color="#B73E3E" />
                <Text style={styles.successText}>{apiError}</Text>
              </View>
            ) : null}

            <Pressable
              disabled={isLoading}
              onPress={handleCreateAccount}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Tworzenie konta...' : 'Zarejestruj się'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Masz już konto?</Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text style={styles.footerLink}>Zaloguj się</Text>
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
  strengthTrack: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  strengthSegment: {
    backgroundColor: '#DBE4DF',
    borderRadius: 999,
    flex: 1,
    height: 5,
  },
  strengthSegmentActive: {
    backgroundColor: '#1D8E62',
  },
  termsRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
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
  termsText: {
    color: '#40534B',
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
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
