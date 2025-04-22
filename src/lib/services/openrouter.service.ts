import {
  type OpenRouterConfig,
  type ChatCompletionParams,
  type ChatCompletionResponse,
  type ChatMessage,
  ChatCompletionParamsSchema,
  ChatCompletionResponseSchema,
  OpenRouterConfigSchema,
} from "@/lib/schemas/openrouter.schema";

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: OpenRouterConfig) {
    const validatedConfig = OpenRouterConfigSchema.parse(config);
    this.apiKey = validatedConfig.apiKey;
    this.baseUrl = "https://openrouter.ai/api/v1";
    this.defaultModel = validatedConfig.defaultModel || "openai/gpt-4o-mini";
  }

  public async createChatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
    const validatedParams = ChatCompletionParamsSchema.parse({
      ...params,
      model: params.model || this.defaultModel,
      responseFormat: {
        type: "json_schema",
        json_schema: {
          name: "stoic_sentence",
          strict: true,
          schema: {
            type: "object",
            properties: {
              sentence: {
                type: "string",
                description: "Generated stoic sentence based on user's reflection",
              },
            },
            required: ["sentence"],
          },
        },
      },
    });

    try {
      const response = await this.makeRequest("/chat/completions", validatedParams);
      const data = await this.parseResponse(response);

      return ChatCompletionResponseSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new OpenRouterError(`Chat completion failed: ${error.message}`, "COMPLETION_ERROR", 500);
      }
      throw error;
    }
  }

  public createSystemMessage(content: string): ChatMessage {
    return {
      role: "system",
      content: content,
    };
  }

  public createUserMessage(content: string): ChatMessage {
    return {
      role: "user",
      content: content,
    };
  }

  private async makeRequest(endpoint: string, payload: ChatCompletionParams): Promise<Response> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: payload.model,
          messages: payload.messages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new OpenRouterError(errorText, response.statusText, response.status);
      }

      return response;
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new OpenRouterError("Failed to connect to OpenRouter API", "NETWORK_ERROR", 500);
    }
  }

  private async parseResponse(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch (error) {
      console.error("Failed to parse API response", error);
      throw new OpenRouterError("Failed to parse API response", "PARSE_ERROR", 500);
    }
  }
}
