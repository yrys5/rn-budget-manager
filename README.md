# RN Budget Manager

Frontend aplikacji mobilnej do zarządzania budżetem. Aktualny zakres obejmuje ekran powitalny, ekrany rejestracji i logowania oraz pierwszy dashboard po zalogowaniu.

## Uruchomienie

1. Zainstaluj zależności

   ```bash
   npm install
   ```

2. Uruchom aplikację

   ```bash
   npm start
   ```

Możesz też wystartować konkretną platformę:

```bash
npm run ios
npm run android
npm run web
```

## Struktura

- `app/index.tsx` - ekran powitalny
- `app/register.tsx` - ekran rejestracji
- `app/login.tsx` - ekran logowania
- `app/(tabs)/_layout.tsx` - dolna nawigacja aplikacji po zalogowaniu
- `app/(tabs)/dashboard.tsx` - dashboard użytkownika po zalogowaniu
- `app/(tabs)/budgets.tsx` - zakładka budżetów
- `app/(tabs)/transactions.tsx` - zakładka transakcji
- `app/(tabs)/goals.tsx` - zakładka celów
- `app/(tabs)/family.tsx` - zakładka rodziny
- `app/_layout.tsx` - główny layout Expo Router
