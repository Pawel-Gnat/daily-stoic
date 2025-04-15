# Przewodnik Implementacji Usługi OpenRouter

## 1. Opis Usługi

Usługa OpenRouter będzie działać jako pomost między naszą aplikacją a API OpenRouter, zapewniając czysty interfejs do funkcjonalności czatu opartego na LLM. Usługa ta będzie obsługiwać całą komunikację z API OpenRouter, bezpiecznie zarządzać kluczami API i dostarczać ustrukturyzowane odpowiedzi dla naszych komponentów frontendowych.

## 2. Projekt Konstruktora

```typescript
class OpenRouterService {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = "https://openrouter.ai/api/v1";
    this.defaultModel = config.defaultModel || "openai/gpt-4o-mini";
  }
}
```

## 3. Metody i Pola Publiczne

### 3.1 Metoda Kompletacji Czatu

```typescript
async createChatCompletion({
  messages,
  model = this.defaultModel,
  responseFormat,
  temperature = 0.7,
  maxTokens,
}: ChatCompletionParams): Promise<ChatCompletionResponse> {
  // Szczegóły implementacji w sekcji 7
}
```

## 4. Metody i Pola Prywatne

### 4.1 Obsługa Żądań

```typescript
private async makeRequest(endpoint: string, payload: any): Promise<Response>
```

### 4.2 Parser Odpowiedzi

```typescript
private parseResponse(response: Response): Promise<any>
```

## 5. Obsługa Błędów

### 5.1 Niestandardowe Typy Błędów

```typescript
class OpenRouterError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
  }
}
```

### 5.2 Kategorie Błędów

1. Błędy Uwierzytelniania (401)
2. Przekroczenie Limitu Żądań (429)
3. Nieprawidłowe Dane Wejściowe (400)
4. Błędy Serwera (500)
5. Błędy Sieci

## 6. Kwestie Bezpieczeństwa

1. Zarządzanie Kluczem API

   - Przechowywanie w zmiennych środowiskowych
   - Nigdy nie ujawniać w kodzie po stronie klienta
   - Wdrożenie mechanizmu rotacji kluczy

2. Walidacja Żądań/Odpowiedzi

   - Walidacja wszystkich danych wejściowych przed wysłaniem do API
   - Sanityzacja odpowiedzi przed przetworzeniem

3. Limitowanie Żądań
   - Implementacja limitowania po stronie klienta
   - Konfiguracja alertów dla nietypowych wzorców

## 7. Plan Implementacji Krok po Kroku

### 7.1 Początkowa Konfiguracja

1. Utworzenie katalogu usługi:

   ```bash
   mkdir -p src/lib/services/openrouter
   ```

2. Utworzenie definicji typów:

   ```typescript
   // src/types/openrouter.ts
   export interface OpenRouterConfig {
     apiKey: string;
     defaultModel?: string;
   }

   export interface ChatCompletionParams {
     messages: ChatMessage[];
     model: string;
     responseFormat?: ResponseFormat;
     temperature?: number;
     maxTokens?: number;
   }
   ```

### 7.2 Implementacja Głównej Usługi

1. Utworzenie pliku bazowego usługi:

   ```typescript
   // src/lib/services/openrouter/index.ts
   import { OpenRouterConfig, ChatCompletionParams } from "@/types/openrouter";

   export class OpenRouterService {
     // Konstruktor i metody jak zdefiniowano powyżej
   }
   ```

2. Implementacja obsługi żądań:

   ```typescript
   private async makeRequest(endpoint: string, payload: any): Promise<Response> {
     const response = await fetch(`${this.baseUrl}${endpoint}`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${this.apiKey}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(payload),
     });

     if (!response.ok) {
       throw new OpenRouterError(
         await response.text(),
         response.statusText,
         response.status
       );
     }

     return response;
   }
   ```

### 7.3 Formatowanie Wiadomości

Przykład wiadomości systemowej:

```typescript
const systemMessage = {
  role: "system",
  content: "Jestem pomocnym asystentem AI, skupiającym się na dostarczaniu jasnych i dokładnych informacji.",
};
```

Przykład wiadomości użytkownika:

```typescript
const userMessage = {
  role: "user",
  content: "Jaka jest stolica Francji?",
};
```

### 7.4 Implementacja Formatu Odpowiedzi

Przykład formatu schematu JSON:

```typescript
const responseFormat = {
  type: "json_schema",
  json_schema: {
    name: "location_response",
    strict: true,
    schema: {
      type: "object",
      properties: {
        miasto: { type: "string" },
        kraj: { type: "string" },
        opis: { type: "string" },
      },
      required: ["miasto", "kraj"],
    },
  },
};
```

### 7.5 Integracja z Frontendem

1. Utworzenie hooka usługi:

   ```typescript
   // src/lib/hooks/useOpenRouter.ts
   import { OpenRouterService } from "@/lib/services/openrouter";

   export const useOpenRouter = () => {
     const service = new OpenRouterService({
       apiKey: import.meta.env.OPENROUTER_API_KEY,
     });

     return {
       sendMessage: async (message: string) => {
         // Implementacja
       },
     };
   };
   ```

### 7.6 Implementacja Obsługi Błędów

```typescript
try {
  const response = await openRouterService.createChatCompletion({
    messages: [systemMessage, userMessage],
    responseFormat,
  });
} catch (error) {
  if (error instanceof OpenRouterError) {
    switch (error.status) {
      case 401:
        // Obsługa błędu uwierzytelniania
        break;
      case 429:
        // Obsługa przekroczenia limitu
        break;
      // Obsługa innych przypadków
    }
  }
}
```
