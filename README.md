# RN Budget Manager

Frontend aplikacji mobilnej do zarządzania budżetem. Projekt jest przygotowany w architekturze
feature-based i gotowy do podłączenia autorskiego backendu. Do czasu integracji backendu aplikacja
korzysta z mock adaptera o tym samym kontrakcie API, dzięki czemu UI nie importuje bezpośrednio
danych demo.

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

## Testy

```bash
npm run lint
npm run test
npm run test:watch
npm run test:ui
```

## Struktura

- `app/*` - cienkie wrappery Expo Router
- `features/auth` - rejestracja, logowanie, walidacje i adapter auth API
- `features/dashboard` - dashboard, kalkulacje finansowe i pobieranie podsumowania
- `features/budgets` - budżety, kategorie, limity, walidacje i API feature'a
- `features/transactions` - transakcje, formularz, lista, walidacje i API feature'a
- `features/goals` - cele oszczędnościowe, formularz, lista, walidacje i API feature'a
- `features/family` - rodziny, członkowie, budżety rodzinne i API feature'a
- `shared/api` - centralny klient HTTP, kontrakt endpointów i mock backend
- `shared/model` - wspólne typy domenowe oraz hook ładowania zasobów
- `shared/ui` - ujednolicone komponenty stanu, przycisków, pól formularzy i dialogów
- `shared/testing` - dane demo używane wyłącznie przez mock backend i testy
