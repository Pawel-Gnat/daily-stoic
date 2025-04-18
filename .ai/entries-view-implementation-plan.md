# Plan implementacji widoku historii wpisów

## 1. Przegląd

Widok historii wpisów umożliwia użytkownikowi przeglądanie zapisanych refleksji stoickich. Dla zalogowanych użytkowników wyświetlana jest lista wpisów posortowanych chronologicznie (najnowsze na górze) z paginacją (10 wpisów na stronę). Dla niezalogowanych użytkowników dostępne są 4 przykładowe wpisy, co pozwala zaprezentować funkcjonalność widoku bez możliwości tworzenia wpisu.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką: `/entries`.

## 3. Struktura komponentów

- **EntriesView** – główny komponent strony, odpowiedzialny za pobieranie oraz wyświetlanie listy wpisów; zarządza stanem i integracją z API.
- **EntryCard** – komponent reprezentujący pojedynczy wpis; wyświetla treść wpisu, datę utworzenia oraz przycisk usunięcia.
- **Pagination** – komponent kontroli paginacji, umożliwiający nawigację pomiędzy stronami (np. przyciski 'poprzednia', 'następna', numeracja stron).
- **DeleteConfirmationModal** – modal potwierdzający operację usuwania wpisu; pojawia się po kliknięciu w przycisk usunięcia i wymaga potwierdzenia akcji.
- **Sonner** – komponent powiadomień zaimportowany z pliku `src/components/ui/sonner.tsx`, który zastępuje dotychczasowy Toast i służy do informowania użytkownika o rezultatach działań (sukces lub błąd).

## 4. Szczegóły komponentów

### EntriesView

- **Opis**: Strona główna widoku historii wpisów, odpowiedzialna za pobranie danych z endpointu API oraz renderowanie listy wpisów.
- **Główne elementy**: Kontener na listę wpisów (`EntryCard`), komponent `Pagination`, warunek wyświetlania przykładowych wpisów dla niezalogowanych użytkowników.
- **Obsługiwane interakcje**: Inicjalne ładowanie danych, zmiana strony paginacji, inicjacja usunięcia wpisu (otwarcie `DeleteConfirmationModal`).
- **Warunki walidacji**: Sprawdzenie statusu autoryzacji; jeżeli użytkownik nie jest zalogowany, wyświetlenie 4 przykładowych wpisów pobranych z pliku JSON.
- **Typy**: Używa typów `EntryDto` oraz `EntryListResponseDto`.
- **Propsy**: Zwykle nie przyjmuje propsów – pełni rolę kontenera dla logiki widoku.

### EntryCard

- **Opis**: Komponent prezentujący pojedynczy wpis. Wyświetla dane takie jak: odpowiedzi na pytania, wygenerowaną sentencję oraz datę utworzenia.
- **Główne elementy**: Elementy tekstowe do prezentacji danych, przycisk usunięcia wpisu.
- **Obsługiwane interakcje**: Kliknięcie przycisku `Usuń`, które wywołuje callback otwierający modal potwierdzający usunięcie.
- **Warunki walidacji**: Walidacja wyświetlanych danych (np. poprawny format daty).
- **Typy**: `EntryDto`.
- **Propsy**: `entry` (dane wpisu), `onDelete` (funkcja callback przy inicjacji usunięcia).

### Pagination

- **Opis**: Komponent umożliwiający nawigację pomiędzy stronami listy wpisów.
- **Główne elementy**: Przyciski zmiany strony, wyświetlanie aktualnego numeru strony, informacje o liczbie stron.
- **Obsługiwane interakcje**: Kliknięcia przycisków, które wywołują pobranie odpowiedniej strony wpisów.
- **Warunki walidacji**: Ograniczenie zakresu stron, walidacja przekazywanych parametrów (np. liczba stron musi być dodatnia).
- **Typy**: Typ `PaginationMetadata`.
- **Propsy**: `currentPage`, `totalPages`, `onPageChange` (callback zmiany strony).

### DeleteConfirmationModal

- **Opis**: Modal służący do potwierdzenia operacji usunięcia wpisu. Zapobiega przypadkowemu usunięciu.
- **Główne elementy**: Komunikat potwierdzający, przyciski `Potwierdź` oraz `Anuluj`.
- **Obsługiwane interakcje**: Kliknięcie przycisków, które wywołują odpowiednio akcję usunięcia lub zamknięcia modalu.
- **Warunki walidacji**: Upewnienie się, że modal otrzymał poprawny identyfikator wpisu do usunięcia.
- **Typy**: Prosty typ z `isOpen` (boolean) i `entryId` (string | null).
- **Propsy**: `isOpen`, `entryId`, `onConfirm`, `onCancel`.

### Sonner

- **Opis**: Komponent powiadomień stosowany do informowania użytkownika o rezultacie działań, zastępujący dotychczasowy Toast. Importowany z `src/components/ui/sonner.tsx`.
- **Główne elementy**: Wyświetlany komunikat oraz dostosowana stylistyka przy użyciu Tailwind CSS i konfiguracji motywu.
- **Obsługiwane interakcje**: Automatyczne znikanie po określonym czasie, możliwość ręcznego zamknięcia.
- **Warunki walidacji**: Brak specyficznych warunków – wyświetlanie komunikatów zgodnie z przekazanym typem (np. sukces, błąd).
- **Typy**: Wykorzystuje typy z `ToasterProps`.
- **Propsy**: Przechwytuje standardowe propsy powiadomień.

## 5. Typy

Wykorzystamy istniejące typy z `types.ts`:

- `EntryDto` – reprezentujący pojedynczy wpis.
- `EntryListResponseDto` – struktura odpowiedzi z listą wpisów i metadanymi paginacji.
- `PaginationMetadata` – metadane dotyczące paginacji.

Dodatkowo, możemy wprowadzić typy specyficzne dla widoku np.:

```typescript
interface UseEntriesState {
  entries: EntryDto[];
  pagination: PaginationMetadata;
  loading: boolean;
  error: string | null;
}
```

## 6. Zarządzanie stanem

- Użycie hooków `useState` i `useEffect` do zarządzania stanem widoku (lista wpisów, aktualna strona, loading, error).
- Stworzenie customowego hooka `useEntries` odpowiedzialnego za:
  - Pobieranie wpisów z API (GET /entries) na podstawie aktualnej strony.
  - Aktualizację stanu po usunięciu wpisu poprzez wywołanie endpointu DELETE /entries/:id.
  - Obsługę błędów i wyświetlanie komunikatów za pomocą Sonnera.

## 7. Integracja API

- **GET /entries**: Wywołanie API do pobrania wpisów z aktualnymi parametrami paginacji (domyślnie `page=1`, `limit=10`, `sort=created_at:desc`).
- **DELETE /entries/:id**: Wywołanie API w celu usunięcia wpisu. W przypadku sukcesu, stan jest aktualizowany w hooku `useEntries` i wyświetlany jest komunikat sukcesu za pomocą Sonnera.
- Obsługa błędów:
  - Statusy 400, 401, 403, 404 oraz 500; odpowiednio wyświetlane komunikaty przez Sonnera.

## 8. Interakcje użytkownika

- **Ładowanie widoku**: Automatyczne pobranie wpisów przy wejściu na stronę.
- **Zmiana strony**: Kliknięcie elementów paginacji powoduje aktualizację stanu oraz pobranie odpowiedniej strony wpisów.
- **Usuwanie wpisu**: Kliknięcie przycisku `Usuń` na karcie wpisu otwiera `DeleteConfirmationModal`;
  - Po potwierdzeniu: wywołanie API DELETE na endpointzie `/entries/:id`, aktualizacja stanu i wyświetlenie komunikatu sukcesu za pomocą Sonnera.
- **Dla niezalogowanych**: Wyświetlenie 4 przykładowych wpisów pobranych z pliku JSON.

## 9. Przykładowe wpisy (dla niezalogowanych użytkowników)

- Przykładowe dane wpisów będą przechowywane w pliku JSON (np. `src/data/sample-entries.json`). Plik ten zawiera przykładowe treści, które zostaną wyświetlone użytkownikom niezalogowanym, aby zobaczyć działanie widoku.

## 10. Warunki i walidacja

- Walidacja parametrów wejściowych podczas pobierania wpisów (numer strony, limit).
- Weryfikacja statusu autoryzacji – w przypadku braku tokenu, widok powinien wyświetlać przykładowe wpisy z pliku JSON.
- Sprawdzenie poprawności odpowiedzi z API (poprawny format daty, obecność wszystkich wymaganych pól wpisu).

## 11. Obsługa błędów

- Wyświetlanie komunikatów za pomocą Sonnera przy błędach pobierania lub usuwania wpisu.
- Logowanie błędów do konsoli w celach debugowania.
- Obsługa specyficznych kodów błędów: 401 (Brak autoryzacji), 403 (Brak uprawnień), 404 (Wpis nie znaleziony) oraz 500 (Błąd serwera).

## 12. Kroki implementacji

1. Utworzenie nowego pliku widoku (np. `src/pages/entries.astro` lub stworzenie komponentu `EntriesView` w React).
2. Stworzenie struktury komponentów: `EntriesView`, `EntryCard`, `Pagination`, `DeleteConfirmationModal` oraz integracja z komponentem Sonner.
3. Implementacja customowego hooka `useEntries` do zarządzania stanem widoku i wywoływania API.
4. Integracja API:
   - Konfiguracja zapytań GET dla pobierania listy wpisów.
   - Implementacja funkcji usuwania wpisu przez DELETE na endpointzie `/entries/:id`.
5. Dodanie logiki warunkowej wyświetlania przykładowych wpisów dla niezalogowanych użytkowników (pobieranie danych z `src/data/sample-entries.json`).
6. Dodanie walidacji wejścia oraz obsługi błędów w każdym komponencie.
7. Stylowanie komponentów przy użyciu Tailwind CSS i integracja komponentów Shadcn/ui.
8. Testowanie widoku pod kątem UX, responsywności i dostępności.
9. Finalne poprawki oraz cleanup kodu przed wdrożeniem.
