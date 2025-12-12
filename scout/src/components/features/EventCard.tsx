import React from 'react';
import { LibraryEvent } from '../../types';

interface EventCardProps {
  event: LibraryEvent;
  onRegister: (event: LibraryEvent) => void;
  onJoinWaitlist: (event: LibraryEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onRegister,
  onJoinWaitlist
}) => {
  // Get event type icon
  const getEventIcon = () => {
    switch (event.event_type) {
      case 'book_club': return '📚';
      case 'children': return '👶';
      case 'teen_program': return '🎮';
      case 'technology': return '💻';
      case 'workshop': return '🎨';
      case 'author_event': return '🎤';
      case 'lecture': return '🎓';
      case 'craft': return '✂️';
      case 'recreation': return '⚽';
      case 'all_ages': return '👨‍👩‍👧‍👦';
      default: return '📅';
    }
  };

  // Format date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get registration status display
  const getRegistrationDisplay = () => {
    const percentFull = (event.registered / event.capacity) * 100;
    const nearlyFull = percentFull >= 75 && event.registration_status === 'open';

    switch (event.registration_status) {
      case 'open':
        if (nearlyFull) {
          return {
            text: `${event.registered}/${event.capacity} registered • Few spots left`,
            badge: '⚠️ Nearly Full',
            badgeClass: 'bg-attention-light text-attention-dark dark:bg-attention/30 dark:text-coral-300'
          };
        }
        return {
          text: `${event.registered} registered • Spots available`,
          badge: null,
          badgeClass: ''
        };
      case 'waitlist':
        return {
          text: `${event.registered}/${event.capacity} registered • Waitlist available`,
          badge: 'Waitlist',
          badgeClass: 'bg-warning-light text-warning-dark dark:bg-warning/30 dark:text-warning'
        };
      case 'full':
        return {
          text: `Event full (${event.capacity}/${event.capacity})`,
          badge: 'Full',
          badgeClass: 'bg-error-light text-error-dark dark:bg-error/30 dark:text-error'
        };
      case 'drop_in':
        return {
          text: 'Drop-in event • No registration needed',
          badge: 'Drop-in',
          badgeClass: 'bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200'
        };
      default:
        return { text: '', badge: null, badgeClass: '' };
    }
  };

  const icon = getEventIcon();
  const registrationDisplay = getRegistrationDisplay();

  return (
    <article className="border border-neutral-200 dark:border-navy-700 rounded-lg p-4 bg-surface dark:bg-navy-800 hover:shadow-md transition-shadow">
      {/* Date and Time */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
          {formatDate(event.date)} • {formatTime(event.time)}
        </div>
        {registrationDisplay.badge && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${registrationDisplay.badgeClass}`}>
            {registrationDisplay.badge}
          </span>
        )}
      </div>

      {/* Event Title and Icon */}
      <div className="mb-2">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-navy-900 dark:text-surface">
              {event.title}
            </h3>
            {event.facilitator && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                with {event.facilitator}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 line-clamp-2">
        {event.description}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1 mb-3 text-sm text-neutral-500 dark:text-neutral-400">
        <span>📍</span>
        <span>{event.location.branch}</span>
        {event.location.room && (
          <>
            <span>•</span>
            <span>{event.location.room}</span>
          </>
        )}
      </div>

      {/* Registration Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1">
            <span>👥</span>
            <span>{registrationDisplay.text}</span>
          </span>
        </p>

        {/* Action Button */}
        <div>
          {event.userRegistered ? (
            <button
              disabled
              className="px-4 py-2 bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200 rounded-md cursor-not-allowed font-medium text-sm"
            >
              ✓ Registered
            </button>
          ) : event.userOnWaitlist ? (
            <button
              disabled
              className="px-4 py-2 bg-warning-light text-warning-dark dark:bg-warning/30 dark:text-warning rounded-md cursor-not-allowed font-medium text-sm"
            >
              ✓ On Waitlist
            </button>
          ) : (
            <>
              {event.registration_status === 'open' && (
                <button
                  onClick={() => onRegister(event)}
                  className="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 font-medium text-sm"
                >
                  Register
                </button>
              )}
              {event.registration_status === 'waitlist' && (
                <button
                  onClick={() => onJoinWaitlist(event)}
                  className="px-4 py-2 bg-warning text-white rounded-md hover:bg-warning/90 transition-colors focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2 font-medium text-sm"
                >
                  Join Waitlist
                </button>
              )}
              {event.registration_status === 'full' && (
                <button
                  disabled
                  className="px-4 py-2 bg-neutral-300 text-neutral-500 dark:bg-navy-600 dark:text-neutral-400 rounded-md cursor-not-allowed font-medium text-sm"
                >
                  Event Full
                </button>
              )}
              {event.registration_status === 'drop_in' && (
                <button
                  className="px-4 py-2 bg-neutral-100 dark:bg-navy-700 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-200 dark:hover:bg-navy-600 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 font-medium text-sm"
                >
                  Add to Calendar
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
};