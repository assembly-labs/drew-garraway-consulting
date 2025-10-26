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
            badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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
          badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        };
      case 'full':
        return {
          text: `Event full (${event.capacity}/${event.capacity})`,
          badge: 'Full',
          badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
      case 'drop_in':
        return {
          text: 'Drop-in event • No registration needed',
          badge: 'Drop-in',
          badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
      default:
        return { text: '', badge: null, badgeClass: '' };
    }
  };

  const icon = getEventIcon();
  const registrationDisplay = getRegistrationDisplay();

  return (
    <article className="border rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      {/* Date and Time */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
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
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {event.title}
            </h3>
            {event.facilitator && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                with {event.facilitator}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
        {event.description}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1 mb-3 text-sm text-gray-500 dark:text-gray-400">
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
        <p className="text-sm text-gray-600 dark:text-gray-400">
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
              className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md cursor-not-allowed font-medium text-sm"
            >
              ✓ Registered
            </button>
          ) : event.userOnWaitlist ? (
            <button
              disabled
              className="px-4 py-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-md cursor-not-allowed font-medium text-sm"
            >
              ✓ On Waitlist
            </button>
          ) : (
            <>
              {event.registration_status === 'open' && (
                <button
                  onClick={() => onRegister(event)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm"
                >
                  Register
                </button>
              )}
              {event.registration_status === 'waitlist' && (
                <button
                  onClick={() => onJoinWaitlist(event)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-medium text-sm"
                >
                  Join Waitlist
                </button>
              )}
              {event.registration_status === 'full' && (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 rounded-md cursor-not-allowed font-medium text-sm"
                >
                  Event Full
                </button>
              )}
              {event.registration_status === 'drop_in' && (
                <button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-sm"
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