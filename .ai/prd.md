# Dokument wymagań produktu (PRD) - DailyStoic

## 1. Przegląd produktu

DailyStoic to aplikacja webowa umożliwiająca codzienne refleksje oparte na filozofii stoickiej. Użytkownicy wypełniają formularz składający się z trzech pytań (każde z limitem 500 znaków), po czym aplikacja generuje spersonalizowaną sentencję stoicką przy użyciu AI. Wpisy są zapisywane, a użytkownik może je przeglądać i usuwać. Autoryzacja odbywa się za pomocą Supabase. Interfejs utrzymany jest w stylistyce starożytnej Grecji (typografia, paleta barw i layout) oraz zawiera mechanizm toast do komunikacji błędów.

## 2. Problem użytkownika

Użytkownicy często potrzebują codziennej inspiracji, aby utrzymać pozytywne nastawienie i rozwijać wiarę w siebie. Tradycyjne metody samorefleksji bywają niewystarczające. DailyStoic ma rozwiązać problem braku szybkiej i spersonalizowanej inspiracji poprzez generowanie stoickich sentencji na podstawie odpowiedzi udzielonych na trzy kluczowe pytania:

1. Co jest dla mnie najważniejsze?
2. Czego boję się stracić?
3. Co chcę osiągnąć?

## 3. Wymagania funkcjonalne

1. Formularz codziennego wpisu, w którym użytkownik odpowiada na trzy pytania – każde pytanie ma limit 500 znaków.
2. System, który wywołuje generację stoickiej sentencji przez AI uruchamia się dopiero po udzieleniu odpowiedzi na wszystkie pytania i przesłaniu formularza.
3. Zapisywanie wpisów obejmujących treść odpowiedzi, wygenerowaną sentencję oraz datę w bazie danych.
4. Możliwość odczytywania (przeglądania) zapisanych wpisów poprzez stronę profilu użytkownika.
5. Możliwość usuwania wpisów – operacja usuwania potwierdzana przez użytkownika.
6. Autoryzacja kont użytkowników za pomocą Supabase.
7. Responsywność interfejsu – aplikacja musi działać zarówno na wersji mobilnej, jak i webowej.
8. Wyświetlanie toastów przy wystąpieniu błędów (np. przekroczenie limitu znaków, tokenów LLM lub opóźnienia w odpowiedzi).
9. Monitorowanie oddzielne: całkowity czas odpowiedzi backendu oraz czasu odpowiedzi LLM.
10. Monitorowanie dziennej liczby logowań jako kluczowej metryki aktywności użytkowników.

## 4. Granice produktu

1. Nie obejmuje zarządzania kontem użytkownika (poza podstawową autoryzacją i logowaniem).
2. Nie obejmuje współdzielenia sentencji ani udostępniania spersonalizowanych odpowiedzi w social media.
3. Nie obejmuje edycji już zapisanych wpisów – użytkownik może jedynie tworzyć, odczytywać i usuwać wpisy.
4. Na etapie MVP nie przewiduje się zbierania szczegółowego feedbacku o jakości generowanych sentencji.

## 5. Historyjki użytkowników

### US-001: Rejestracja i logowanie

- Tytuł: Rejestracja i logowanie użytkownika
- Opis: Jako nowy użytkownik chcę móc zarejestrować się i zalogować do aplikacji, aby uzyskać dostęp do funkcjonalności DailyStoic.
- Kryteria akceptacji:
  - Użytkownik może założyć konto za pomocą Supabase.
  - Użytkownik po rejestracji może zalogować się i uzyskać dostęp do swojego profilu.
  - Proces logowania jest bezpieczny.

### US-002: Wypełnienie formularza i przesłanie odpowiedzi

- Tytuł: Wypełnienie formularza refleksji
- Opis: Jako użytkownik chcę wypełnić formularz składający się z trzech pytań (każde z limitem 500 znaków) i przesłać swoje odpowiedzi, aby otrzymać stoicką sentencję.
- Kryteria akceptacji:
  - Formularz zawiera trzy pola tekstowe, z limitem 500 znaków na każde.
  - Przesłanie formularza następuje dopiero po udzieleniu odpowiedzi na wszystkie pytania.
  - W przypadku przekroczenia limitu znaków użytkownik otrzymuje odpowiedni komunikat (toast).

### US-003: Generacja stoickiej sentencji przez AI

- Tytuł: Generacja sentencji po przesłaniu formularza
- Opis: Jako użytkownik chcę, aby system generował spersonalizowaną stoicką sentencję na podstawie moich odpowiedzi, gdy przesyłam formularz.
- Kryteria akceptacji:
  - AI przetwarza dane wejściowe i generuje sentencję po otrzymaniu pełnych odpowiedzi.
  - Sentencja zawiera bezpośrednie odniesienia do udzielonych odpowiedzi.
  - Cały proces od przesłania formularza do wyświetlenia sentencji trwa nie dłużej niż 10 sekund (monitorowanie oddzielne dla backendu i LLM).

### US-004: Zapis i przeglądanie wpisów

- Tytuł: Zapis i wyświetlanie wpisów
- Opis: Jako użytkownik chcę, aby moje wpisy były zapisywane wraz z datą, treścią i wygenerowaną sentencją, aby móc je przeglądać na stronie profilu.
- Kryteria akceptacji:
  - Po wygenerowaniu sentencji wpis zostaje zapisany w bazie danych.
  - Użytkownik może przejrzeć historię swoich wpisów na stronie profilu, widząc datę, treść odpowiedzi i sentencję.
  - Wpisy są prezentowane w porządku chronologicznym.

### US-005: Usuwanie wpisów

- Tytuł: Usuwanie wpisów przez użytkownika
- Opis: Jako użytkownik chcę móc usuwać swoje wpisy, aby zarządzać historią refleksji.
- Kryteria akceptacji:
  - Użytkownik może usunąć dowolny wpis z historii.
  - Przed usunięciem wyświetlany jest modal potwierdzający operację.
  - Po usunięciu wpis jest usuwany z bazy danych i nie jest już widoczny w historii.

## US-006: Bezpieczny dostęp i uwierzytelnianie

- Tytuł: Bezpieczny dostęp
- Opis: Jako użytkownik chcę mieć możliwość rejestracji i logowania się do systemu w sposób zapewniający bezpieczeństwo moich danych.
- Kryteria akceptacji:

  - Logowanie i rejestracja odbywają się na dedykowanych stronach.
  - Logowanie wymaga podania adresu email i hasła.
  - Rejestracja wymaga podania adresu email, nazwy uźytkownika, hasła i potwierdzenia hasła.
  - Użytkownik NIE MOŻE korzystać z funkcji tworzenia wpisu z generowaną sentencją bez logowania się do systemu (US-003 i US-004).
  - Użytkownik może logować się do systemu poprzez przycisk w prawym górnym rogu.
  - Użytkownik może się wylogować z systemu poprzez przycisk w prawym górnym rogu w głównym @Layout.astro.
  - Nie korzystamy z zewnętrznych serwisów logowania (np. Google, GitHub).
  - Odzyskiwanie hasła powinno być możliwe.

  ## US-007 Dostęp do widoków bez uwierzytelnienia

  - Tytuł: Dostęp dla niezalogowanego uytkownika
  - Opia: Jako niezalogowany uźytkownik chcę mieć dostęp do strony głównej z formularzem, ale przy próbie wysłania formularza pojawia się modal z informacją o wymaganym logowaniu i przekierowaniu do strony logowania. Dostęp do podstrony z widokiem na wpisy testowe równieź jest moźliwy.
  - Kryteria akceptacji:
    - Użytkownik NIE MOŻE korzystać z funkcji tworzenia wpisu z generowaną sentencją bez logowania się do systemu (US-003 i US-004).
    - Uzytkownik ma dostęp do strony głównej oraz do podstrony wpisów testowych.

## 6. Metryki sukcesu

1. Całkowity czas procesu generacji sentencji (od przesłania formularza do wyświetlenia sentencji) nie przekracza 10 sekund, przy oddzielnym monitorowaniu czasu odpowiedzi backendu i LLM.
2. 70% użytkowników regularnie korzysta z codziennych refleksji, co mierzone jest przez dzienną liczbę logowań.
3. Monitorowanie oddzielne: utrzymanie określonych progów czasowych dla backendu i LLM.
4. Pozytywne doświadczenie użytkownika potwierdzone mechanizmem toast informującym o błędach (np. przekroczenie limitu znaków, opóźnienia).
