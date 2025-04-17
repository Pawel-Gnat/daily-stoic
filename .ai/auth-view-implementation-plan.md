# Plan implementacji widoku Autentykacji

## 1. Przegląd

Widok autentykacji składa się z dwóch głównych stron: logowania i rejestracji. Umożliwia użytkownikom bezpieczne utworzenie konta oraz logowanie do aplikacji DailyStoic. Wykorzystuje Supabase do autentykacji i zapewnia przyjazny dla użytkownika interfejs z odpowiednią walidacją oraz obsługą błędów.

## 2. Routing widoku

- `/login` - strona logowania
- `/register` - strona rejestracji
- `/reset-password` - strona resetowania hasła

## 3. Struktura komponentów

```
AuthLayout (Astro)
└── AuthCard (React)
    ├── LoginForm (React)
    │   ├── EmailInput (Shadcn/ui)
    │   ├── PasswordInput (Shadcn/ui)
    │   └── SubmitButton (Shadcn/ui)
    └── RegisterForm (React)
        ├── EmailInput (Shadcn/ui)
        ├── UsernameInput (Shadcn/ui)
        ├── PasswordInput (Shadcn/ui)
        ├── ConfirmPasswordInput (Shadcn/ui)
        └── SubmitButton (Shadcn/ui)
```

## 4. Szczegóły komponentów

### AuthLayout

- Opis komponentu: Layout Astro dla stron autentykacji, zapewniający spójny wygląd
- Główne elementy: Container, tło, logo aplikacji
- Obsługiwane interakcje: Brak (komponent statyczny)
- Typy: Brak (komponent Astro)
- Propsy: `title: string`, `description: string`

### AuthCard

- Opis komponentu: Karta zawierająca formularz autentykacji
- Główne elementy: Card z Shadcn/ui, nagłówek, opis
- Obsługiwane interakcje: Brak (komponent prezentacyjny)
- Typy:
  ```typescript
  interface AuthCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
  }
  ```

### LoginForm

- Opis komponentu: Formularz logowania
- Główne elementy: Pola email i hasło, przycisk submit, link do rejestracji
- Obsługiwane interakcje:
  - Submisja formularza
  - Walidacja pól
  - Obsługa błędów
- Obsługiwana walidacja:
  - Email: format, wymagane
  - Hasło: wymagane
- Typy:
  ```typescript
  interface LoginFormState {
    email: string;
    password: string;
    isLoading: boolean;
    error?: string;
  }
  ```

### RegisterForm

- Opis komponentu: Formularz rejestracji
- Główne elementy: Pola email, nazwa użytkownika, hasło, potwierdzenie hasła
- Obsługiwane interakcje:
  - Submisja formularza
  - Walidacja pól
  - Obsługa błędów
- Obsługiwana walidacja:
  - Email: format, wymagane, unikalność
  - Nazwa użytkownika: wymagane, min 3 znaki
  - Hasło: min 8 znaków, wymagane
  - Potwierdzenie hasła: zgodność z hasłem
- Typy:
  ```typescript
  interface RegisterFormState {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    isLoading: boolean;
    error?: string;
  }
  ```

## 5. Typy

```typescript
// Stan formularza
interface AuthFormState {
  isLoading: boolean;
  error?: string;
  success?: string;
}

// Błędy walidacji
interface ValidationErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

// Context autentykacji
interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterUserDto) => Promise<void>;
  logout: () => Promise<void>;
}
```

## 6. Zarządzanie stanem

- Wykorzystanie React Context dla stanu autentykacji
- Lokalny stan formularzy z użyciem `useState`
- Custom hook `useAuth` dla operacji autentykacji:
  ```typescript
  const useAuth = () => {
    // Implementacja hooka zarządzającego stanem autentykacji
    // i operacjami na Supabase
  };
  ```

## 7. Integracja API

- Logowanie:
  ```typescript
  const login = async (email: string, password: string): Promise<AuthResponseDto> => {
    const response = await supabase.auth.signInWithPassword({ email, password });
    return response.data;
  };
  ```
- Rejestracja:
  ```typescript
  const register = async (data: RegisterUserDto): Promise<AuthResponseDto> => {
    const response = await supabase.auth.signUp(data);
    return response.data;
  };
  ```

## 8. Interakcje użytkownika

1. Logowanie:

   - Wypełnienie formularza
   - Walidacja pól
   - Submisja formularza
   - Obsługa odpowiedzi
   - Przekierowanie po sukcesie

2. Rejestracja:
   - Wypełnienie formularza
   - Walidacja pól
   - Submisja formularza
   - Obsługa odpowiedzi
   - Przekierowanie do logowania

## 9. Warunki i walidacja

1. Email:

   - Format: regex `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i`
   - Wymagane pole

2. Nazwa użytkownika:

   - Min 3 znaki
   - Tylko litery, cyfry i podkreślenia
   - Wymagane pole

3. Hasło:

   - Min 8 znaków
   - Wymagane pole
   - Zawiera przynajmniej jedną cyfrę i znak specjalny

4. Potwierdzenie hasła:
   - Identyczne z hasłem
   - Wymagane pole

## 10. Obsługa błędów

1. Błędy walidacji:

   - Wyświetlanie pod polami formularza
   - Czerwona obwódka pola z błędem

2. Błędy API:

   - Toast z komunikatem błędu
   - Resetowanie stanu loading
   - Zachowanie wprowadzonych danych

3. Błędy sieci:
   - Toast z informacją o problemie z połączeniem
   - Możliwość ponowienia próby

## 11. Kroki implementacji

1. Utworzenie podstawowej struktury katalogów:

   ```
   src/
   ├── pages/
   │   ├── login.astro
   │   └── register.astro
   ├── components/
   │   └── auth/
   │       ├── AuthCard.tsx
   │       ├── LoginForm.tsx
   │       └── RegisterForm.tsx
   ├── hooks/
   │   └── useAuth.ts
   └── layouts/
       └── AuthLayout.astro
   ```

2. Implementacja komponentów:

   - AuthLayout
   - AuthCard
   - Formularze (Login, Register)
   - Komponenty pomocnicze

3. Implementacja logiki:

   - Hook useAuth
   - Walidacja formularzy
   - Integracja z Supabase

4. Stylizacja:

   - Implementacja stylów Tailwind
   - Dostosowanie komponentów Shadcn/ui
   - RWD
