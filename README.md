# RN Budget Manager

Frontend aplikacji mobilnej do zarządzania budżetem. Aktualny zakres obejmuje ekran powitalny oraz ekrany rejestracji i logowania użytkownika.

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
- `app/_layout.tsx` - główny layout Expo Router
