'use client';

import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  XCircle
} from 'lucide-react';

// Types for Calendly integration
export interface CalendlyConfig {
  apiKey: string;
  calendarId?: string;
  baseUrl?: string;
}

export type EventStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  status: EventStatus;
  attendees: Attendee[];
}

export interface Attendee {
  name: string;
  email: string;
  type: 'user' | 'guest';
}

// Configuration check guard
function isConfigured(config?: CalendlyConfig): boolean {
  return !!config?.apiKey && config.apiKey.length > 0;
}

// Example 1: Initialize connection with validation
export async function initializeCalendlyConnection(
  config: CalendlyConfig,
  options?: {
    timeoutMs?: number;
    retryCount?: number;
  }
): Promise<{ connected: boolean; calendarId?: string }> {
  if (!isConfigured(config)) {
    throw new Error('Calendly not configured. Provide a valid apiKey.');
  }

  try {
    // Simulated connection initialization
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      connected: true,
      calendarId: config.calendarId || 'default-calendar',
    };
  } catch (error) {
    console.error('Connection failed:', error);
    throw new Error(`Failed to initialize Calendly connection: ${(error as Error).message}`);
  }
}

// Example 2: Fetch calendar metadata
export async function fetchCalendarMetadata(
  config: CalendlyConfig,
  options?: { includeSettings: boolean; includeEvents: boolean }
): Promise<{ name: string; timezone: string; availableSlots: number }> {
  if (!isConfigured(config)) {
    throw new Error('Calendly not configured.');
  }

  try {
    // Simulated metadata fetch
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      name: 'Syntheon Team Calendar',
      timezone: 'America/New_York',
      availableSlots: 42,
    };
  } catch (error) {
    console.error('Metadata fetch failed:', error);
    throw new Error(`Failed to fetch calendar metadata: ${(error as Error).message}`);
  }
}

// Example 3: Create a new event with validation
export async function createEvent(
  config: CalendlyConfig,
  eventData: {
    title: string;
    description?: string;
    start: Date;
    end: Date;
    attendees: Attendee[];
    timezone?: string;
  },
  options?: { sendNotifications: boolean }
): Promise<{ eventId: string; confirmationUrl: string }> {
  if (!isConfigured(config)) {
    throw new Error('Calendly not configured.');
  }

  // Validate event data
  if (eventData.start >= eventData.end) {
    throw new Error('Event end must be after start time.');
  }

  if (eventData.attendees.length === 0) {
    throw new Error('At least one attendee is required.');
  }

  try {
    // Simulated event creation
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      confirmationUrl: `${config.baseUrl || 'https://calendly.com'}/confirm/${eventData.title.replace(/\s+/g, '_')}`,
    };
  } catch (error) {
    console.error('Event creation failed:', error);
    throw new Error(`Failed to create event: ${(error as Error).message}`);
  }
}

// Example 4: Update existing event
export async function updateEvent(
  config: CalendlyConfig,
  eventId: string,
  updates: Partial<{ title: string; description?: string; status: EventStatus }>,
  options?: { sendNotifications: boolean }
): Promise<{ success: boolean }> {
  if (!isConfigured(config)) {
    throw new Error('Calendly not configured.');
  }

  try {
    // Simulated update operation
    await new Promise(resolve => setTimeout(resolve, 75));
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Event update failed:', error);
    throw new Error(`Failed to update event: ${(error as Error).message}`);
  }
}

// Example 5: Get upcoming events with pagination support
export async function getUpcomingEvents(
  config: CalendlyConfig,
  options?: {
    limit?: number;
    offset?: number;
    statusFilter?: EventStatus[];
  }
): Promise<{ events: CalendarEvent[]; hasMore: boolean }> {
  if (!isConfigured(config)) {
    throw new Error('Calendly not configured.');
  }

  try {
    // Simulated paginated fetch
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      events: [
        {
          id: 'evt_sample_1',
          title: 'Client Discovery Call',
          description: 'Initial discovery session with potential client.',
          start: new Date(Date.now() + 86400000), // Tomorrow
          end: new Date(Date.now() + 90000000),
          status: 'pending',
          attendees: [
            { name: 'John Smith', email: 'john@example.com', type: 'user' },
            { name: 'Jane Doe', email: 'jane@company.com', type: 'guest' },
          ],
        },
      ],
      hasMore: false,
    };
  } catch (error) {
    console.error('Event fetch failed:', error);
    throw new Error(`Failed to fetch upcoming events: ${(error as Error).message}`);
  }
}

// Example 6: Cancel an event with confirmation
export async function cancelEvent(
  config: CalendlyConfig,
  eventId: string,
  reason?: string,
  options?: { notifyAttendees: boolean; sendRefundEmail: boolean }
): Promise<{ cancelled: boolean; refundAmount?: number }> {
  if (!isConfigured(config)) {
    throw new Error('Calendly not configured.');
  }

  try {
    // Simulated cancellation
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      cancelled: true,
      refundAmount: 150.00,
    };
  } catch (error) {
    console.error('Event cancellation failed:', error);
    throw new Error(`Failed to cancel event: ${(error as Error).message}`);
  }
}

// Example 7: Event creation form hook with validation
export function useCalendlyEventForm(
  config: CalendlyConfig,
  initialData?: Partial<NonNullable<typeof createEvent['arguments'][1]>>
) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(
    data: NonNullable<typeof createEvent['arguments'][1]>
  ) {
    if (!isConfigured(config)) {
      setError('Calendly not configured.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createEvent(config, data);
      console.log('Event created:', result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, handleSubmit };
}

// Example 8: Loading state component with accessibility
export function CalendlyLoadingIndicator() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-2 text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Connecting to calendar...</span>
      </motion.div>
    </AnimatePresence>
  );
}

// Example 9: Error display component with retry capability
export function CalendlyErrorDisplay({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
      role="alert"
    >
      <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm underline hover:no-underline font-medium"
          >
            Try again
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Example 10: Success confirmation component
export function CalendlySuccessDisplay({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20 text-success"
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
        <span>{message}</span>
        {onDismiss && (
          <button onClick={onDismiss} className="ml-auto hover:opacity-70">
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Example 11: Main integration wrapper component
export function CalendlyIntegration({ config, children }: { config: CalendlyConfig; children: ReactNode }) {
  const [initialized, setInitialized] = React.useState(false);
  const [connectionError, setConnectionError] = React.useState<string | null>(null);

  async function initialize() {
    try {
      await initializeCalendlyConnection(config);
      setInitialized(true);
    } catch (error) {
      setConnectionError((error as Error).message);
    }
  }

  // Auto-initialize on mount if configured
  React.useEffect(() => {
    if (!initialized && isConfigured(config)) {
      initialize();
    }
  }, [initialized, config]);

  return (
    <div className={cn('relative min-h-[400px]', 'bg-background')}>
      {!initialized && !connectionError && (
        <CalendlyLoadingIndicator />
      )}
      
      {connectionError && (
        <CalendlyErrorDisplay error={connectionError} onRetry={initialize} />
      )}

      {initialized && children}
    </div>
  );
}

// Example 12: Event list with status badges and animations
export function EventList({ events, config }: { events: CalendarEvent[]; config: CalendlyConfig }) {
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <motion.div
          key={event.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setSelectedEventId(event.id)}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-foreground">{event.title}</h3>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
            
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                event.status === 'confirmed' && 'bg-green-500/10 text-green-600',
                event.status === 'pending' && 'bg-yellow-500/10 text-yellow-600',
                event.status === 'cancelled' && 'bg-red-500/10 text-red-600',
                event.status === 'completed' && 'bg-blue-500/10 text-blue-600'
              )}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{event.start.toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="truncate max-w-[150px]">
              <span className="font-medium text-foreground">{event.attendees[0]?.name}</span>
              {event.attendees.length > 1 && (
                <span className="text-muted-foreground">+{event.attendees.length - 1} others</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {events.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground"
        >
          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No upcoming events found.</p>
        </motion.div>
      )}
    </div>
  );
}

// Example 13: Quick stats dashboard component
export function CalendlyStats({ config }: { config: CalendlyConfig }) {
  const [stats, setStats] = React.useState<{ totalEvents: number; thisWeek: number; conversionRate: number } | null>(null);

  async function fetchStats() {
    try {
      // Simulated stats fetch
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setStats({
        totalEvents: 1247,
        thisWeek: 23,
        conversionRate: 68.5,
      });
    } catch {
      // Graceful degradation
    }
  }

  React.useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <CalendlyLoadingIndicator />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Total Events', value: stats.totalEvents.toLocaleString(), icon: CalendarIcon, color: 'text-primary' },
        { label: 'This Week', value: stats.thisWeek.toString(), icon: Clock, color: 'text-muted-foreground' },
        { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: CheckCircle2, color: 'text-green-600' },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-lg bg-card border"
        >
          <div className={cn('flex items-center gap-2 mb-2', stat.color)}>
            <stat.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Re-export for convenience
export { CalendlyConfig, EventStatus, CalendarEvent, Attendee };
