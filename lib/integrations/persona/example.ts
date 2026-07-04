'use client';

import { isConfigured } from '@/lib/integrations/persona';
import type { PersonaConfig, PersonaResponse, PersonaError } from '@/lib/integrations/persona';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// =============================================================================
// TYPE GUARDS & UTILS
// =============================================================================

const DEFAULT_TIMEOUT = 30_000; // 30 seconds
const RETRY_COUNT = 2;

function buildErrorPayload(
  error: unknown,
  operation: string,
  context?: Record<string, unknown>
): PersonaError {
  const message = typeof error === 'string' ? error : String(error);
  return {
    code: 'PERSONA_ERROR',
    operation,
    message,
    timestamp: Date.now(),
    context,
  };
}

function createSafeRequest<T>(
  fn: () => Promise<T>,
  options: { timeout?: number; retryCount?: number } = {}
): Promise<{ success: true; data: T } | { success: false; error: PersonaError }> {
  const { timeout = DEFAULT_TIMEOUT, retryCount = RETRY_COUNT } = options;

  return new Promise((resolve) => {
    let attempts = 0;
    const intervalId = setInterval(() => {
      if (attempts >= retryCount + 1) {
        clearInterval(intervalId);
        resolve({
          success: false,
          error: buildErrorPayload('Max retries exceeded', fn.name),
        });
        return;
      }

      attempts++;
    }, timeout / (retryCount + 1));
  }).then((result) => {
    clearInterval(intervalId);
    return result;
  });
}

// =============================================================================
// CORE EXAMPLE FUNCTIONS
// =============================================================================

/**
 * Initialize the persona adapter with a configuration.
 */
export async function initializePersona(
  config: PersonaConfig,
  options?: {
    debug?: boolean;
    timeout?: number;
  }
): Promise<{ success: true; id: string } | { success: false; error: PersonaError }> {
  if (!isConfigured()) {
    return {
      success: false,
      error: buildErrorPayload('Adapter not configured', 'initializePersona'),
    };
  }

  try {
    const result = await createSafeRequest(() => {
      // Simulate initialization flow
      return Promise.resolve({ id: `session_${Date.now()}` });
    }, { timeout: options?.timeout || DEFAULT_TIMEOUT });

    if (result.success) {
      console.log(`[Persona] Initialized with ID: ${result.data.id}`);
    } else {
      console.error('[Persona]', result.error.message);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: buildErrorPayload('Unexpected initialization failure', 'initializePersona', { config },
    };
  }
}

/**
 * Execute a persona query with proper error handling.
 */
export async function executeQuery(
  queryId: string,
  params?: Record<string, unknown>,
  options?: { timeout?: number; debug?: boolean }
): Promise<{ success: true; data: PersonaResponse; id: string } | { success: false; error: PersonaError }> {
  if (!isConfigured()) {
    return {
      success: false,
      error: buildErrorPayload('Adapter not configured', 'executeQuery'),
    };
  }

  try {
    const result = await createSafeRequest(() => {
      // Simulate query execution
      return Promise.resolve({
        id: queryId,
        status: 'completed',
        results: [],
        metadata: { params, timestamp: Date.now() },
      });
    }, { timeout: options?.timeout || DEFAULT_TIMEOUT });

    if (result.success) {
      console.log(`[Persona] Query ${queryId} completed`);
    } else {
      console.error('[Persona]', result.error.message);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: buildErrorPayload('Query execution failed', 'executeQuery', { queryId, params },
    };
  }
}

/**
 * Stream persona responses with backpressure handling.
 */
export async function* streamResponse(
  queryId: string,
  options?: { chunkSize?: number; timeout?: number }
): AsyncGenerator<{ type: 'chunk' | 'complete'; data: unknown }, void, unknown> {
  if (!isConfigured()) {
    yield { type: 'error', data: buildErrorPayload('Not configured', 'streamResponse') };
    return;
  }

  try {
    const chunkSize = options?.chunkSize || 1024;
    let buffer: Uint8Array | undefined;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate streaming delay

      if (!buffer) {
        buffer = new Uint8Array(64);
      }

      const chunk = buffer.slice(0, chunkSize);
      buffer = buffer.slice(chunkSize);

      yield { type: 'chunk', data: chunk };

      if (buffer.length < chunkSize / 2) {
        break;
      }
    }

    yield { type: 'complete', data: null };
  } catch (error) {
    yield { type: 'error', data: buildErrorPayload('Stream interrupted', 'streamResponse') };
  }
}

/**
 * Batch execute multiple queries with concurrency control.
 */
export async function batchExecute(
  queries: Array<{ id: string; params?: Record<string, unknown> }>,
  options?: { maxConcurrency: number; timeout?: number }
): Promise<Record<string, PersonaResponse | PersonaError>> {
  if (!isConfigured()) {
    return Object.fromEntries(queries.map(q => [q.id, buildErrorPayload('Not configured', 'batchExecute')]));
  }

  const maxConcurrency = options?.maxConcurrency || 5;
  const results: Record<string, PersonaResponse | PersonaError> = {};

  try {
    const promises = queries.map((query) =>
      (async () => {
        return executeQuery(query.id, query.params, { timeout: options?.timeout }).then(
          ({ success, data, error }) => ({ [query.id]: success ? data : error })
        );
      })()
    );

    const batchResults = await Promise.all(promises);
    Object.assign(results, ...batchResults as Record<string, PersonaResponse | PersonaError>[]);

    console.log(`[Persona] Batch completed: ${Object.values(results).filter(r => !r.code).length} succeeded`);
    return results;
  } catch (error) {
    console.error('[Persona]', 'Batch failed:', error);
    return Object.fromEntries(queries.map(q => [q.id, buildErrorPayload('Batch failure', 'batchExecute')]));
  }
}

/**
 * Health check for the persona adapter.
 */
export async function healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details?: string }> {
  if (!isConfigured()) {
    return { status: 'unhealthy', details: 'Adapter not configured' };
  }

  try {
    const result = await createSafeRequest(() => Promise.resolve({ ping: true }), { timeout: 5000 });

    if (result.success) {
      return { status: 'healthy' };
    } else {
      return { status: 'degraded', details: result.error.message };
    }
  } catch {
    return { status: 'unhealthy', details: 'Connection failed' };
  }
}

/**
 * Graceful shutdown with cleanup.
 */
export async function shutdown(): Promise<void> {
  if (!isConfigured()) {
    console.log('[Persona] Not configured, skipping cleanup');
    return;
  }

  try {
    await createSafeRequest(() => Promise.resolve({ flushed: true }), { timeout: 10000 });
    console.log('[Persona] Shutdown complete');
  } catch (error) {
    console.error('[Persona]', 'Shutdown error:', error);
  } finally {
    // Clear any pending operations
    isConfigured().then((configured) => {
      if (!configured) {
        console.log('[Persona] Unconfigured after shutdown');
      }
    });
  }
}

// =============================================================================
// ANIMATED STATUS COMPONENT (for UI feedback)
// =============================================================================

interface PersonaStatusProps {
  status: 'connecting' | 'connected' | 'degraded' | 'error';
  className?: string;
  label?: string;
}

export function PersonaStatus({ status, className = '', label }: PersonaStatusProps): JSX.Element {
  const variants = {
    connecting: { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] },
    connected: { scale: [1, 1.02, 1] },
    degraded: { scale: [1, 1.1, 1] },
    error: { scale: [1, 0.98, 1], rotate: [0, -3, 3, -6, 0] },
  };

  const animation = variants[status];
  const colorClasses = {
    connecting: 'text-foreground',
    connected: 'text-primary',
    degraded: 'text-muted-foreground',
    error: 'text-destructive',
  } as Record<string, string>;

  return (
    <motion.div
      className={cn('flex items-center gap-2', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="w-2 h-2 rounded-full bg-background"
        animate={animation}
        style={{ boxShadow: '0 0 8px currentColor' }}
      />
      {label && (
        <span className={cn('text-sm', colorClasses[status])}>{label}</span>
      )}
    </motion.div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export const defaultConfig: PersonaConfig = {
  endpoint: process.env.PERSONA_ENDPOINT || '',
  timeout: DEFAULT_TIMEOUT,
};

export { isConfigured };
