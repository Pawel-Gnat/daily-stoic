# API Endpoint Implementation Plan: `/entries` Endpoints

## 1. Przegląd punktu końcowego

Endpoints `/entries` służą do zarządzania wpisami codziennych refleksji stoickich. Umożliwiają:

- Tworzenie nowych wpisów z automatycznym generowaniem sentencji stoickiej przez AI
- Pobieranie listy wpisów z paginacją
- Pobieranie szczegółów pojedynczego wpisu
- Usuwanie wpisów

Wszystkie operacje wymagają uwierzytelnienia, a użytkownicy mogą zarządzać tylko własnymi wpisami.

## 2. Szczegóły żądania

### 2.1 Tworzenie wpisu (Create Entry)

- **Metoda HTTP**: POST
- **Struktura URL**: `/entries`
- **Wymagania autoryzacji**: JWT token w nagłówku Authorization
- **Request Body**:
  ```typescript
  {
    what_matters_most: string; // max 500 znaków
    fears_of_loss: string; // max 500 znaków
    personal_goals: string; // max 500 znaków
  }
  ```

### 2.2 Pobieranie listy wpisów (List Entries)

- **Metoda HTTP**: GET
- **Struktura URL**: `/entries`
- **Wymagania autoryzacji**: JWT token w nagłówku Authorization
- **Parametry zapytania**:
  - `page`: number (domyślnie: 1) - numer strony
  - `limit`: number (domyślnie: 10) - liczba elementów na stronie
  - `sort`: string (domyślnie: "created_at:desc") - sortowanie

### 2.3 Pobieranie pojedynczego wpisu (Get Entry)

- **Metoda HTTP**: GET
- **Struktura URL**: `/entries/{id}`
- **Wymagania autoryzacji**: JWT token w nagłówku Authorization
- **Parametry ścieżki**:
  - `id`: string (UUID) - identyfikator wpisu

### 2.4 Usuwanie wpisu (Delete Entry)

- **Metoda HTTP**: DELETE
- **Struktura URL**: `/entries/{id}`
- **Wymagania autoryzacji**: JWT token w nagłówku Authorization
- **Parametry ścieżki**:
  - `id`: string (UUID) - identyfikator wpisu

## 3. Wykorzystywane typy

```typescript
// DTOs
import { CreateEntryDto, EntryDto, EntryListResponseDto, EntryListQueryParams, ErrorResponseDto } from "../types";

// Database Types
import type { SupabaseClient } from "./db/supabase.client";
import type { Tables } from "./db/database.types";
```

## 4. Szczegóły odpowiedzi

### 4.1 Tworzenie wpisu (Create Entry)

- **Kod statusu**: 201 Created
- **Format odpowiedzi**:
  ```typescript
  {
    id: string;
    what_matters_most: string;
    fears_of_loss: string;
    personal_goals: string;
    generated_sentence: string;
    generate_duration: number; // w milisekundach
    created_at: string; // ISO 8601 format
  }
  ```

### 4.2 Pobieranie listy wpisów (List Entries)

- **Kod statusu**: 200 OK
- **Format odpowiedzi**:
  ```typescript
  {
    data: [
      {
        id: string;
        what_matters_most: string;
        fears_of_loss: string;
        personal_goals: string;
        generated_sentence: string;
        generate_duration: number;
        created_at: string;
      }
    ],
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      has_next: boolean;
    }
  }
  ```

### 4.3 Pobieranie pojedynczego wpisu (Get Entry)

- **Kod statusu**: 200 OK
- **Format odpowiedzi**:
  ```typescript
  {
    id: string;
    what_matters_most: string;
    fears_of_loss: string;
    personal_goals: string;
    generated_sentence: string;
    generate_duration: number;
    created_at: string;
  }
  ```

### 4.4 Usuwanie wpisu (Delete Entry)

- **Kod statusu**: 204 No Content
- **Brak treści odpowiedzi**

## 5. Przepływ danych

### 5.1 Tworzenie wpisu (Create Entry)

1. Przyjęcie żądania i walidacja danych wejściowych za pomocą Zod
2. Pobranie ID użytkownika z tokenu JWT
3. Wywołanie usługi AI do wygenerowania sentencji stoickiej (z pomiarem czasu)
4. Zapis nowego wpisu do bazy danych Supabase
5. Zwrócenie utworzonego wpisu

### 5.2 Pobieranie listy wpisów (List Entries)

1. Przyjęcie żądania i walidacja parametrów zapytania
2. Pobranie ID użytkownika z tokenu JWT
3. Pobieranie wpisów z bazy danych Supabase z uwzględnieniem filtrowania i paginacji
4. Obliczenie metadanych paginacji
5. Zwrócenie listy wpisów z metadanymi paginacji

### 5.3 Pobieranie pojedynczego wpisu (Get Entry)

1. Przyjęcie żądania i walidacja parametru ID
2. Pobranie ID użytkownika z tokenu JWT
3. Pobieranie wpisu z bazy danych Supabase
4. Weryfikacja, czy wpis należy do użytkownika
5. Zwrócenie wpisu

### 5.4 Usuwanie wpisu (Delete Entry)

1. Przyjęcie żądania i walidacja parametru ID
2. Pobranie ID użytkownika z tokenu JWT
3. Weryfikacja, czy wpis istnieje i należy do użytkownika
4. Usunięcie wpisu z bazy danych Supabase
5. Zwrócenie kodu 204 (No Content)

6. Dodanie dedykowanej metody `getTodayEntry` w serwisie i implementacja endpointu pobierania dzisiejszego wpisu:

   a) W pliku `src/lib/services/entry.service.ts` dodaję metodę:

   ```typescript
   /**
    * Retrieves the entry for the current day
    * @param userId User ID
    * @returns Entry or null if none exists today
    */
   async getTodayEntry(userId: string): Promise<Entry | null> {
     const today = new Date();
     const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
     const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

     const { data, error } = await this.supabase
       .from('entries')
       .select('*')
       .eq('user_id', userId)
       .gte('created_at', startOfDay)
       .lt('created_at', endOfDay)
       .order('created_at', { ascending: false })
       .limit(1)
       .single();

     if (error) {
       if (error.message?.includes('No rows found')) return null;
       console.error('Failed to get today\'s entry:', error);
       throw new Error('Failed to get today\'s entry');
     }

     return data;
   }
   ```

   b) W pliku `src/pages/api/entries/today.ts` tworzę endpoint:

   ```typescript
   import type { APIContext } from "astro";
   import { EntryService } from "../../../lib/services/entry.service";
   import { DEFAULT_USER_ID } from "../../../db/supabase.client";

   export const prerender = false;

   export async function GET({ locals }: APIContext) {
     try {
       const userId = locals.user?.id || DEFAULT_USER_ID;
       const entryService = new EntryService(locals.supabase);
       const entry = await entryService.getTodayEntry(userId);

       if (!entry) {
         return new Response(JSON.stringify({ error: { code: "not_found", message: "No entry for today" } }), {
           status: 404,
           headers: { "Content-Type": "application/json" },
         });
       }

       return new Response(JSON.stringify(entry), {
         status: 200,
         headers: { "Content-Type": "application/json" },
       });
     } catch (error) {
       console.error("Error fetching today's entry:", error);
       return new Response(
         JSON.stringify({ error: { code: "server_error", message: "Failed to retrieve today's entry" } }),
         { status: 500, headers: { "Content-Type": "application/json" } }
       );
     }
   }
   ```

## 6. Względy bezpieczeństwa

1. **Uwierzytelnianie**:

   - Wykorzystanie Supabase JWT do uwierzytelniania wszystkich żądań
   - Weryfikacja tokenu w middleware Astro

2. **Autoryzacja**:

   - Wykorzystanie Row Level Security (RLS) na poziomie bazy danych
   - Dodatkowa weryfikacja właściciela wpisu w kodzie API
   - Użytkownik może uzyskać dostęp tylko do własnych wpisów

3. **Walidacja danych**:

   - Walidacja wszystkich danych wejściowych za pomocą Zod
   - Sprawdzanie limitów znaków dla pól wpisu (max 500 znaków)
   - Sanityzacja danych przed zapisem do bazy danych

4. **Ochrona przed atakami**:
   - Implementacja limitów szybkości (rate limiting) dla endpointów
   - Weryfikacja nagłówków Origin/Referer
   - Ochrona przed atakami CSRF i XSS

## 7. Obsługa błędów

1. **Błędy walidacji (400 Bad Request)**:

   - Nieprawidłowy format danych wejściowych
   - Przekroczenie limitu znaków (max 500)
   - Brakujące wymagane pola

2. **Błędy uwierzytelniania (401 Unauthorized)**:

   - Brak tokenu JWT
   - Wygasły token JWT
   - Nieprawidłowy token JWT

3. **Błędy autoryzacji (403 Forbidden)**:

   - Próba dostępu do wpisu innego użytkownika
   - Próba usunięcia wpisu innego użytkownika

4. **Błędy zasobu (404 Not Found)**:

   - Wpis o podanym ID nie istnieje

5. **Błędy limitów (429 Too Many Requests)**:

   - Przekroczenie limitu żądań (rate limit)

6. **Błędy serwera (500 Internal Server Error)**:
   - Błąd generowania sentencji przez AI
   - Błąd komunikacji z bazą danych
   - Inne nieoczekiwane błędy

Wszystkie błędy powinny być zwracane w standardowym formacie:

```typescript
{
  error: {
    code: string;
    message: string;
  }
}
```

## 8. Rozważania dotyczące wydajności

1. **Optymalizacja bazy danych**:

   - Użycie indeksu dla kolumn `user_id` i `created_at` w tabeli `entries`
   - Wykorzystanie transakcji dla złożonych operacji

2. **Generowanie sentencji AI**:

   - Implementacja timeoutów dla zapytań AI (max 8 sekund)
   - Obsługa retry dla nieudanych generacji

3. **Paginacja**:

   - Limit maksymalnie 25 elementów na stronę
   - Implementacja stronicowania opartego na kluczach (cursor-based pagination) dla dużych zbiorów danych

4. **Monitoring**:
   - Śledzenie czasu generacji sentencji przez AI
   - Monitorowanie całkowitego czasu odpowiedzi

## 9. Etapy wdrożenia

### 9.1 Przygotowanie infrastruktury

1. Utworzenie schematów Zod dla walidacji danych wejściowych:

   ```typescript
   // src/lib/schemas/entry.schema.ts
   import { z } from "zod";

   export const createEntrySchema = z.object({
     what_matters_most: z.string().min(1).max(500),
     fears_of_loss: z.string().min(1).max(500),
     personal_goals: z.string().min(1).max(500),
   });

   export const entryListQuerySchema = z.object({
     page: z.coerce.number().int().positive().optional().default(1),
     limit: z.coerce.number().int().positive().max(25).optional().default(10),
     sort: z.string().optional().default("created_at:desc"),
   });
   ```

2. Utworzenie usługi generowania sentencji AI:

   ```typescript
   // src/lib/services/ai.service.ts
   export class AIService {
     async generateStoicSentence(context: {
       what_matters_most: string;
       fears_of_loss: string;
       personal_goals: string;
     }): Promise<{ sentence: string; duration: number }> {
       const startTime = performance.now();

       // Implementacja komunikacji z OpenRouter.ai

       const endTime = performance.now();
       return {
         sentence: "Wygenerowana sentencja stoicka...",
         duration: endTime - startTime,
       };
     }
   }
   ```

3. Utworzenie usługi zarządzania wpisami:

   ```typescript
   // src/lib/services/entry.service.ts
   import type { SupabaseClient } from "../../db/supabase.client";
   import type { Entry, CreateEntryDto, EntryListQueryParams } from "../../types";
   import { AIService } from "./ai.service";

   export class EntryService {
     private aiService: AIService;

     constructor(private supabase: SupabaseClient) {
       this.aiService = new AIService();
     }

     async createEntry(userId: string, data: CreateEntryDto): Promise<Entry> {
       // Implementacja tworzenia wpisu
     }

     async getEntries(
       userId: string,
       query: EntryListQueryParams
     ): Promise<{
       data: Entry[];
       pagination: {
         current_page: number;
         total_pages: number;
         total_items: number;
         has_next: boolean;
       };
     }> {
       // Implementacja pobierania listy wpisów
     }

     async getEntry(userId: string, entryId: string): Promise<Entry | null> {
       // Implementacja pobierania pojedynczego wpisu
     }

     async deleteEntry(userId: string, entryId: string): Promise<void> {
       // Implementacja usuwania wpisu
     }

     async getTodayEntry(userId: string): Promise<Entry | null> {
       const today = new Date();
       const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
       const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

       const { data, error } = await this.supabase
         .from("entries")
         .select("*")
         .eq("user_id", userId)
         .gte("created_at", startOfDay)
         .lt("created_at", endOfDay)
         .order("created_at", { ascending: false })
         .limit(1)
         .single();

       if (error) {
         if (error.message?.includes("No rows found")) return null;
         console.error("Failed to get today's entry:", error);
         throw new Error("Failed to get today's entry");
       }

       return data;
     }
   }
   ```

### 9.2 Implementacja endpointów API

1. Implementacja endpointu tworzenia wpisu:

   ```typescript
   // src/pages/api/entries.ts
   import { type APIContext } from "astro";
   import { EntryService } from "../../lib/services/entry.service";
   import { createEntrySchema } from "../../lib/schemas/entry.schema";

   export const prerender = false;

   export async function POST({ request, locals }: APIContext) {
     try {
       // Walidacja danych wejściowych
       const json = await request.json();
       const result = createEntrySchema.safeParse(json);

       if (!result.success) {
         return new Response(
           JSON.stringify({
             error: {
               code: "validation_error",
               message: "Nieprawidłowe dane wejściowe",
             },
           }),
           { status: 400, headers: { "Content-Type": "application/json" } }
         );
       }

       const { what_matters_most, fears_of_loss, personal_goals } = result.data;

       // Pobranie użytkownika z kontekstu
       const userId = locals.user?.id;
       if (!userId) {
         return new Response(
           JSON.stringify({
             error: {
               code: "unauthorized",
               message: "Brak autoryzacji",
             },
           }),
           { status: 401, headers: { "Content-Type": "application/json" } }
         );
       }

       // Utworzenie wpisu
       const entryService = new EntryService(locals.supabase);
       const entry = await entryService.createEntry(userId, {
         what_matters_most,
         fears_of_loss,
         personal_goals,
       });

       return new Response(JSON.stringify(entry), { status: 201, headers: { "Content-Type": "application/json" } });
     } catch (error) {
       console.error("Error creating entry:", error);

       return new Response(
         JSON.stringify({
           error: {
             code: "server_error",
             message: "Wystąpił błąd podczas tworzenia wpisu",
           },
         }),
         { status: 500, headers: { "Content-Type": "application/json" } }
       );
     }
   }
   ```

2. Implementacja endpointu pobierania listy wpisów:

   ```typescript
   // src/pages/api/entries.ts (rozszerzenie)
   import { entryListQuerySchema } from "../../lib/schemas/entry.schema";

   export async function GET({ request, locals, url }: APIContext) {
     try {
       // Walidacja parametrów zapytania
       const params = Object.fromEntries(url.searchParams.entries());
       const result = entryListQuerySchema.safeParse(params);

       if (!result.success) {
         return new Response(
           JSON.stringify({
             error: {
               code: "validation_error",
               message: "Nieprawidłowe parametry zapytania",
             },
           }),
           { status: 400, headers: { "Content-Type": "application/json" } }
         );
       }

       // Pobranie użytkownika z kontekstu
       const userId = locals.user?.id;
       if (!userId) {
         return new Response(
           JSON.stringify({
             error: {
               code: "unauthorized",
               message: "Brak autoryzacji",
             },
           }),
           { status: 401, headers: { "Content-Type": "application/json" } }
         );
       }

       // Pobranie wpisów
       const entryService = new EntryService(locals.supabase);
       const response = await entryService.getEntries(userId, result.data);

       return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
     } catch (error) {
       console.error("Error fetching entries:", error);

       return new Response(
         JSON.stringify({
           error: {
             code: "server_error",
             message: "Wystąpił błąd podczas pobierania wpisów",
           },
         }),
         { status: 500, headers: { "Content-Type": "application/json" } }
       );
     }
   }
   ```

3. Implementacja endpointów pobierania i usuwania pojedynczego wpisu:

   ```typescript
   // src/pages/api/entries/[id].ts
   import { type APIContext } from "astro";
   import { EntryService } from "../../../lib/services/entry.service";
   import { z } from "zod";

   export const prerender = false;

   const idSchema = z.string().uuid();

   export async function GET({ params, locals }: APIContext) {
     try {
       // Walidacja ID
       const result = idSchema.safeParse(params.id);
       if (!result.success) {
         return new Response(
           JSON.stringify({
             error: {
               code: "validation_error",
               message: "Nieprawidłowy format ID",
             },
           }),
           { status: 400, headers: { "Content-Type": "application/json" } }
         );
       }

       // Pobranie użytkownika z kontekstu
       const userId = locals.user?.id;
       if (!userId) {
         return new Response(
           JSON.stringify({
             error: {
               code: "unauthorized",
               message: "Brak autoryzacji",
             },
           }),
           { status: 401, headers: { "Content-Type": "application/json" } }
         );
       }

       // Pobranie wpisu
       const entryService = new EntryService(locals.supabase);
       const entry = await entryService.getEntry(userId, params.id);

       if (!entry) {
         return new Response(
           JSON.stringify({
             error: {
               code: "not_found",
               message: "Wpis nie istnieje",
             },
           }),
           { status: 404, headers: { "Content-Type": "application/json" } }
         );
       }

       return new Response(JSON.stringify(entry), { status: 200, headers: { "Content-Type": "application/json" } });
     } catch (error) {
       console.error("Error fetching entry:", error);

       return new Response(
         JSON.stringify({
           error: {
             code: "server_error",
             message: "Wystąpił błąd podczas pobierania wpisu",
           },
         }),
         { status: 500, headers: { "Content-Type": "application/json" } }
       );
     }
   }

   export async function DELETE({ params, locals }: APIContext) {
     try {
       // Walidacja ID
       const result = idSchema.safeParse(params.id);
       if (!result.success) {
         return new Response(
           JSON.stringify({
             error: {
               code: "validation_error",
               message: "Nieprawidłowy format ID",
             },
           }),
           { status: 400, headers: { "Content-Type": "application/json" } }
         );
       }

       // Pobranie użytkownika z kontekstu
       const userId = locals.user?.id;
       if (!userId) {
         return new Response(
           JSON.stringify({
             error: {
               code: "unauthorized",
               message: "Brak autoryzacji",
             },
           }),
           { status: 401, headers: { "Content-Type": "application/json" } }
         );
       }

       // Usunięcie wpisu
       const entryService = new EntryService(locals.supabase);
       await entryService.deleteEntry(userId, params.id);

       return new Response(null, { status: 204 });
     } catch (error) {
       console.error("Error deleting entry:", error);

       return new Response(
         JSON.stringify({
           error: {
             code: "server_error",
             message: "Wystąpił błąd podczas usuwania wpisu",
           },
         }),
         { status: 500, headers: { "Content-Type": "application/json" } }
       );
     }
   }
   ```

4. Implementacja endpointu pobierania dzisiejszego wpisu:

   ```typescript
   // src/pages/api/entries/today.ts
   import type { APIContext } from "astro";
   import { EntryService } from "../../../lib/services/entry.service";
   import { DEFAULT_USER_ID } from "../../../db/supabase.client";

   export const prerender = false;

   export async function GET({ locals }: APIContext) {
     try {
       const userId = locals.user?.id || DEFAULT_USER_ID;
       const entryService = new EntryService(locals.supabase);
       const entry = await entryService.getTodayEntry(userId);

       if (!entry) {
         return new Response(JSON.stringify({ error: { code: "not_found", message: "No entry for today" } }), {
           status: 404,
           headers: { "Content-Type": "application/json" },
         });
       }

       return new Response(JSON.stringify(entry), {
         status: 200,
         headers: { "Content-Type": "application/json" },
       });
     } catch (error) {
       console.error("Error fetching today's entry:", error);
       return new Response(
         JSON.stringify({ error: { code: "server_error", message: "Failed to retrieve today's entry" } }),
         { status: 500, headers: { "Content-Type": "application/json" } }
       );
     }
   }
   ```

### 9.3 Dokumentacja

1. Dodanie komentarzy JSDoc do kodu
