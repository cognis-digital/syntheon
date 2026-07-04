import { isConfigured } from '@/lib/integrations/zapier';
import type { Config } from '@/lib/integrations/zapier';

const EXAMPLE_CONFIG: Config = {
  apiKey: process.env.ZAPIER_API_KEY || 'demo-key',
  webhookUrl: process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/demo',
};

export async function demoCreateWebhook() {
  if (!isConfigured(EXAMPLE_CONFIG)) return;
  
  try {
    const response = await fetch(EXAMPLE_CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Zapier-API-Key': EXAMPLE_CONFIG.apiKey,
      },
      body: JSON.stringify({
        event: 'example.triggered',
        payload: { userId: 12345 },
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('demoCreateWebhook failed:', error);
    return { success: false, error };
  }
}

export async function demoGetAccountInfo() {
  if (!isConfigured(EXAMPLE_CONFIG)) return;
  
  try {
    const response = await fetch(
      `${EXAMPLE_CONFIG.webhookUrl}/account`,
      {
        headers: { 'X-Zapier-API-Key': EXAMPLE_CONFIG.apiKey },
      }
    );

    if (response.ok) {
      return { success: true, account: await response.json() };
    } else {
      throw new Error(`Account fetch failed: ${response.status}`);
    }
  } catch (error) {
    console.error('demoGetAccountInfo failed:', error);
    return { success: false, error };
  }
}

export async function demoHealthCheck() {
  if (!isConfigured(EXAMPLE_CONFIG)) return;
  
  try {
    const response = await fetch(`${EXAMPLE_CONFIG.webhookUrl}/health`, {
      headers: { 'X-Zapier-API-Key': EXAMPLE_CONFIG.apiKey },
    });

    return {
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Connected' : 'Disconnected',
    };
  } catch (error) {
    console.error('demoHealthCheck failed:', error);
    return { success: false, error };
  }
}

export async function demoRunTestFlow() {
  const results = await Promise.all([
    demoCreateWebhook(),
    demoGetAccountInfo(),
    demoHealthCheck(),
  ]);

  return {
    timestamp: new Date().toISOString(),
    configUsed: EXAMPLE_CONFIG,
    results,
  };
}
