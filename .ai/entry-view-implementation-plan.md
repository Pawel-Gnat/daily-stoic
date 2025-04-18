# Plan implementacji widoku szczegółów wpisu

## 1. Przegląd

Widok szczegółów wpisu umożliwia użytkownikowi przeglądanie pełnych informacji pojedynczego wpisu. Widok prezentuje wszystkie odpowiedzi użytkownika (trzy pytania), wygenerowaną stoicką sentencję oraz datę utworzenia. Użytkownik może również usunąć wpis (jeśli jest właścicielem) lub wrócić do listy wpisów.

## 2. Routing widoku

Widok szczegółów wpisu będzie dostępny pod ścieżką: `/entries/:id`.

## 3. Struktura komponentów

- **EntryDetailView** – główny komponent widoku, odpowiada za pobranie danych wpisu oraz zarządzanie stanem i integracją z API.
- **EntryDetailCard** – komponent prezentujący wszystkie szczegóły wpisu: odpowiedzi na pytania, wygenerowana sentencja, data utworzenia.
- **DeleteConfirmationModal** – modal potwierdzający usunięcie wpisu, wyświetlany po kliknięciu przycisku usunięcia.
- **BackButton** – przycisk umożliwiający powrót do listy wpisów.
- **Sonner** – komponent powiadomień importowany z `src/components/ui/sonner.tsx`, wykorzystywany do wyświetlania komunikatów o sukcesie lub błędzie.

## 4. Szczegóły komponentów

### EntryDetailView

- **Opis**: Kontener widoku szczegółów wpisu, który:
  - Pobiera dane wpisu za pomocą API (GET /entries/{id}).
  - Zarządza stanem (ładowanie, błąd, dane wpisu).
  - Umożliwia wywołanie usunięcia wpisu przez wyświetlenie `DeleteConfirmationModal`.
  - Integruje obsługę powiadomień przez Sonner.
- **Główne elementy**: Komponent `EntryDetailCard`, przycisk `BackButton`, przycisk usuwania (jeśli użytkownik jest właścicielem), `DeleteConfirmationModal`.
- **Obsługiwane interakcje**: Automatyczne pobranie szczegółów wpisu, przekierowanie po usunięciu, wyświetlenie modalu potwierdzenia.
- **Typy**: Wykorzystuje typ `EntryDto` z `types.ts`.
- **Propsy**: Zwykle nie przyjmuje zewnętrznych propsów; korzysta z parametrów routingu (ID wpisu).

### EntryDetailCard

- **Opis**: Komponent wyświetlający pełne informacje pojedynczego wpisu.
- **Główne elementy**: Wyświetlanie odpowiedzi na trzy pytania, wygenerowanej sentencji oraz daty utworzenia.
- **Obsługiwane interakcje**: Brak interakcji wewnątrz karty – prezentacja danych.
- **Warunki walidacji**: Sprawdzenie kompletności danych (obecność wszystkich pól wpisu, prawidłowy format daty).
- **Typy**: `EntryDto`.
- **Propsy**: `entry` (dane wpisu przekazywane z widoku nadrzędnego).

### DeleteConfirmationModal

- **Opis**: Modal potwierdzający operację usunięcia wpisu, aby zapobiec przypadkowemu usunięciu.
- **Główne elementy**: Komunikat z pytaniem o potwierdzenie, przyciski `Potwierdź` i `Anuluj`.
- **Obsługiwane interakcje**: Kliknięcie przycisku potwierdzenia wywołuje funkcję usunięcia, anulowanie zamyka modal.
- **Warunki walidacji**: Sprawdzenie, czy przekazany identyfikator wpisu (entryId) jest poprawny.
- **Typy**: Prosty typ z polami: `isOpen` (boolean) i `entryId` (string | null).
- **Propsy**: `isOpen`, `entryId`, `onConfirm`, `onCancel`.

### BackButton

- **Opis**: Przycisk umożliwiający powrót do listy wpisów.
- **Główne elementy**: Ikona lub tekst "Powrót".
- **Obsługiwane interakcje**: Kliknięcie przekierowuje użytkownika do widoku listy wpisów.
- **Warunki walidacji**: Brak specyficznych walidacji.
- **Typy**: Prosty komponent przyjmujący callback lub korzystający z mechanizmu routingu.
- **Propsy**: Standardowe właściwości przycisku (np. `onClick`).

### Sonner

- **Opis**: Komponent powiadomień do wyświetlania komunikatów o sukcesie lub błędzie. Importowany z `src/components/ui/sonner.tsx`.
- **Główne elementy**: Wyświetlany komunikat, responsywna stylistyka zgodna z Tailwind CSS.
- **Obsługiwane interakcje**: Automatyczne znikanie, możliwość ręcznego zamknięcia.
- **Warunki walidacji**: Brak dodatkowych walidacji.
- **Typy**: Wykorzystuje typy z `ToasterProps`.
- **Propsy**: Standardowe dla powiadomień.

## 5. Typy

Wykorzystamy istniejące typy z `types.ts`:

- `EntryDto` – reprezentuje pojedynczy wpis zawierający:
  - `id`: string
  - `what_matters_most`: string
  - `fears_of_loss`: string
  - `personal_goals`: string
  - `generated_sentence`: string
  - `generate_duration`: number
  - `created_at`: string (timestamp, ISO 8601)

Dodatkowo, możemy zdefiniować typ dla stanu widoku, np.:

```typescript
interface UseEntryDetailState {
  entry: EntryDto | null;
  loading: boolean;
  error: string | null;
}
```

## 6. Zarządzanie stanem

- Użycie hooków `useState` i `useEffect` do zarządzania stanem widoku (dane wpisu, loading, error).
- Stworzenie customowego hooka `useEntryDetail` odpowiedzialnego za:
  - Pobranie szczegółów wpisu za pomocą API (GET /entries/{id}).
  - Aktualizację stanu po usunięciu wpisu (DELETE /entries/:id).
  - Obsługę błędów i wyświetlanie komunikatów przez Sonner.

## 7. Integracja API

- **GET /entries/{id}**: Wywołanie API do pobrania szczegółów wpisu na podstawie adresu URL. Wymaga autoryzacji.
- **DELETE /entries/:id**: Wywołanie API w celu usunięcia wpisu. Po sukcesie, użytkownik zostaje przekierowany do listy wpisów, a za pomocą Sonner wyświetlany jest komunikat o powodzeniu operacji.
- Obsługa błędów:
  - Komunikaty dla statusów: 400, 401, 403, 404, 500; obsługiwane przez Sonner.

## 8. Interakcje użytkownika

- **Ładowanie widoku**: Automatyczne pobranie szczegółów wpisu przy wejściu na widok.
- **Powrót**: Kliknięcie przycisku `BackButton` przenosi użytkownika do listy wpisów.
- **Usuwanie wpisu**: Kliknięcie przycisku usunięcia wyświetla `DeleteConfirmationModal`; po potwierdzeniu, wpis jest usuwany przez API, a użytkownik otrzymuje komunikat potwierdzający.
- **Wyświetlanie komunikatów**: Komunikaty o błędach lub sukcesie wyświetlane są przez Sonner.

## 9. Warunki i walidacja

- Walidacja parametru `id` w adresie URL (np. sprawdzenie poprawności formatu UUID przy użyciu Zod).
- Sprawdzenie, czy pobrane dane wpisu zawierają wszystkie wymagane pola.
- Weryfikacja statusu autoryzacji – użytkownik musi być zalogowany, aby uzyskać dostęp do pełnych szczegółów wpisu.

## 10. Obsługa błędów

- Wyświetlanie komunikatów o błędach za pomocą Sonner przy nieprawidłowej odpowiedzi API, błędach autoryzacji lub problemach z siecią.
- Logowanie błędów do konsoli dla celów debugowania.

## 11. Kroki implementacji

1. Utworzenie nowego pliku widoku (np. `src/pages/entries/[id].astro` lub komponentu `EntryDetailView` w React).
2. Stworzenie struktury komponentów: `EntryDetailView`, `EntryDetailCard`, `DeleteConfirmationModal`, `BackButton` oraz integracja z komponentem Sonner.
3. Implementacja customowego hooka `useEntryDetail` do pobierania danych wpisu i obsługi usuwania.
4. Integracja API:
   - Konfiguracja zapytań GET dla pobierania szczegółów wpisu.
   - Implementacja funkcji usuwania wpisu przez DELETE na endpointzie `/entries/:id`.
5. Dodanie obsługi nawigacji (przycisk powrotu oraz przekierowanie po usunięciu wpisu).
6. Dodanie walidacji parametrów i stanu (sprawdzenie formatu ID, kompletności danych wpisu).
7. Stylowanie komponentów przy użyciu Tailwind CSS i integracja z Shadcn/ui.
8. Testowanie widoku pod kątem UX, responsywności i dostępności.
9. Finalne poprawki oraz cleanup kodu przed wdrożeniem.
