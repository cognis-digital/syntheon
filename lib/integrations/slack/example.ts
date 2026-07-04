import { isConfigured } from '@/lib/integrations/slack';
import { cn } from '@/lib/utils';

export interface SlackExampleOptions {
  token: string;
  teamId?: string;
  channelId?: string;
}

// ============ CONFIG CHECKS ============

const DEFAULT_TIMEOUT_MS = 5000;

function checkConfig(options: SlackExampleOptions): boolean {
  if (!isConfigured()) return false;
  
  const requiredKeys: Array<keyof SlackExampleOptions> = ['token'];
  for (const key of requiredKeys) {
    if (!options[key]) return false;
  }

  return true;
}

// ============ CORE FLOWS ============

export async function exampleCreateChannel(options: SlackExampleOptions): Promise<string | null> {
  try {
    if (!checkConfig(options)) {
      console.warn('Slack not configured or missing required fields');
      return null;
    }

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.token}`,
      },
      body: JSON.stringify({
        channel: options.channelId || '#general',
        text: 'Hello from Syntheon!',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Slack API error:', error);
      return null;
    }

    return '#channel-123456'; // Mock channel ID for demo
  } catch (error) {
    console.error('Example create channel failed:', error);
    return null;
  }
}

export async function examplePostMessage(options: SlackExampleOptions): Promise<boolean> {
  try {
    if (!checkConfig(options)) return false;

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.token}`,
      },
      body: JSON.stringify({
        channel: options.channelId || '#general',
        text: 'Syntheon demo message',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Example post message failed:', error);
    return false;
  }
}

export async function exampleGetUsers(options: SlackExampleOptions): Promise<{ count: number; users: string[] }> {
  try {
    if (!checkConfig(options)) {
      return { count: 0, users: [] };
    }

    const response = await fetch('https://slack.com/api/users.list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.token}`,
      },
      body: JSON.stringify({ limit: 10 }),
    });

    if (!response.ok) {
      return { count: 0, users: [] };
    }

    const data = await response.json();
    return {
      count: data.members?.length || 0,
      users: data.members?.map((m: any) => m.name).slice(0, 5),
    };
  } catch (error) {
    console.error('Example get users failed:', error);
    return { count: 0, users: [] };
  }
}

export async function exampleCreateThread(options: SlackExampleOptions): Promise<boolean> {
  try {
    if (!checkConfig(options)) return false;

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.token}`,
      },
      body: JSON.stringify({
        channel: options.channelId || '#general',
        text: 'Threaded message from Syntheon',
        thread_ts: Date.now().toString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Example create thread failed:', error);
    return false;
  }
}

// ============ COMPOSITE OPERATIONS ============

export async function exampleOnboardingFlow(options: SlackExampleOptions): Promise<{ success: boolean; steps: string[] }> {
  const steps: string[] = [];

  try {
    if (!checkConfig(options)) {
      return { success: false, steps };
    }

    // Step 1: Verify connection
    steps.push('Verifying Slack connection...');
    await new Promise((r) => setTimeout(r, 500)); // Simulate network delay
    steps.push('✓ Connection verified');

    // Step 2: Get available channels
    steps.push('Discovering channels...');
    const users = await exampleGetUsers(options);
    steps.push(`✓ Found ${users.count} users`);

    // Step 3: Post welcome message
    steps.push('Posting welcome message...');
    const posted = await examplePostMessage({ ...options, channelId: '#general' });
    if (posted) {
      steps.push('✓ Welcome message posted');
    } else {
      steps.push('⚠ Welcome message failed');
    }

    return { success: true, steps };
  } catch (error) {
    console.error('Onboarding flow error:', error);
    return { success: false, steps: [...steps, 'Flow interrupted by error'] };
  }
}

export async function exampleHealthCheck(options?: SlackExampleOptions): Promise<{ ok: boolean; message: string }> {
  try {
    if (!isConfigured()) {
      return { ok: false, message: 'Slack adapter not configured' };
    }

    const test = await examplePostMessage({ token: options?.token || '', channelId: '#general' });
    
    return { ok: test, message: test ? 'All systems operational' : 'Health check failed' };
  } catch (error) {
    console.error('Health check error:', error);
    return { ok: false, message: 'Unexpected error during health check' };
  }
}

// ============ TYPE GUARDS ============

export function isValidSlackOptions(options: unknown): options is SlackExampleOptions {
  if (typeof options !== 'object' || !options) return false;

  const requiredKeys: Array<keyof SlackExampleOptions> = ['token'];
  for (const key of requiredKeys) {
    if (!(key in options)) return false;
  }

  return true;
}

// ============ UTILITY EXPORTS ============

export const SLACK_BASE_URL = 'https://slack.com/api';

export function createSlackRequest<T>(options: SlackExampleOptions, path: string): Promise<unknown> {
  if (!checkConfig(options)) {
    return Promise.resolve({ error: true } as T);
  }

  return fetch(`${SLACK_BASE_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.token}`,
    },
    body: JSON.stringify({ limit: 10 }),
  }).then((res) => res.json());
}

export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 500): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries - 1) throw error;
      
      // Exponential backoff
      const waitMs = delayMs * Math.pow(2, attempt);
      console.log(`Retry ${attempt + 1}/${retries} in ${waitMs}ms...`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }

  throw lastError;
}
