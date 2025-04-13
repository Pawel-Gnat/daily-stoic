# Plan implementacji widoku Strona Główna

## 1. Przegląd

Widok "Strona Główna" umożliwia codzienną refleksję użytkownika, prezentując formularz do uzupełnienia trzech pytań (każde z limitem 500 znaków) w przypadku braku wpisu z danego dnia oraz wyświetlając już zapisany wpis z wygenerowaną sentencją stoicką, jeśli taki wpis istnieje. Widok integruje logikę walidacji formularza, wywołanie API do tworzenia wpisu oraz obsługę komunikatów (toast) w przypadku błędów.

## 2. Routing widoku

Widok jest dostępny pod ścieżką `/`.

## 3. Struktura komponentów

- **IndexPageView** – główny komponent widoku, zarządzający logiką decydującą o wyświetleniu formularza lub gotowego wpisu.
  - **ReflectionForm** – formularz do wprowadzania odpowiedzi na trzy pytania.
  - **DailyEntryDisplay** – komponent wyświetlający szczegóły wpisu (odpowiedzi i wygenerowaną sentencję).
  - **Spinner** – komponent informujący o trwającej operacji (np. generacja sentencji).
  - **Toast** – komponent do wyświetlania powiadomień o błędach oraz sukcesie.

## 4. Szczegóły komponentów

### 4.1. IndexPageView

- **Opis**: Kontener, który decyduje, czy wyświetlić formularz czy istniejący wpis. Zarządza stanem ładowania i integracją z komunikatami toast.
- **Główne elementy**: Warunkowe renderowanie komponentu `ReflectionForm` lub `DailyEntryDisplay` w zależności od stanu wpisu.
- **Obsługiwane interakcje**: Aktualizacja stanu po wysłaniu formularza i otrzymaniu odpowiedzi z backendu.
- **Typy**: Wykorzystuje typ `EntryDto` dla danych wpisu.
- **Propsy**: Brak – zarządza własnym stanem.

### 4.2. ReflectionForm

- **Opis**: Formularz umożliwiający wprowadzenie trzech pól tekstowych: "Co jest dla mnie najważniejsze", "Czego boję się stracić", "Co chcę osiągnąć".
- **Główne elementy**: Trzy pola `Textarea` z licznikiem znaków (0/500), przycisk submit, inline walidacja z komunikatami błędów.
- **Obsługiwane interakcje**:
  - `onChange` – aktualizacja wartości pól
  - `onBlur` – indywidualna walidacja pola
  - `onSubmit` – wysłanie danych do API
- **Warunki walidacji**:
  - Każde pole musi być wypełnione i nie przekraczać 500 znaków.
- **Typy**:
  - `CreateEntryDto`: { what_matters_most: string, fears_of_loss: string, personal_goals: string }
- **Propsy**:
  - Callback `onEntryCreated(entry: EntryDto)` wywoływany po pomyślnym stworzeniu wpisu.

### 4.3. DailyEntryDisplay

- **Opis**: Komponent prezentujący szczegóły wpisu, w tym odpowiedzi użytkownika, wygenerowaną sentencję oraz datę utworzenia.
- **Główne elementy**: Karta (Card) prezentująca pola: data utworzenia, odpowiedzi na pytania i  sentencję.
- **Obsługiwane interakcje**: Opcjonalne odświeżenie widoku (np. przycisk ponownego załadowania danych).
- **Typy**:
  - `EntryDto`
- **Propsy**:
  - `entry: EntryDto`

### 4.4. Spinner i Toast

- **Opis**:
  - `Spinner` – wizualny sygnalizator operacji w toku (np. wysyłania zapytania do API).
  - `Toast` – komponent do prezentacji tymczasowych komunikatów o błędach lub sukcesie.
- **Obsługiwane interakcje**: Automatyczne wyświetlanie na podstawie stanu (loading/error).

## 5. Typy

- **CreateEntryDto**:

  ```typescript
  {
  	what_matters_most: string // max 500 znaków
  	fears_of_loss: string // max 500 znaków
  	personal_goals: string // max 500 znaków
  }
  ```

- **EntryDto**:

  ```typescript
  {
  	id: string
  	what_matters_most: string
  	fears_of_loss: string
  	personal_goals: string
  	generated_sentence: string
  	generate_duration: number
  	created_at: string // ISO 8601
  }
  ```

- **ViewModel dla formularza**:
  ```typescript
  {
    values: CreateEntryDto;
    errors: {
      what_matters_most?: string;
      fears_of_loss?: string;
      personal_goals?: string;
    };
    isSubmitting: boolean;
  }
  ```

## 6. Zarządzanie stanem

- Wykorzystanie hooków `useState` oraz `useEffect` do zarządzania stanem formularza, stanem ładowania oraz przechowywaniem danych wpisu (`EntryDto`).
- Opcjonalne stworzenie customowego hooka `useDailyEntry`, który łączy logikę wysyłania zapytań do API i zarządzania stanem (loading, error, success).

## 7. Integracja API

- **Endpoint**: POST `/entries`
- **Żądanie**: Wysyłane z danymi typu `CreateEntryDto`.
- **Odpowiedź**: Dane typu `EntryDto`, zawierające m.in. wygenerowaną sentencję stoicką i czas generacji.
- **Sposób wywołania**:
  - Funkcja wywołująca API (np. `createEntry(values)`) używa `fetch` do wysłania żądania POST.
  - Nagłówki muszą zawierać token autoryzacji.
- **Obsługa odpowiedzi**: Aktualizacja stanu widoku lub wyświetlenie komunikatu o błędzie przy niepowodzeniu.

## 8. Interakcje użytkownika

- Na wejściu użytkownik trafia na stronę `/`.
  - Jeżeli wpis nie został jeszcze wykonany, wyświetlany jest formularz `ReflectionForm`.
  - Po wypełnieniu formularza i kliknięciu przycisku "Prześlij", pojawia się `Spinner` wskazujący na trwające przetwarzanie.
  - Po pomyślnym utworzeniu wpisu widok przełącza się na `DailyEntryDisplay`, prezentując wygenerowaną sentencję i inne szczegóły wpisu.
  - W przypadku błędów (walidacja lub API), użytkownik otrzymuje odpowiednie komunikaty (inline lub poprzez `Toast`).

## 9. Warunki i walidacja

- Każde pole formularza musi być wypełnione i zawierać maksymalnie 500 znaków.
- Walidacja odbywa się w czasie rzeczywistym (onChange/onBlur) oraz przed wysłaniem formularza.
- Token autoryzacyjny musi być obecny przy wywołaniu API, w przeciwnym wypadku zostanie zgłoszony błąd autoryzacji.

## 10. Obsługa błędów

- **Błędy walidacji**: Inline komunikaty przy przekroczeniu limitu znaków lub pozostawieniu pustego pola.
- **Błędy API**:
  - 400: Błędy walidacji – wyświetlenie komunikatu typu toast.
  - 401: Błąd autoryzacji – informacja o konieczności logowania.
  - 429: Zbyt wiele prób – wyświetlenie komunikatu o przekroczeniu limitu żądań.
  - 500: Błąd serwera – ogólny komunikat o nieoczekiwanym problemie.
- W przypadku błędów sieciowych lub innych nieprzewidzianych sytuacji, użytkownik otrzymuje możliwość ponowienia próby.

## 11. Kroki implementacji

1. Utworzyć komponent `IndexPageView.tsx`, który będzie decydować, czy renderować `ReflectionForm` czy `DailyEntryDisplay` na podstawie stanu wpisu.
2. Utworzyć komponent `ReflectionForm.tsx`:
   - Zaimplementować trzy pola tekstowe z licznikiem znaków (0/500) i inline walidacją.
   - Dodać przycisk submit oraz obsługę zdarzenia `onSubmit` wysyłającego dane do API.
3. Utworzyć komponent `DailyEntryDisplay.tsx`:
   - Wyświetlić szczegóły wpisu, takie jak odpowiedzi, wygenerowana sentencja, data utworzenia i czas generacji.
4. Zaimplementować komponent `Spinner` i zintegrować go z logiką ładowania podczas wywołania API.
5. Zaimplementować system toastów do wyświetlania komunikatów o błędach i sukcesie.
6. Stworzyć customowy hook `useDailyEntry` do zarządzania stanem formularza oraz integracji z API (funkcja `createEntry`).
7. Zintegrować wywołanie endpointu POST `/entries`:
   - Upewnić się, że wysyłane dane są zgodne z typem `CreateEntryDto`.
   - Ustawić poprawnie nagłówki (w tym token autoryzacyjny).
8. Przetestować działanie widoku pod kątem walidacji, obsługi błędów i poprawności integracji z backendem.
9. Dokonać przeglądu kodu i wprowadzić niezbędne poprawki.
10. Potwierdzić zgodność implementacji z PRD, wymaganiami User Stories (US-002, US-003) oraz dokumentacją endpointu.
