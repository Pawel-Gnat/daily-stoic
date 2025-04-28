# Specyfikacja modułu autentykacji (rejestracja, logowanie, odzyskiwanie hasła)

Poniższy dokument opisuje architekturę frontendu, logikę backendową i integrację systemu autentykacji opartego na Supabase Auth w aplikacji Astro + React.

---

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Strony i ścieżki

- `src/pages/register.astro` – strona rejestracji użytkownika
- `src/pages/login.astro` – strona logowania
- `src/pages/forgot-password.astro` – strona inicjacji odzyskiwania hasła
- `src/pages/reset-password/[token].astro` – strona ustawienia nowego hasła na podstawie tokena
- `src/pages/logout.ts` – endpoint do wylogowania (server-only)

### 1.2 Layouty

- `src/layouts/Layout.astro` – główny layout dla użytkowników niezalogowanych i zalogowanych

### 1.3 Komponenty React i formularze

W katalogu `src/components/auth`:

- `RegisterForm.tsx` – wykorzystuje React Hook Form do obsługi pól: `email`, `password`, `confirmPassword`. Zawiera walidację:
  - `email` musi mieć format `xxx@yyy.zzz`
  - `password` min. 8 znaków
  - `confirmPassword` musi być równe `password`
- `LoginForm.tsx` – pola: `email`, `password`; walidacja formatu i niepustego pola
- `ForgotPasswordForm.tsx` – pole: `email`; walidacja formatu
- `ResetPasswordForm.tsx` – pola: `newPassword`, `confirmNewPassword`; analogiczne zasady jak w rejestracji

Dodatkowe komponenty UI w `src/form`:

- `TextField.tsx` – wrapper nad Shadcn/ui `Input`, automatyczne powiązanie z RHF i wyświetlanie błędów

Dodatkowe komponenty UI w `src/components/auth`:

- `LoginForm.tsx` – dodatkowy link pod formularzem "Odzyskaj hasło"

### 1.4 Podział odpowiedzialności

- Strony Astro (`.astro`) odpowiadają za scaffold strony, importują odpowiedni layout i podpinają React component jako `client:load`.
- Komponenty React w `src/components/auth` implementują logikę formularzy, walidację i wywołania HTTP do API.
- Serwis `AuthService` w `src/lib/services/auth.service.ts` abstrahuje wywołania do API (`signUp`, `signIn`, `signOut`, `forgotPassword`, `resetPassword`).

### 1.5 Scenariusze i obsługa błędów

1. Rejestracja:

   - Użytkownik wypełnia formularz, walidacja client-side.
   - Po kliknięciu "Zarejestruj się" wywołanie `AuthService.signUp`.
   - On success: przekierowanie do `/login` + toast "Sprawdź e-mail w celu potwierdzenia konta".
   - On error: wyświetlenie komunikatu zwróconego przez API z użyciem komponentu toast sonner.

2. Logowanie:

   - Po pomyślnym `AuthService.signIn` ustawienie cookie sesyjnego przez Supabase Auth Helpers.
   - Przekierowanie do strony głównej `/`.

3. Odzyskiwanie hasła:

   - `ForgotPasswordForm` wysyła `AuthService.forgotPassword`, API generuje e-mail z linkiem Supabase.
   - Informacja zwrotna: "Sprawdź skrzynkę pocztową".

4. Reset hasła:
   - Strona odczytuje token z URL, formularz wywołuje `AuthService.resetPassword(token, newPassword)`.
   - On success: przekierowanie do `/login` + toast "Hasło zmienione pomyślnie".
   - Token przeterminowany/nieprawidłowy: komunikat błędu + link do ponownej inicjacji.

### 1.6 Ochrona stron chronionych

- Dla stron wymagających zalogowania w frontmatter Astro stosować SSR guard:
  ```astro
  ---
  import { getSession } from "@supabase/ssr/astro";
  const { session } = await getSession(Astro);
  if (!session?.user) {
    throw Astro.redirect("/login");
  }
  ---
  ```
- Dla stron autoryzacyjnych (`/login`, `/register`, `/forgot-password`) w frontmatter przekierować do `/` gdy `session.user` istnieje.

---

## 2. LOGIKA BACKENDOWA (API)

Katalog: `src/pages/api/auth`

### 2.1 Endpointy

- `sign-up.ts` [POST] – przyjmuje `{ email, password }`, wywołuje `supabase.auth.signUp`
- `sign-in.ts` [POST] – przyjmuje `{ email, password }`, wywołuje `supabase.auth.signInWithPassword`
- `sign-out.ts` [POST] – wywołuje `supabase.auth.signOut`
- `forgot-password.ts`[POST] – przyjmuje `{ email }`, wywołuje `supabase.auth.resetPasswordForEmail`
- `reset-password.ts` [POST] – przyjmuje `{ token, newPassword }`, wywołuje `supabase.auth.updateUser`

### 2.2 Walidacja danych wejściowych

- Użycie `zod` na początku każdego handlera.
- Guard clauses: jeśli brakujące/wadliwe pola → `return new Response(JSON.stringify({ error: '...' }), { status: 400 })`.

### 2.3 Obsługa wyjątków i logowanie

- W bloku `try/catch`.
- Błędy supabase.auth → mapowanie na status 4xx/5xx z czytelnym komunikatem.
- Globalny middleware Sentry (z `src/middleware/index.ts`) do zbierania wyjątków.

### 2.4 Integracja z Astro

- Zainstaluj i dodaj integrację `@supabase/ssr/astro` w `astro.config.mjs`:

  ```js
  import { defineConfig } from "astro/config";
  import { ssr } from "@supabase/ssr/astro";

  export default defineConfig({
    integrations: [ssr()],
  });
  ```

- Skonfiguruj zmienne środowiskowe w `.env`:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
- Umożliwia SSR-injected session i helpery (`getSession`, `withSession`) z pakietu `@supabase/ssr`

---

## 3. SYSTEM AUTENTYKACJI (Supabase Auth)

### 3.1 Konfiguracja

- Plik `.env`:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
- Inicjalizacja klienta w `src/db/supabase.client.ts`:

```ts
import { createClient } from "@supabase/supabase-js";
export const supabase = createClientt<Database>(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_ANON_KEY);
```

### 3.2 Przepływy

1. **Rejestracja**: Supabase wysyła e-mail potwierdzający (jeśli włączone).
2. **Logowanie**: cookie sesyjne, obsługa RLS w Supabase.
3. **Wylogowanie**: czyszczenie cookie.
4. **Odzyskiwanie hasła**: link Supabase → `reset-password/[token]`.
5. **Reset hasła**: `supabase.auth.updateUser({ password })`.

### 3.3 Bezpieczeństwo i RLS

- Weryfikacja dostępu do chronionych zasobów we frontendzie i backendzie.

---

## 4. Podsumowanie

Specyfikacja zakłada modularną budowę:

- Strony Astro jako entrypoint
- React-komponenty do UI i walidacji
- `AuthService` + API routes jako warstwa integracji z Supabase
- Konfiguracja SSR i RLS przez plugin Supabase w Astro

Taki podział pozwoli na łatwe testowanie (Vitest dla komponentów, e2e dla flow auth) i zachowanie spójności z istniejącymi wymaganiami aplikacji.
