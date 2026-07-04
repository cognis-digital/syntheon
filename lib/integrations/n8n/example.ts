import { isConfigured, execute, createWebhook } from '@/lib/integrations/n8n';

const N8N_TIMEOUT_MS = 10_000;

export type N8nExampleOptions = {
  webhookPath?: string;
  timeoutMs?: number;
};

export function isN8nReady(options: N8nExampleOptions = {}) {
  if (!isConfigured()) return false;
  
  const { webhookPath, timeoutMs } = options;
  if (webhookPath) {
    try {
      // Validate webhook path format
      new URL(webhookPath);
    } catch {
      console.warn('Invalid webhook path:', webhookPath);
    }
  }
  
  return true;
}

export async function executeExampleFlow(
  options: N8nExampleOptions = {}
): Promise<{ success: boolean; data?: unknown; error?: Error }> {
  if (!isN8nReady(options)) {
    return { success: false, error: new Error('n8n not configured') };
  }

  try {
    const result = await execute({ timeoutMs: options.timeoutMs });
    
    // Type-safe assertion for expected response shape
    if (result && typeof result === 'object' && 'success' in result) {
      return { success: true, data: result };
    }

    throw new Error('Unexpected response format from n8n');
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('[N8N Example] Flow execution failed:', err);
    
    return { success: false, error };
  }
}

export async function setupWebhookExample(
  path: string,
  options: N8nExampleOptions = {}
): Promise<{ url: string; id?: string }> {
  if (!isN8nReady(options)) {
    return { url: '', error: new Error('n8n not configured') };
  }

  try {
    const webhook = await createWebhook({ path });
    
    // Defensive check for expected properties
    if (webhook && typeof webhook === 'object' && 'url' in webhook) {
      return { url: String(webhook.url), id: webhook.id };
    }

    throw new Error('Webhook creation returned unexpected format');
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('[N8N Example] Webhook setup failed:', err);
    
    return { url: '', id: undefined, error: err };
  }
}

export async function healthCheck(): Promise<{ status: 'ok' | 'degraded' | 'down'; message?: string }> {
  if (!isConfigured()) {
    return { status: 'down', message: 'n8n adapter not configured' };
  }

  try {
    // Quick connectivity check without full execution
    const timeout = setTimeout(() => {
      throw new Error('Health check timeout');
    }, N8N_TIMEOUT_MS);

    await Promise.race([
      execute({ timeoutMs: 100 }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), N8N_TIMEOUT_MS - 50);
      })
    ]);

    clearTimeout(timeout);
    
    return { status: 'ok' };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('[N8N Example] Health check failed:', err);
    
    // Distinguish between timeout and actual failure
    if ((err as Error).message.includes('timeout')) {
      return { status: 'degraded', message: 'n8n responding slowly' };
    }

    return { status: 'down', message: err.message };
  }
}

export const DEFAULT_OPTIONS: N8nExampleOptions = {
  timeoutMs: N8N_TIMEOUT_MS,
};
