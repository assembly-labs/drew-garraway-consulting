import { useState, useCallback, useEffect, useMemo } from 'react';
import { LibraryEvent, RegistrationForm } from '../types';
import { mockEvents } from '../data/mockEvents';
import { useToast } from './useToast';

export const useEvents = () => {
  const [events, setEvents] = useState<LibraryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const toast = useToast();

  // Load events on mount
  useEffect(() => {
    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 500);
  }, []);

  // Group events by time period
  const groupEventsByPeriod = useCallback((eventsList: LibraryEvent[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      thisWeek: eventsList.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate <= oneWeek;
      }),
      thisMonth: eventsList.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate > oneWeek && eventDate <= oneMonth;
      }),
      later: eventsList.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate > oneMonth;
      })
    };
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const typeMatch = filterType === 'all' || event.event_type === filterType;
      const locationMatch = filterLocation === 'all' || event.location.branch === filterLocation;
      return typeMatch && locationMatch;
    });
  }, [events, filterType, filterLocation]);

  // Get grouped events
  const groupedEvents = useMemo(() => {
    return groupEventsByPeriod(filteredEvents);
  }, [filteredEvents, groupEventsByPeriod]);

  // Register for event
  const registerForEvent = useCallback(async (eventId: string, form: RegistrationForm) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update event
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          registered: event.registered + (form.attendees || 1),
          userRegistered: true,
          registration_status: event.registered + (form.attendees || 1) >= event.capacity ? 'full' : event.registration_status
        };
      }
      return event;
    }));

    const event = events.find(e => e.id === eventId);
    toast.success(`You're registered for ${event?.title}!`, {
      description: `Confirmation sent to ${form.email}`
    });
  }, [events, toast]);

  // Join waitlist
  const joinWaitlist = useCallback(async (eventId: string, _form: RegistrationForm) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update event
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          userOnWaitlist: true
        };
      }
      return event;
    }));

    const event = events.find(e => e.id === eventId);
    toast.success(`Added to waitlist for ${event?.title}`, {
      description: 'We\'ll notify you if a spot opens up'
    });
  }, [events, toast]);

  // Get unique event types
  const eventTypes = useMemo(() => {
    const types = new Set(events.map(e => e.event_type));
    return Array.from(types);
  }, [events]);

  // Get unique locations
  const locations = useMemo(() => {
    const locs = new Set(events.map(e => e.location.branch));
    return Array.from(locs);
  }, [events]);

  return {
    events: filteredEvents,
    groupedEvents,
    isLoading,
    filterType,
    filterLocation,
    setFilterType,
    setFilterLocation,
    registerForEvent,
    joinWaitlist,
    eventTypes,
    locations,
    totalCount: filteredEvents.length
  };
};