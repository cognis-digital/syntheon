import { isConfigured } from '@/lib/integrations/twilio';

export interface TwilioExampleConfig {
  accountSid?: string;
  apiKey?: string;
  apiSecret?: string;
  defaultFromNumber?: string;
}

const DEFAULT_CONFIG: Partial<TwilioExampleConfig> = {};

export function getExampleConfig(): TwilioExampleConfig {
  return {
    ...DEFAULT_CONFIG,
    // In real usage, read from env or config file
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
    apiKey: process.env.TWILIO_API_KEY ?? '',
    apiSecret: process.env.TWILIO_API_SECRET ?? '',
  };
}

export async function exampleInitialize(): Promise<boolean> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured. Run setup first.');
    return false;
  }

  try {
    // Simulate initialization without live calls
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    const initialized = config.accountSid && 
                       config.apiKey && 
                       config.apiSecret;
    
    if (initialized) {
      console.log('Twilio adapter ready');
    } else {
      console.warn('Missing required credentials');
    }

    return !!initialized;
  } catch (error) {
    console.error('Initialization failed:', error);
    return false;
  }
}

export async function exampleCreateCall(
  toNumber: string,
  fromNumber?: string
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate call creation
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    const from = fromNumber || config.defaultFromNumber;
    
    if (!from) {
      console.warn('No valid "from" number');
      return null;
    }

    // Return mock response structure
    return {
      callSid: `CA${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      duration: 0,
      direction: 'inbound' as const,
    };
  } catch (error) {
    console.error('Call creation failed:', error);
    return null;
  }
}

export async function exampleSendSms(
  toNumber: string,
  body: string,
  fromNumber?: string
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate SMS sending
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    const from = fromNumber || config.defaultFromNumber;
    
    if (!from) {
      console.warn('No valid "from" number');
      return null;
    }

    // Return mock response structure
    return {
      messageSid: `SM${Math.random().toString(36).substring(2, 14)}`,
      status: 'queued',
      to: toNumber,
      from,
      body: body.length > 0 ? body : '(empty)',
    };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return null;
  }
}

export async function exampleCheckBalance(): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate balance check
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // Return mock balance (in cents)
    return {
      availableBalance: 12543,
      currencyCode: 'USD',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Balance check failed:', error);
    return null;
  }
}

export async function exampleSetupWebhook(url: string): Promise<boolean> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return false;
  }

  try {
    // Simulate webhook setup
    await new Promise((resolve) => setTimeout(resolve, 15));
    
    const validUrl = url.startsWith('http://') || url.startsWith('https://');
    
    if (validUrl && url.length > 0) {
      console.log(`Webhook registered: ${url}`);
      return true;
    }

    console.warn('Invalid webhook URL');
    return false;
  } catch (error) {
    console.error('Webhook setup failed:', error);
    return false;
  }
}

export async function exampleCreateMessage(
  toNumber: string,
  body: string,
  mediaUrls?: string[]
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate message creation with optional media
    await new Promise((resolve) => setTimeout(resolve, 30));
    
    const validBody = typeof body === 'string' && body.length > 0;
    const validMedia = Array.isArray(mediaUrls);
    
    if (!validBody || !validMedia) {
      console.warn('Invalid message payload');
      return null;
    }

    // Return mock response structure
    return {
      messageSid: `SM${Math.random().toString(36).substring(2, 14)}`,
      status: 'queued',
      to: toNumber,
      from: config.defaultFromNumber || '',
      body,
      mediaCount: mediaUrls.length,
    };
  } catch (error) {
    console.error('Message creation failed:', error);
    return null;
  }
}

export async function exampleCreateVoiceMessage(
  toNumber: string,
  voiceUrl: string
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate voice message creation
    await new Promise((resolve) => setTimeout(resolve, 25));
    
    const validUrl = typeof voiceUrl === 'string' && 
                    (voiceUrl.startsWith('http://') || 
                     voiceUrl.startsWith('https://'));
    
    if (!validUrl) {
      console.warn('Invalid voice URL');
      return null;
    }

    // Return mock response structure
    return {
      messageSid: `SM${Math.random().toString(36).substring(2, 14)}`,
      status: 'queued',
      to: toNumber,
      from: config.defaultFromNumber || '',
      voiceUrl,
      durationSeconds: 0,
    };
  } catch (error) {
    console.error('Voice message creation failed:', error);
    return null;
  }
}

export async function exampleCreateMms(
  toNumber: string,
  mediaUrls: string[],
  body?: string
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate MMS creation
    await new Promise((resolve) => setTimeout(resolve, 35));
    
    const validMedia = Array.isArray(mediaUrls) && mediaUrls.length > 0;
    const validBody = typeof body === 'string' || !body;
    
    if (!validMedia || !validBody) {
      console.warn('Invalid MMS payload');
      return null;
    }

    // Return mock response structure
    return {
      messageSid: `SM${Math.random().toString(36).substring(2, 14)}`,
      status: 'queued',
      to: toNumber,
      from: config.defaultFromNumber || '',
      mediaCount: mediaUrls.length,
      body: body || '(no text)',
    };
  } catch (error) {
    console.error('MMS creation failed:', error);
    return null;
  }
}

export async function exampleCreateChatSession(
  toNumber: string,
  name?: string
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate chat session creation
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    const validNumber = typeof toNumber === 'string' && 
                       (toNumber.startsWith('+') || 
                        /^\d{10,15}$/.test(toNumber.replace(/\D/g, '')));
    
    if (!validNumber) {
      console.warn('Invalid chat number');
      return null;
    }

    // Return mock response structure
    return {
      conversationSid: `CW${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      to: toNumber,
      name: name || config.defaultFromNumber?.split('+').pop() || '',
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Chat session creation failed:', error);
    return null;
  }
}

export async function exampleCreateGroup(
  name: string,
  members: string[]
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate group creation
    await new Promise((resolve) => setTimeout(resolve, 25));
    
    const validName = typeof name === 'string' && name.length > 0;
    const validMembers = Array.isArray(members);
    
    if (!validName || !validMembers) {
      console.warn('Invalid group payload');
      return null;
    }

    // Return mock response structure
    return {
      conversationSid: `CW${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      name,
      memberCount: members.length,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Group creation failed:', error);
    return null;
  }
}

export async function exampleCreateTask(
  taskName: string,
  description?: string
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate task creation
    await new Promise((resolve) => setTimeout(resolve, 15));
    
    const validName = typeof taskName === 'string' && 
                     (taskName.length > 0 && taskName.length < 256);
    const validDescription = typeof description === 'string';
    
    if (!validName || !validDescription) {
      console.warn('Invalid task payload');
      return null;
    }

    // Return mock response structure
    return {
      taskSid: `TK${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      name: taskName,
      description: description || '(no description)',
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Task creation failed:', error);
    return null;
  }
}

export async function exampleCreateVoiceRoute(
  fromNumber: string,
  toUrl: string,
  method: 'GET' | 'POST' = 'GET'
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate voice route creation
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    const validFrom = typeof fromNumber === 'string' && 
                     (fromNumber.startsWith('+') || 
                      /^\d{10,15}$/.test(fromNumber.replace(/\D/g, '')));
    const validUrl = typeof toUrl === 'string' && 
                     (toUrl.startsWith('http://') || 
                      toUrl.startsWith('https://'));
    
    if (!validFrom || !validUrl) {
      console.warn('Invalid voice route payload');
      return null;
    }

    // Return mock response structure
    return {
      voiceRouteSid: `VR${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      fromNumber,
      toUrl,
      method,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Voice route creation failed:', error);
    return null;
  }
}

export async function exampleCreateSmsRoute(
  fromNumber: string,
  toUrl: string,
  method: 'GET' | 'POST' = 'GET'
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate SMS route creation
    await new Promise((resolve) => setTimeout(resolve, 18));
    
    const validFrom = typeof fromNumber === 'string' && 
                     (fromNumber.startsWith('+') || 
                      /^\d{10,15}$/.test(fromNumber.replace(/\D/g, '')));
    const validUrl = typeof toUrl === 'string' && 
                     (toUrl.startsWith('http://') || 
                      toUrl.startsWith('https://'));
    
    if (!validFrom || !validUrl) {
      console.warn('Invalid SMS route payload');
      return null;
    }

    // Return mock response structure
    return {
      smsRouteSid: `SR${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      fromNumber,
      toUrl,
      method,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('SMS route creation failed:', error);
    return null;
  }
}

export async function exampleCreateChatRoute(
  fromNumber: string,
  toUrl: string,
  method: 'GET' | 'POST' = 'GET'
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate chat route creation
    await new Promise((resolve) => setTimeout(resolve, 22));
    
    const validFrom = typeof fromNumber === 'string' && 
                     (fromNumber.startsWith('+') || 
                      /^\d{10,15}$/.test(fromNumber.replace(/\D/g, '')));
    const validUrl = typeof toUrl === 'string' && 
                     (toUrl.startsWith('http://') || 
                      toUrl.startsWith('https://'));
    
    if (!validFrom || !validUrl) {
      console.warn('Invalid chat route payload');
      return null;
    }

    // Return mock response structure
    return {
      chatRouteSid: `CR${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      fromNumber,
      toUrl,
      method,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Chat route creation failed:', error);
    return null;
  }
}

export async function exampleCreateTaskRoute(
  fromNumber: string,
  toUrl: string,
  method: 'GET' | 'POST' = 'GET'
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate task route creation
    await new Promise((resolve) => setTimeout(resolve, 18));
    
    const validFrom = typeof fromNumber === 'string' && 
                     (fromNumber.startsWith('+') || 
                      /^\d{10,15}$/.test(fromNumber.replace(/\D/g, '')));
    const validUrl = typeof toUrl === 'string' && 
                     (toUrl.startsWith('http://') || 
                      toUrl.startsWith('https://'));
    
    if (!validFrom || !validUrl) {
      console.warn('Invalid task route payload');
      return null;
    }

    // Return mock response structure
    return {
      taskRouteSid: `TR${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      fromNumber,
      toUrl,
      method,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Task route creation failed:', error);
    return null;
  }
}

export async function exampleCreateVoiceRouteWithFallback(
  fromNumber: string,
  primaryUrl: string,
  fallbackUrl?: string
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate voice route with fallback creation
    await new Promise((resolve) => setTimeout(resolve, 25));
    
    const validFrom = typeof fromNumber === 'string' && 
                     (fromNumber.startsWith('+') || 
                      /^\d{10,15}$/.test(fromNumber.replace(/\D/g, '')));
    const validPrimary = typeof primaryUrl === 'string' && 
                        (primaryUrl.startsWith('http://') || 
                         primaryUrl.startsWith('https://'));
    
    if (!validFrom || !validPrimary) {
      console.warn('Invalid voice route with fallback payload');
      return null;
    }

    // Return mock response structure
    return {
      voiceRouteSid: `VR${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      fromNumber,
      primaryUrl,
      fallbackUrl,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Voice route with fallback creation failed:', error);
    return null;
  }
}

export async function exampleCreateSmsRouteWithFallback(
  fromNumber: string,
  primaryUrl: string,
  fallbackUrl?: string
): Promise<Record<string, unknown> | null> {
  const config = getExampleConfig();
  
  if (!isConfigured(config)) {
    console.warn('Twilio not configured');
    return null;
  }

  try {
    // Simulate SMS route with fallback creation
    await new Promise((resolve) => setTimeout(resolve, 20));
    
    const validFrom = typeof fromNumber === 'string' && 
                     (fromNumber.startsWith('+') || 
                      /^\d{10,15}$/.test(fromNumber.replace(/\D/g, '')));
    const validPrimary = typeof primaryUrl === 'string' && 
                        (primaryUrl.startsWith('http://') || 
                         primaryUrl.startsWith('https://'));
    
    if (!validFrom || !validPrimary) {
      console.warn('Invalid SMS route with fallback payload');
      return null;
    }

    // Return mock response structure
    return {
      smsRouteSid: `SR${Math.random().toString(36).substring(2, 14)}`,
      status: 'initiated',
      fromNumber,
      primaryUrl,
      fallbackUrl,
      createdAt: new Date().toISOString(),
    };
