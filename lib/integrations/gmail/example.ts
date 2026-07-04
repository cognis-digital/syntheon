import { isConfigured } from '@/lib/integrations/gmail';

export async function demoOAuthFlow() {
  if (!isConfigured()) {
    console.log('Gmail OAuth not configured');
    return;
  }

  try {
    // Simulate getting auth URL (no live call)
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...' + 
      '&redirect_uri=http://localhost:3000/callback&scope=email read';
    
    console.log('OAuth flow ready:', authUrl);
  } catch (error) {
    console.error('OAuth setup failed', error);
  }
}

export async function demoFetchEmails() {
  if (!isConfigured()) return;

  try {
    // Simulate fetching emails with pagination
    const page = 1;
    const limit = 50;
    
    console.log(`Fetching emails... page: ${page}, limit: ${limit}`);
    
    // Return mock structure matching real API response shape
    return {
      nextPageToken: null,
      messages: [
        { id: 'msg-1', snippet: 'Meeting at 3pm...', threads: [] },
        { id: 'msg-2', snippet: 'Invoice #12345...', threads: [] }
      ]
    };
  } catch (error) {
    console.error('Fetch failed:', error);
    throw new Error('Failed to fetch emails');
  }
}

export async function demoSendEmail() {
  if (!isConfigured()) return;

  try {
    const recipient = 'user@example.com';
    const subject = 'Test Email';
    const body = 'Hello from Syntheon!';
    
    console.log(`Sending to ${recipient}...`);
    
    // Return mock response
    return { id: 'msg-new', status: 'sent' };
  } catch (error) {
    console.error('Send failed:', error);
    throw new Error('Failed to send email');
  }
}

export async function demoCheckQuota() {
  if (!isConfigured()) return;

  try {
    // Simulate quota check
    const usage = {
      dailyLimit: 500,
      usedToday: 127,
      remaining: 373
    };
    
    console.log('Quota status:', usage);
    return usage;
  } catch (error) {
    console.error('Quota check failed:', error);
    throw new Error('Failed to check quota');
  }
}

export async function demoSetupWebhook() {
  if (!isConfigured()) return;

  try {
    const webhookUrl = 'https://api.syntheon.com/webhooks/gmail';
    
    console.log('Setting up webhook...', webhookUrl);
    
    // Return mock setup result
    return { 
      id: 'webhook-123', 
      url: webhookUrl, 
      events: ['email.send', 'email.receive'] 
    };
  } catch (error) {
    console.error('Webhook setup failed:', error);
    throw new Error('Failed to set up webhook');
  }
}

export async function demoCleanup() {
  if (!isConfigured()) return;

  try {
    // Simulate cleanup tasks
    const tasks = [
      'Clear temp tokens',
      'Reset connection pool',
      'Validate credentials'
    ];
    
    console.log('Running cleanup:', tasks.join(', '));
    return true;
  } catch (error) {
    console.error('Cleanup failed:', error);
    throw new Error('Failed to clean up');
  }
}

export async function demoHealthCheck() {
  if (!isConfigured()) return false;

  try {
    // Simulate health check
    const status = 'healthy';
    const latencyMs = 45;
    
    console.log('Health:', status, `(${latencyMs}ms)`);
    return { status, latencyMs };
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Failed health check');
  }
}

export async function demoBulkOperations() {
  if (!isConfigured()) return;

  try {
    const batchSize = 100;
    
    console.log(`Processing batch of ${batchSize} items...`);
    
    // Simulate bulk operation progress
    for (let i = 0; i < batchSize; i++) {
      await new Promise(resolve => setTimeout(resolve, 1));
    }
    
    return { processed: batchSize, success: true };
  } catch (error) {
    console.error('Bulk operation failed:', error);
    throw new Error('Failed bulk operation');
  }
}

export async function demoRateLimitHandling() {
  if (!isConfigured()) return;

  try {
    // Simulate rate limit response handling
    const headers = {
      'X-Gmail-Quota': 373,
      'Retry-After': 60
    };
    
    console.log('Rate limit status:', headers);
    return headers;
  } catch (error) {
    console.error('Rate limit handling failed:', error);
    throw new Error('Failed rate limit handling');
  }
}

export async function demoSessionManagement() {
  if (!isConfigured()) return;

  try {
    // Simulate session lifecycle
    const sessions = [
      { id: 'sess-1', expiresAt: Date.now() + 3600000, active: true },
      { id: 'sess-2', expiresAt: Date.now() - 4000, active: false }
    ];
    
    console.log('Active sessions:', sessions.filter(s => s.active).length);
    return sessions;
  } catch (error) {
    console.error('Session management failed:', error);
    throw new Error('Failed session management');
  }
}

export async function demoErrorRecovery() {
  if (!isConfigured()) return;

  try {
    // Simulate retry with exponential backoff
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      attempt++;
      
      console.log(`Retry ${attempt}/${maxRetries}...`);
      
      if (Math.random() > 0.5) {
        return { success: true, attempts: attempt };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
    
    throw new Error('Max retries exceeded');
  } catch (error) {
    console.error('Error recovery failed:', error);
    throw new Error('Failed error recovery');
  }
}

export async function demoLogging() {
  if (!isConfigured()) return;

  try {
    // Simulate structured logging
    const logEntry = {
      level: 'info',
      service: 'gmail-adapter',
      timestamp: new Date().toISOString(),
      context: { operation: 'demo' }
    };
    
    console.log('Log entry:', JSON.stringify(logEntry, null, 2));
    return logEntry;
  } catch (error) {
    console.error('Logging failed:', error);
    throw new Error('Failed logging');
  }
}

export async function demoMetrics() {
  if (!isConfigured()) return;

  try {
    // Simulate metrics collection
    const metrics = {
      requests: 1247,
      errors: 3,
      avgLatencyMs: 89,
      successRate: 0.9976
    };
    
    console.log('Metrics:', metrics);
    return metrics;
  } catch (error) {
    console.error('Metrics collection failed:', error);
    throw new Error('Failed metrics collection');
  }
}

export async function demoFullWorkflow() {
  if (!isConfigured()) return;

  try {
    // Simulate complete workflow: init → fetch → process → send → cleanup
    
    console.log('Starting full workflow...');
    
    const steps = [
      'Health check',
      'Fetch emails (10)',
      'Process attachments',
      'Send notifications',
      'Update status'
    ];
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 5));
      console.log(`  → ${step}`);
    }
    
    return { completed: true, durationMs: 127 };
  } catch (error) {
    console.error('Full workflow failed:', error);
    throw new Error('Failed full workflow');
  }
}

export async function demoConditionalExecution() {
  if (!isConfigured()) return;

  try {
    // Simulate conditional operations based on state
    
    const conditions = [
      { name: 'hasAttachments', check: () => true },
      { name: 'highPriority', check: () => false }
    ];
    
    console.log('Evaluating conditions...');
    
    for (const cond of conditions) {
      if (cond.check()) {
        console.log(`  → ${cond.name}: enabled`);
      } else {
        console.log(`  → ${cond.name}: disabled`);
      }
    }
    
    return conditions;
  } catch (error) {
    console.error('Conditional execution failed:', error);
    throw new Error('Failed conditional execution');
  }
}

export async function demoBatchedProcessing() {
  if (!isConfigured()) return;

  try {
    // Simulate batch processing with progress tracking
    
    const items = Array.from({ length: 25 }, (_, i) => ({ id: `item-${i}` }));
    
    console.log('Processing in batches...');
    
    const batchSize = 10;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      await new Promise(resolve => setTimeout(resolve, 2));
      
      console.log(`  → Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)} (${batch.length} items)`);
    }
    
    return { total: items.length, batches: Math.ceil(items.length / batchSize) };
  } catch (error) {
    console.error('Batched processing failed:', error);
    throw new Error('Failed batched processing');
  }
}

export async function demoCircuitBreaker() {
  if (!isConfigured()) return;

  try {
    // Simulate circuit breaker pattern
    
    const threshold = 3;
    let failures = 0;
    
    console.log('Circuit breaker: threshold=' + threshold);
    
    for (let i = 1; i <= 5; i++) {
      if (Math.random() > 0.7) {
        failures++;
        console.log(`  → Failure #${failures}`);
        
        if (failures >= threshold) {
          console.log('  → Circuit OPEN');
          break;
        }
      } else {
        failures = 0;
        console.log(`  → Success`);
      }
    }
    
    return { failures, circuitOpen: failures >= threshold };
  } catch (error) {
    console.error('Circuit breaker failed:', error);
    throw new Error('Failed circuit breaker');
  }
}

export async function demoTelemetry() {
  if (!isConfigured()) return;

  try {
    // Simulate telemetry data collection
    
    const telemetry = {
      version: '1.0.0',
      environment: 'production',
      uptimeMs: 86400000,
      memoryUsageMB: 256,
      activeConnections: 12
    };
    
    console.log('Telemetry:', telemetry);
    return telemetry;
  } catch (error) {
    console.error('Telemetry collection failed:', error);
    throw new Error('Failed telemetry');
  }
}

export async function demoGracefulShutdown() {
  if (!isConfigured()) return;

  try {
    // Simulate graceful shutdown sequence
    
    const phases = [
      'Stop accepting new requests',
      'Drain in-flight operations',
      'Close database connections',
      'Flush caches',
      'Persist state'
    ];
    
    console.log('Shutdown sequence:');
    
    for (const phase of phases) {
      await new Promise(resolve => setTimeout(resolve, 10));
      console.log(`  → ${phase}`);
    }
    
    return true;
  } catch (error) {
    console.error('Graceful shutdown failed:', error);
    throw new Error('Failed graceful shutdown');
  }
}

export async function demoReconnection() {
  if (!isConfigured()) return;

  try {
    // Simulate reconnection logic
    
    const maxAttempts = 5;
    let attempt = 0;
    
    console.log('Attempting to reconnect...');
    
    while (attempt < maxAttempts) {
      attempt++;
      
      if (Math.random() > 0.4) {
        console.log(`  → Connected on attempt ${attempt}`);
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Reconnection failed');
  } catch (error) {
    console.error('Reconnection failed:', error);
    throw new Error('Failed reconnection');
  }
}

export async function demoConfigValidation() {
  if (!isConfigured()) return;

  try {
    // Simulate config validation
    
    const checks = [
      { name: 'client_id', valid: true },
      { name: 'redirect_uri', valid: true },
      { name: 'scopes', valid: false }
    ];
    
    console.log('Config validation results:');
    
    for (const check of checks) {
      const status = check.valid ? '✓' : '✗';
      console.log(`  → ${check.name}: ${status}`);
    }
    
    return checks;
  } catch (error) {
    console.error('Config validation failed:', error);
    throw new Error('Failed config validation');
  }
}

export async function demoFeatureFlags() {
  if (!isConfigured()) return;

  try {
    // Simulate feature flag evaluation
    
    const flags = [
      { name: 'new_oauth_flow', enabled: true },
      { name: 'beta_api', enabled: false }
    ];
    
    console.log('Feature flags:', JSON.stringify(flags, null, 2));
    return flags;
  } catch (error) {
    console.error('Feature flag evaluation failed:', error);
    throw new Error('Failed feature flags');
  }
}

export async function demoAuditLog() {
  if (!isConfigured()) return;

  try {
    // Simulate audit logging
    
    const actions = [
      { user: 'admin', action: 'login', timestamp: Date.now() },
      { user: 'user-123', action: 'fetch_emails', timestamp: Date.now() }
    ];
    
    console.log('Audit log entries:', actions.length);
    return actions;
  } catch (error) {
    console.error('Audit logging failed:', error);
    throw new Error('Failed audit logging');
  }
}

export async function demoRateLimiting() {
  if (!isConfigured()) return;

  try {
    // Simulate rate limiting
    
    const requests = Array.from({ length: 10 }, () => ({ id: `req-${Math.random().toString(36).slice(2)}` }));
    
    console.log('Processing with rate limits...');
    
    let processed = 0;
    for (const req of requests) {
      if (processed < 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        // Skip to simulate rate limit
        console.log(`  → Rate limited: ${req.id}`);
      }
      processed++;
    }
    
    return { total: requests.length, processed };
  } catch (error) {
    console.error('Rate limiting failed:', error);
    throw new Error('Failed rate limiting');
  }
}

export async function demoConnectionPooling() {
  if (!isConfigured()) return;

  try {
    // Simulate connection pool management
    
    const pool = {
      maxSize: 10,
      current: 3,
      waiting: 0
    };
    
    console.log('Pool status:', pool);
    return pool;
  } catch (error) {
    console.error('Connection pooling failed:', error);
    throw new Error('Failed connection pooling');
  }
}

export async function demoTokenRefresh() {
  if (!isConfigured()) return;

  try {
    // Simulate token refresh
    
    const tokens = {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
      refreshToken: 'dGVzdC1yZWZyZXNoLXRva2Vu',
      expiresIn: 3600,
      lastRefreshed: Date.now() - 7200000
    };
    
    console.log('Token status:', tokens);
    return tokens;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw new Error('Failed token refresh');
  }
}

export async function demoCacheManagement() {
  if (!isConfigured()) return;

  try {
    // Simulate cache operations
    
    const cache = {
      hits: 1247,
      misses: 89,
      ttlMs: 3600000,
      maxSize: 1000000
    };
    
    console.log('Cache stats:', cache);
    return cache;
  } catch (error) {
    console.error('Cache management failed:', error);
    throw new Error('Failed cache management');
  }
}

export async function demoNotificationSystem() {
  if (!isConfigured()) return;

  try {
    // Simulate notification delivery
    
    const notifications = [
      { id: 'notif-1', type: 'email_sent', priority: 'high' },
      { id: 'notif-2', type: 'quota_warning', priority: 'medium' }
    ];
    
    console.log('Notifications to send:', notifications.length);
    return notifications;
  } catch (error) {
    console.error('Notification system failed:', error);
    throw new Error('Failed notification system');
  }
}

export async function demoAnalytics() {
  if (!isConfigured()) return;

  try {
    // Simulate analytics tracking
    
    const events = [
      { name: 'page_view', properties: { page: '/dashboard' }, timestamp: Date.now() },
      { name: 'api_call', properties: { endpoint: '/v1/emails' }, timestamp: Date.now() }
    ];
    
    console.log('Analytics events:', events.length);
    return events;
  } catch (error) {
    console.error('Analytics tracking failed:', error);
    throw new Error('Failed analytics');
  }
}

export async function demoSecurityChecks() {
  if (!isConfigured()) return;

  try {
    // Simulate security validation
    
    const checks = [
      { name: 'ssl_valid', passed: true },
      { name: 'token_expiry', passed: true, remainingMs: 2592000 },
      { name: 'rate_limit_budget', passed: false, used: 487 }
    ];
    
    console.log('Security checks:', JSON.stringify(checks, null, 2));
    return checks;
  } catch (error) {
    console.error('Security checks failed:', error);
    throw new Error('Failed security checks');
  }
}

export async function demoDebugMode() {
  if (!isConfigured()) return;

  try {
    // Simulate debug mode toggling
    
    const debug = true;
    
    console.log(`Debug mode: ${debug ? 'ON' : 'OFF'}`);
    
    if (debug) {
      console.log('Verbose logging enabled');
      console.log('Detailed error traces enabled');
    }
    
    return debug;
  } catch (error) {
    console.error('Debug mode failed:', error);
    throw new Error('Failed debug mode');
  }
}

export async function demoVersioning() {
  if (!isConfigured()) return;

  try {
    // Simulate version tracking
    
    const versions = [
      { name: 'gmail-adapter', current: '1.2.3', stable: true },
      { name: 'oauth-flow', current: '0.9.1', beta: true }
    ];
    
    console.log('Active versions:', JSON.stringify(versions, null, 2));
    return versions;
  } catch (error) {
