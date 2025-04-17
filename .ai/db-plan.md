# Schemat bazy danych - DailyStoic

## 1. Tabele i kolumny

### Tabela: users

Ta tabela jest zarządzana przez Supabase Auth.

- **id**: UUID, PRIMARY KEY, NOT NULL, domyślnie generowany (np. przy użyciu `gen_random_uuid()`)
- **email**: VARCHAR(255), NOT NULL, UNIQUE
- **name**: VARCHAR(255), NOT NULL
- **password**: VARCHAR(255), NOT NULL -- hasło hashowane
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW()

### Tabela: entries

- **id**: UUID, PRIMARY KEY, NOT NULL, domyślnie generowany (np. przy użyciu `gen_random_uuid()`)
- **user_id**: UUID, NOT NULL, REFERENCES users(id) ON DELETE CASCADE
- **what_matters_most**: VARCHAR(500) NOT NULL -- odpowiedź użytkownika na pytanie 1
- **fears_of_loss**: VARCHAR(500) NOT NULL -- odpowiedź użytkownika na pytanie 2
- **personal_goals**: VARCHAR(500) NOT NULL -- odpowiedź użytkownika na pytanie 3
- **generated_sentence**: TEXT NOT NULL -- wygenerowana stoicka sentencja
- **generate_duration**: INTERVAL NOT NULL -- czas generowania sentencji przez model AI
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW()

## 2. Relacje między tabelami

- Relacja jeden-do-wielu między tabelami `users` i `entries`: Każdy użytkownik może mieć wiele wpisów. Kolumna `entries.user_id` odwołuje się do `users.id` i jest zdefiniowana z akcją ON DELETE CASCADE.

## 3. Indeksy

- **Indeks złożony** na tabeli `entries`:
  ```sql
  CREATE INDEX idx_entries_userid_createdat ON entries(user_id, created_at);
  ```
  Indeks ten usprawnia filtrowanie i paginację wpisów według `user_id` oraz `created_at`.

## 4. Zasady PostgreSQL (RLS)

- Włączenie RLS dla tabeli `entries`:
  ```sql
  ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
  ```
- Przykładowa polityka RLS ograniczająca dostęp do wpisów tylko do właściciela (zakłada, że JWT zawiera `user_id`):
  ```sql
  CREATE POLICY user_entries_policy ON entries
    USING (user_id = current_setting('jwt.claims.user_id')::uuid);
  ```

## 5. Dodatkowe uwagi

- Użycie typu UUID dla identyfikatorów (`id` oraz `user_id`) jest zgodne z praktykami Supabase.
- Definicja kolumn `what_matters_most`, `fears_of_loss` i `personal_goals` jako VARCHAR(500) gwarantuje spełnienie limitu znaków.
- Hasło powinno być przechowywane w postaci zahashowanej, przy czym hashowanie może być realizowane przez aplikację lub delegowane do Supabase, jeśli to możliwe.
- Zastosowanie indeksu złożonego na `user_id` i `created_at` zapewni optymalną paginację w przypadku wzrostu liczby wpisów.
- Implementacja RLS zapewnia, że użytkownicy mogą odczytywać i usuwać jedynie swoje wpisy, co zwiększa bezpieczeństwo danych.
