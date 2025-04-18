# Architektura UI dla DailyStoic

## 1. Przegląd struktury UI

Architektura UI dla aplikacji DailyStoic składa się z czterech głównych widoków: logowanie/rejestracja, strona główna, historia wpisów i szczegóły wpisu. Aplikacja wykorzystuje styl inspirowany starożytną Grecją, ze szczególnym uwzględnieniem typografii i kolorystyki. Nawigacja jest zrealizowana przez navbar, który zapewnia dostęp do głównych sekcji aplikacji. Interfejs jest w pełni responsywny, z wykorzystaniem breakpointów Tailwind, i obsługuje zarówno widoki mobilne, jak i desktopowe.

Aplikacja wykorzystuje dynamiczny główny widok, który zmienia się w zależności od tego, czy użytkownik dokonał już wpisu danego dnia. System komunikacji z użytkownikiem jest dwuwarstwowy: błędy walidacji formularza są wyświetlane inline, a błędy API i potwierdzenia operacji przez system toastów.

## 2. Lista widoków

### Widok logowania/rejestracji

- **Ścieżka**: `/login`, `/register`
- **Główny cel**: Umożliwienie użytkownikom zalogowania się lub utworzenia nowego konta
- **Kluczowe informacje**:
  - Formularz logowania (email, hasło)
  - Formularz rejestracji (email, hasło)
  - Informacje o błędach logowania/rejestracji
- **Kluczowe komponenty**:
  - Card (karta logowania/rejestracji)
  - Form (formularz z walidacją)
  - Input (pola email i hasło)
  - Button (przyciski logowania/rejestracji)
  - Toggle (przełącznik między formularzami)
- **UX, dostępność i bezpieczeństwo**:
  - Jasne komunikaty błędów
  - Możliwość przełączania między formularzami logowania i rejestracji
  - Bezpieczne przechowywanie danych autoryzacyjnych
  - Odpowiedni kontrast i rozmiar tekstu dla dostępności

### Strona główna

- **Ścieżka**: `/`
- **Główny cel**: Umożliwienie użytkownikom codziennej refleksji lub wyświetlenie dzisiejszej refleksji
- **Kluczowe informacje**:
  - Formularz z trzema pytaniami (jeśli brak wpisu z dzisiaj)
  - Wyświetlenie odpowiedzi i wygenerowanej sentencji (jeśli wpis istnieje)
- **Kluczowe komponenty**:
  - Form (formularz refleksji)
  - Textarea (pola odpowiedzi z licznikami znaków)
  - Button (przycisk przesłania formularza)
  - Spinner (podczas generowania sentencji)
  - Card (do wyświetlania wpisu)
- **UX, dostępność i bezpieczeństwo**:
  - Liczniki znaków (0/500) dla każdego pola
  - Inline walidacja formularza
  - Wyraźny spinner podczas generowania
  - Wizualne wyróżnienie wygenerowanej sentencji
  - Responsywny layout dostosowany do wszystkich urządzeń

### Widok historii wpisów

- **Ścieżka**: `/entries`
- **Główny cel**: Umożliwienie przeglądania i zarządzania wcześniejszymi wpisami lub wyświetlenie przykładowych wpisów dla niezalogowanego użytkownika
- **Kluczowe informacje**:
  - Lista wpisów posortowanych chronologicznie (najnowsze na górze)
  - Paginacja (10 wpisów na stronę)
  - 4 przykładowe wpisy dla niezalogowanego użytkownika
- **Kluczowe komponenty**:
  - Card (karty wpisów)
  - Button (przyciski usuwania)
  - Pagination (kontrolki paginacji)
  - Modal (potwierdzenie usunięcia)
  - Toast (potwierdzenie operacji)
- **UX, dostępność i bezpieczeństwo**:
  - Wyraźne karty wpisów z datą utworzenia
  - Jasne kontrolki paginacji
  - Modal potwierdzający przed trwałym usunięciem
  - Toast informujący o pomyślnym usunięciu

### Widok szczegółów wpisu

- **Ścieżka**: `/entries/:id`
- **Główny cel**: Prezentacja pełnych szczegółów pojedynczego wpisu
- **Kluczowe informacje**:
  - Data utworzenia wpisu
  - Pełne odpowiedzi na wszystkie trzy pytania
  - Wygenerowana sentencja stoicka
- **Kluczowe komponenty**:
  - Card (karta szczegółów wpisu)
  - Button (przyciski powrotu i usunięcia)
  - Modal (potwierdzenie usunięcia)
- **UX, dostępność i bezpieczeństwo**:
  - Wyraźne rozróżnienie między odpowiedziami a sentencją
  - Łatwy powrót do historii wpisów
  - Zabezpieczenie przed przypadkowym usunięciem

## 3. Mapa podróży użytkownika

### Tworzenie dziennego wpisu

1. Użytkownik loguje się do aplikacji
2. System przekierowuje na stronę główną
3. System sprawdza czy istnieje wpis z dzisiejszego dnia:
   - Jeśli nie, wyświetla formularz
   - Jeśli tak, wyświetla dzisiejszy wpis
4. Użytkownik wypełnia formularz (3 pytania)
5. System waliduje wprowadzone dane (inline)
6. Użytkownik przesyła formularz
7. System wyświetla spinner podczas generowania sentencji
8. Po zakończeniu generacji, system zapisuje wpis i odświeża stronę
9. System wyświetla utworzony wpis z wygenerowaną sentencją

### Przeglądanie historii wpisów

1. Użytkownik klika w "Historia" w navbarze
2. System wyświetla stronę historii wpisów, jeśli użytkownik jest zalogowany
   to pokazuje historie wpisów użytkownika, jeśli nie jest zalogowany to pokazuje przykładowe wpisy
3. Użytkownik przegląda listę wpisów
4. Użytkownik może:
   - Przejść do szczegółów wpisu klikając na wpis
   - Usunąć wpis klikając przycisk usuwania (tylko dla zalogowanego użytkownika, w zakresie własnych wpisów)
   - Przejść do kolejnej/poprzedniej strony wpisów

### Usuwanie wpisu

1. Użytkownik klika przycisk usunięcia wpisu
2. System wyświetla modal potwierdzenia
3. Użytkownik potwierdza usunięcie
4. System usuwa wpis i wyświetla toast potwierdzający
5. System odświeża listę wpisów

### Przeglądanie szczegółów wpisu

1. Użytkownik klika na wpis na liście historii
2. System wyświetla widok szczegółów wpisu
3. Użytkownik przegląda pełne szczegóły wpisu
4. Użytkownik może:
   - Wrócić do listy wpisów
   - Usunąć wpis

## 4. Układ i struktura nawigacji

### Główna nawigacja (Navbar)

- Logo/nazwa aplikacji (link do strony głównej)
- Link "Strona główna" - prowadzi do strony głównej z formularzem/dzisiejszym wpisem
- Link "Historia" - prowadzi do strony z historią wpisów (dla zalogowanego uzytkownika) lub przykładowych wpisów (dla niezalogowanego uzytkownika)
- Przycisk wylogowania - wylogowuje użytkownika i przekierowuje do strony logowania

### Nawigacja kontekstowa

- Na stronie historii wpisów: kontrolki paginacji (poprzednia/następna strona)
- Na stronie szczegółów wpisu: przycisk powrotu do historii wpisów
- W modalu potwierdzenia usunięcia: przyciski "Anuluj" i "Usuń"

## 5. Kluczowe komponenty

### 1. Navbar

Główny element nawigacyjny, zapewniający dostęp do wszystkich sekcji aplikacji. Zawiera logo, linki nawigacyjne i przycisk wylogowania.

### 2. Formularz refleksji

Interaktywny formularz na stronie głównej, składający się z trzech pól tekstowych z licznikami znaków, walidacją inline i przyciskiem przesłania.

### 3. Karta wpisu

Komponent do wyświetlania pojedynczego wpisu, zarówno w historii, jak i na stronie głównej. Zawiera datę, odpowiedzi użytkownika i wyróżnioną wizualnie sentencję.

### 4. System paginacji

Komponent do nawigacji po wielu stronach wpisów w historii, zgodny ze specyfikacją API (10 wpisów na stronę).

### 5. Modal potwierdzenia

Komponent wyświetlany przed wykonaniem operacji, które nie mogą być cofnięte (np. usunięcie wpisu).

### 6. System toastów

Komponent do wyświetlania krótkich komunikatów o sukcesie lub błędzie operacji, pojawiający się w prawym górnym rogu ekranu.

### 7. Spinner

Komponent wyświetlany podczas trwających operacji, szczególnie podczas generowania sentencji przez AI.

### 8. Licznik znaków

Komponent wyświetlający liczbę wprowadzonych/pozostałych znaków w polach tekstowych formularza refleksji.
