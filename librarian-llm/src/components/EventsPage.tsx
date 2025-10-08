import React, { useState } from 'react';
import { EventCard } from './EventCard';
import { RegistrationModal } from './RegistrationModal';
import { useEvents } from '../hooks/useEvents';
import { LibraryEvent, RegistrationForm } from '../types';

interface EventsPageProps {
  onClose: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onClose }) => {
  const {
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
    totalCount
  } = useEvents();

  const [selectedEvent, setSelectedEvent] = useState<LibraryEvent | null>(null);
  const [isWaitlistModal, setIsWaitlistModal] = useState(false);

  // Handle registration
  const handleRegister = (event: LibraryEvent) => {
    setSelectedEvent(event);
    setIsWaitlistModal(false);
  };

  // Handle waitlist
  const handleJoinWaitlist = (event: LibraryEvent) => {
    setSelectedEvent(event);
    setIsWaitlistModal(true);
  };

  // Handle form submission
  const handleSubmit = async (form: RegistrationForm) => {
    if (!selectedEvent) return;

    if (isWaitlistModal) {
      await joinWaitlist(selectedEvent.id, form);
    } else {
      await registerForEvent(selectedEvent.id, form);
    }
    setSelectedEvent(null);
  };

  // Get event type label
  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'book_club': '📚 Book Clubs',
      'children': '👶 Children\'s Programs',
      'teen_program': '🎮 Teen Programs',
      'technology': '💻 Technology Classes',
      'workshop': '🎨 Workshops & Crafts',
      'author_event': '🎤 Author Events',
      'lecture': '🎓 Lectures',
      'craft': '✂️ Crafts',
      'recreation': '⚽ Recreation',
      'all_ages': '👨‍👩‍👧‍👦 All Ages'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Registration Modal */}
      <RegistrationModal
        isOpen={!!selectedEvent}
        event={selectedEvent}
        isWaitlist={isWaitlistModal}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedEvent(null)}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Back to main"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Events Calendar
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upcoming programs and activities
                </p>
              </div>
            </div>

            {/* View Toggle (placeholder) */}
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium">
                List
              </button>
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                Calendar
              </button>
            </div>
          </div>

          {/* Filters */}
          {totalCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              <div>
                <label htmlFor="event-type" className="sr-only">Filter by event type</label>
                <select
                  id="event-type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Events</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>
                      {getEventTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="sr-only">Filter by location</label>
                <select
                  id="location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Branches</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {(filterType !== 'all' || filterLocation !== 'all') && (
                <button
                  onClick={() => {
                    setFilterType('all');
                    setFilterLocation('all');
                  }}
                  className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-4 bg-white dark:bg-gray-800 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : totalCount === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filterType !== 'all' || filterLocation !== 'all'
                ? 'No events match your filters'
                : 'No upcoming events'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {filterType !== 'all' || filterLocation !== 'all'
                ? 'Try adjusting your filters or check back later for new programs.'
                : 'Check back soon for new programs and activities!'}
            </p>
            {(filterType !== 'all' || filterLocation !== 'all') && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterLocation('all');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          // Events grouped by time period
          <div className="space-y-8">
            {/* This Week */}
            {groupedEvents.thisWeek.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  ━━━ THIS WEEK ━━━
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {groupedEvents.thisWeek.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRegister={handleRegister}
                      onJoinWaitlist={handleJoinWaitlist}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* This Month */}
            {groupedEvents.thisMonth.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  ━━━ THIS MONTH ━━━
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {groupedEvents.thisMonth.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRegister={handleRegister}
                      onJoinWaitlist={handleJoinWaitlist}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Later */}
            {groupedEvents.later.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  ━━━ LATER ━━━
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {groupedEvents.later.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRegister={handleRegister}
                      onJoinWaitlist={handleJoinWaitlist}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};