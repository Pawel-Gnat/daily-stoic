# Plan Testów

## 1. Wprowadzenie i cele testowania

Celem testowania jest zapewnienie wysokiej jakości, stabilności oraz spójności aplikacji opartej na Astro 5, React 19 i TypeScript 5. Testy mają wykryć błędy funkcjonalne, regresje wizualne, problemy z wydajnością i dostępnością oraz zweryfikować poprawną integrację z Supabase.

## 2. Zakres testów

- Komponenty UI w `src/components` i `src/components/ui` (Shadcn/ui)
- Layouty w `src/layouts`
- Strony Astro w `src/pages`
- Endpoints API w `src/pages/api`
- Integracja z Supabase (`src/db`, `src/lib`)
- Logika formularzy (React Hook Form w `src/components`)
- Typy i modele w `src/types.ts`
- Custom Hooks w `src/hooks`
- Middleware w `src/middleware`

## 3. Typy testów do przeprowadzenia

1. Testy jednostkowe (Vitest + React Testing Library)
2. Testy integracyjne (MSW)
3. Testy end-to-end (Playwright)
4. Testy wydajnościowe (Lighthouse CI, Astro SSR)
5. Testy dostępności (axe-core)
6. Testy wizualne/regresji (Storybook + Chromatic)
7. Testy bezpieczeństwa (OWASP, sprawdzenie autoryzacji)

## 4. Scenariusze testowe dla kluczowych funkcjonalności

- Autoryzacja i uwierzytelnianie:
  - Rejestracja, logowanie, wylogowanie
  - Ochrona zasobów (middleware)
- Formularze interaktywne:
  - Walidacja pól (React Hook Form)
  - Wyświetlanie komunikatów o błędach i sukcesie
- CRUD wpisów:
  - Tworzenie, pobieranie, aktualizacja, usuwanie w `entries` i `entry`
  - Przypadki błędów (404, 500)
- Nawigacja i routing:
  - Przejścia między stronami, linki w layoutach
- Integracja z Supabase:
  - Zapytania do bazy, subskrypcje real-time
  - Obsługa błędów połączenia
- Responsywność i rendering:
  - Wyświetlanie na różnych rozdzielczościach
- Komponenty Shadcn/ui:
  - Zgodność z dokumentacją i spójność wyglądu

## 5. Środowisko testowe

- **Lokalne**: Node.js 18+, Astro dev server
- **CI**: GitHub Actions (test matrix: systemy operacyjne, przeglądarki)
- **Baza testowa**: dedykowana instancja Supabase lub schema testowa

## 6. Narzędzia do testowania

- Vitest + React Testing Library
- MSW (Mock Service Worker)
- Playwright dla E2E
- Lighthouse CI do monitorowania wydajności
- axe-core do testów dostępności
- Storybook + Chromatic do wizualnej regresji
- ESLint + Prettier do analizy statycznej
