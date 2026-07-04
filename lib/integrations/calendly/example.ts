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
  } catch (error)
