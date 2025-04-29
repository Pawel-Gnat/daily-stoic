<authentication_analysis>

1. Wymienione przepływy autentykacji:
   - Rejestracja konta (sign-up)
   - Logowanie hasłem (sign-in)
   - Odzyskiwanie hasła (forgot-password)
   - Reset hasła z tokenem (reset-password)
   - Wylogowanie (sign-out)
   - Ochrona zasobów (SSR guard przed dostępem do chronionych stron)
2. Główni aktorzy i interakcje:
   - Przeglądarka (Browser)
   - Middleware (autoryzacja cookie i sesji)
   - Astro API (endpointy auth)
   - Supabase Auth (usługa uwierzytelniania)
3. Procesy weryfikacji i odświeżania tokenów:
   - getSession() z `@supabase/ssr/astro` w SSR
   - Automatyczne odświeżanie tokenu dostępowego przy wygasłej sesji przez Supabase
4. Opis kroków:
   a) Przeglądanie stron zalogowanych/niezalogowanych
   b) Wywołanie endpointu auth w Astro API
   c) Komunikacja z SupabaseAuth do signUp/signIn/reset
   d) Ustawianie/usuwanie ciastek sesyjnych
   e) Przekierowania na odpowiednie strony
   </authentication_analysis>

<mermaid_diagram>

```mermaid
sequenceDiagram
autonumber
participant Browser as Przeglądarka
participant Middleware as Middleware
participant AstroAPI as Astro API
participant Supabase as Supabase Auth

Browser->>AstroAPI: GET /register
activate AstroAPI
AstroAPI-->Browser: Render strony rejestracji
deactivate AstroAPI

Browser->>AstroAPI: POST /api/auth/sign-up
activate AstroAPI
AstroAPI->>Supabase: signUp(email,password)
activate Supabase
Supabase--)Supabase: send confirmation email
Supabase-->>AstroAPI: 200 Account created
deactivate Supabase
AstroAPI-->Browser: Redirect /login
deactivate AstroAPI

alt Logowanie udane
  Browser->>AstroAPI: POST /api/auth/sign-in
  activate AstroAPI
  AstroAPI->>Supabase: signInWithPassword(...)
  activate Supabase
  Supabase-->>AstroAPI: Sesja (access,refresh)
  deactivate Supabase
  AstroAPI-->Browser: Ustaw cookies & redirect /
  deactivate AstroAPI
else Logowanie nieudane
  AstroAPI-->>Browser: 401 Błąd logowania
end

Browser->>AstroAPI: GET /dashboard
activate AstroAPI
AstroAPI->>Middleware: Wstrzyknięcie supabaseClient z cookie
activate Middleware
Middleware-->>AstroAPI: Client z tokenem
deactivate Middleware
AstroAPI->>Supabase: getSession()
activate Supabase
Supabase-->>AstroAPI: Sesja + refresh if expired
deactivate Supabase
alt Sesja poprawna
  AstroAPI-->Browser: Render dashboard
else Brak sesji
  AstroAPI-->Browser: Redirect /login
end
deactivate AstroAPI

Browser->>AstroAPI: POST /api/auth/sign-out
activate AstroAPI
AstroAPI->>Supabase: signOut()
activate Supabase
Supabase-->>AstroAPI: OK
deactivate Supabase
AstroAPI-->Browser: Clear cookies & redirect /login
deactivate AstroAPI

Browser->>AstroAPI: POST /api/auth/forgot-password
activate AstroAPI
AstroAPI->>Supabase: resetPasswordForEmail(email)
activate Supabase
Supabase--)Supabase: send reset email
Supabase-->>AstroAPI: 200
deactivate Supabase
AstroAPI-->Browser: Info "Sprawdź e-mail"
deactivate AstroAPI

Browser->>AstroAPI: POST /api/auth/reset-password
activate AstroAPI
AstroAPI->>Supabase: updateUser(token,newPass)
activate Supabase
Supabase-->>AstroAPI: 200
deactivate Supabase
AstroAPI-->Browser: Redirect /login
deactivate AstroAPI
```

</mermaid_diagram>

https://www.mermaidchart.com/raw/a77665c8-4d15-429f-ae6d-ea4d0bfcd7d6?theme=light&version=v0.1&format=svg
