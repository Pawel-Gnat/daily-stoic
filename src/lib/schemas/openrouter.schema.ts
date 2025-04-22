import { z } from "zod";

export const OpenRouterConfigSchema = z.object({
  apiKey: z.string(),
  defaultModel: z.string().optional(),
});

export const ChatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().max(500),
});

export const ResponseFormatSchema = z.object({
  type: z.literal("json_schema"),
  json_schema: z.object({
    name: z.string(),
    strict: z.boolean(),
    schema: z.object({
      type: z.string(),
      properties: z.object({
        sentence: z.object({
          type: z.string(),
          description: z.string(),
        }),
      }),
      required: z.array(z.string()).default(["sentence"]),
    }),
  }),
});

export const ChatCompletionParamsSchema = z.object({
  messages: z.array(ChatMessageSchema),
  model: z.string().optional(),
  responseFormat: ResponseFormatSchema.optional(),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().positive().optional().default(500),
});

export const ChatCompletionResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  created: z.number(),
  choices: z.array(
    z.object({
      message: ChatMessageSchema,
      finish_reason: z.string(),
      index: z.number(),
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export type OpenRouterConfig = z.infer<typeof OpenRouterConfigSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ResponseFormat = z.infer<typeof ResponseFormatSchema>;
export type ChatCompletionParams = z.infer<typeof ChatCompletionParamsSchema>;
export type ChatCompletionResponse = z.infer<typeof ChatCompletionResponseSchema>;
