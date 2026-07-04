import { type ChatCompletionMessageParam } from 'openai';
import { isConfigured, createOpenAIClient, type OpenAIAdapter } from '@/lib/integrations/openai';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface OpenAIConfig {
  apiKey: string;
  organization?: string;
}

/**
 * Demonstrates the primary chat completion flow with full type safety.
 */
export async function exampleChatCompletion(
  messages: ChatCompletionMessageParam[],
  config?: OpenAIConfig,
): Promise<Record<string, unknown> | null> {
  if (!isConfigured(config)) return null;

  try {
    const client = createOpenAIClient(config);
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 512,
    });

    return {
      success: true,
      data: response.choices[0]?.message?.content,
      usage: response.usage,
    };
  } catch (error) {
    console.error('[OpenAI Example] Chat completion failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Demonstrates streaming response handling.
 */
export async function exampleStreaming(
  prompt: string,
  config?: OpenAIConfig,
): Promise<Record<string, unknown> | null> {
  if (!isConfigured(config)) return null;

  try {
    const client = createOpenAIClient(config);
    const stream = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: true,
    });

    let accumulatedContent = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        accumulatedContent += delta;
      }
    }

    return {
      success: true,
      data: accumulatedContent,
      type: 'streamed',
    };
  } catch (error) {
    console.error('[OpenAI Example] Streaming failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Demonstrates embedding creation with type safety.
 */
export async function exampleEmbedding(
  input: string | string[],
  config?: OpenAIConfig,
): Promise<Record<string, unknown> | null> {
  if (!isConfigured(config)) return null;

  try {
    const client = createOpenAIClient(config);
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input,
      dimensions: 1536,
    });

    return {
      success: true,
      data: response.data[0]?.embedding,
      dimension: response.data[0]?.embedding?.length || 1536,
    };
  } catch (error) {
    console.error('[OpenAI Example] Embedding failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Demonstrates a typed response wrapper for consistent handling.
 */
export interface OpenAIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  type?: 'sync' | 'streamed';
}

/**
 * Creates a typed response wrapper that can be used across the codebase.
 */
export function createOpenAIResponse<T>(
  result: OpenAIResponse<T> & { success: true },
): OpenAIResponse<T>;
export function createOpenAIResponse(
  result: OpenAIResponse & { success: false, error: string },
): OpenAIResponse;
export function createOpenAIResponse(result: unknown): OpenAIResponse {
  return {
    success: true,
    data: result as any,
  };
}

/**
 * Demonstrates a simple health check for the adapter.
 */
export async function exampleHealthCheck(
  config?: OpenAIConfig,
): Promise<Record<string, unknown> | null> {
  if (!isConfigured(config)) return null;

  try {
    const client = createOpenAIClient(config);
    // Simple health check via a lightweight request
    await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'ping' }],
      temperature: 0,
      max_tokens: 1,
    });

    return {
      success: true,
      status: 'healthy',
      latency: Date.now(),
    };
  } catch (error) {
    console.error('[OpenAI Example] Health check failed:', error);
    return {
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Demonstrates a debounced configuration check for performance.
 */
export function createDebouncedConfigCheck(
  config?: OpenAIConfig,
  delay = 100,
): () => boolean {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return async (): Promise<boolean> => {
    if (timeoutId) clearTimeout(timeoutId);

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        resolve(isConfigured(config));
      }, delay);
    });
  };
}

/**
 * Demonstrates a retry mechanism for transient failures.
 */
export async function exampleWithRetry<T>(
  operation: () => Promise<OpenAIResponse<T>>,
  retries = 3,
  backoff = 500,
): Promise<OpenAIResponse<T> | null> {
  if (!isConfigured()) return null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await operation();
      if (result.success) return result;
    } catch (error) {
      console.error(`[OpenAI Example] Attempt ${attempt} failed:`, error);

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, backoff * attempt));
      }
    }
  }

  return null;
}
