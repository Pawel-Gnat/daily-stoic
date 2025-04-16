# Plan implementacji widoku autoryzacji

## 1. Przegląd

Widok autoryzacji składa się z dwóch głównych podwidoków: logowania i rejestracji. Umożliwia użytkownikom bezpieczne utworzenie konta oraz logowanie do aplikacji. Wykorzystuje Supabase do autentykacji i zapewnia przyjazny dla użytkownika interfejs z odpowiednią walidacją i obsługą błędów.

## 2. Routing widoku

- `/login` - strona logowania
- `/register` - strona rejestracji
- Przekierowanie na `/` po udanej autoryzacji
- Przekierowanie na `/login` dla nieautoryzowanych użytkowników

## 3. Struktura komponentów

```
AuthLayout
└── AuthCard
    ├── LoginForm
    │   ├── EmailInput
    │   └── PasswordInput
    └── RegisterForm
        ├── EmailInput
        ├── UsernameInput
        └── PasswordInput
```

## 4. Szczegóły komponentów

### AuthLayout

- Opis komponentu: Główny layout dla stron autoryzacji, zapewniający spójny wygląd
- Główne elementy: Container, tło, logo aplikacji
- Obsługiwane interakcje: brak
- Obsługiwana walidacja: brak
- Typy: `{ children: ReactNode }`
- Propsy: `children`

### AuthCard

- Opis komponentu: Kontener dla formularzy autoryzacji
- Główne elementy: Card z shadcn/ui, nagłówek, opis
- Obsługiwane interakcje: Przełączanie między formularzami
- Obsługiwana walidacja: brak
- Typy: `{ variant: 'login' | 'register', onToggle: () => void }`
- Propsy: `variant, onToggle, children`

### LoginForm

- Opis komponentu: Formularz logowania
- Główne elementy: Form, EmailInput, PasswordInput, Button
- Obsługiwane interakcje: Submit formularza, reset hasła
- Obsługiwana walidacja:
  - Email: format, wymagane pole
  - Hasło: wymagane pole
- Typy: `LoginFormData, ValidationErrors`
- Propsy: `onSuccess: () => void`

### RegisterForm

- Opis komponentu: Formularz rejestracji
- Główne elementy: Form, EmailInput, UsernameInput, PasswordInput (2x)
- Obsługiwane interakcje: Submit formularza
- Obsługiwana walidacja:
  - Email: format, wymagane pole, unikalność
  - Nazwa użytkownika: długość, wymagane pole
  - Hasło: siła, wymagane pole
  - Potwierdzenie hasła: zgodność
- Typy: `RegisterFormData, ValidationErrors`
- Propsy: `onSuccess: () => void`

## 5. Typy

```typescript
interface AuthFormState {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  isLoading: boolean;
  error?: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}
```

## 6. Zarządzanie stanem

- Wykorzystanie `useForm` z react-hook-form do zarządzania formularzami
- Custom hook `useAuth` do zarządzania stanem autoryzacji:
  ```typescript
  const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // metody login, register, logout, resetPassword
    return { isLoading, error, login, register, logout, resetPassword };
  };
  ```

## 7. Integracja API

- Wykorzystanie klienta Supabase do operacji auth:
  - `supabase.auth.signUp()` - rejestracja
  - `supabase.auth.signIn()` - logowanie
  - `supabase.auth.resetPassword()` - reset hasła
- Obsługa odpowiedzi i błędów API
- Przechowywanie tokenu w bezpieczny sposób

## 8. Interakcje użytkownika

1. Logowanie:

   - Wypełnienie formularza
   - Walidacja pól
   - Wysłanie danych
   - Przekierowanie po sukcesie
   - Wyświetlenie błędów

2. Rejestracja:

   - Wypełnienie formularza
   - Walidacja pól w czasie rzeczywistym
   - Wysłanie danych
   - Przekierowanie po sukcesie
   - Wyświetlenie błędów

3. Reset hasła:
   - Wprowadzenie emaila
   - Wysłanie linku resetującego
   - Potwierdzenie wysłania

## 9. Warunki i walidacja

1. Email:

   - Format: poprawny email
   - Wymagane pole
   - Unikalność przy rejestracji

2. Hasło:

   - Minimum 8 znaków
   - Wymagana duża litera
   - Wymagana cyfra
   - Wymagany znak specjalny

3. Nazwa użytkownika:
   - 3-30 znaków
   - Tylko litery, cyfry i podkreślenia
   - Wymagane pole

## 10. Obsługa błędów

1. Błędy walidacji:

   - Wyświetlanie pod polami formularza
   - Walidacja w czasie rzeczywistym
   - Blokada submitu przy błędach

2. Błędy API:

   - Niepoprawne dane logowania
   - Zajęty email
   - Problemy z połączeniem

3. Obsługa:
   - Toast notifications dla błędów
   - Wyświetlanie w formularzu
   - Możliwość ponowienia akcji

## 11. Kroki implementacji

1. Utworzenie podstawowej struktury:

   - Konfiguracja routingu Astro
   - Utworzenie komponentów layout
   - Implementacja AuthCard

2. Implementacja formularzy:

   - Konfiguracja react-hook-form
   - Implementacja LoginForm
   - Implementacja RegisterForm
   - Dodanie walidacji

3. Integracja z Supabase:

   - Konfiguracja klienta
   - Implementacja useAuth
   - Podłączenie formularzy do API

4. Stylizacja i dostępność:

   - Implementacja stylów Tailwind
   - Dodanie komponentów shadcn/ui
   - Responsywność

5. Obsługa błędów:

   - Implementacja toastów
   - Obsługa błędów API
