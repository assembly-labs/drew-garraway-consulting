import React, { useEffect, useRef } from 'react';
import { SidebarMenuItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick: (id: string) => void;
  checkoutsCount?: number;
  holdsCount?: number;
  finesAmount?: number; // in cents
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onMenuItemClick,
  checkoutsCount = 0,
  holdsCount = 0,
  finesAmount = 0
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen && firstMenuItemRef.current) {
      // Focus first menu item when opening
      timeoutId = setTimeout(() => firstMenuItemRef.current?.focus(), 100);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = sidebarRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleMenuClick = (id: string) => {
    onMenuItemClick(id);
    onClose(); // Auto-close sidebar after selection
  };

  // Format currency for fines
  const formatFines = (cents: number) => {
    return cents > 0 ? `$${(cents / 100).toFixed(2)}` : undefined;
  };

  // Menu items data
  const myAccountItems: SidebarMenuItem[] = [
    {
      id: 'digital-library-card',
      label: 'Digital Library Card',
      icon: '💳',
      onClick: () => handleMenuClick('digital-library-card')
    },
    {
      id: 'my-checkouts',
      label: 'My Checkouts',
      icon: '📚',
      badge: checkoutsCount > 0 ? checkoutsCount : undefined,
      onClick: () => handleMenuClick('my-checkouts')
    },
    {
      id: 'my-reading-history',
      label: 'My Reading History',
      icon: '📖',
      onClick: () => handleMenuClick('my-reading-history')
    },
    {
      id: 'my-holds',
      label: 'My Holds',
      icon: '📋',
      badge: holdsCount > 0 ? holdsCount : undefined,
      onClick: () => handleMenuClick('my-holds')
    },
    {
      id: 'my-fines',
      label: 'My Fines',
      icon: '💵',
      badge: formatFines(finesAmount),
      onClick: () => handleMenuClick('my-fines')
    },
  ];

  const eventsItems: SidebarMenuItem[] = [
    {
      id: 'events-calendar',
      label: 'Events Calendar',
      icon: '📅',
      onClick: () => handleMenuClick('events-calendar')
    },
  ];

  const footerItems: SidebarMenuItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      onClick: () => handleMenuClick('settings')
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      onClick: () => handleMenuClick('help')
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 lg:hidden z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        id="sidebar-navigation"
        role="navigation"
        aria-label="Main menu"
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Librarian LLM
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Anytown Public Library
              </p>
            </div>
          </div>
        </div>

        {/* Search shortcut */}
        <div className="px-4 pt-4">
          <button
            onClick={() => handleMenuClick('search')}
            className="w-full p-3 text-left rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <span>🔍</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Back to Search</span>
            </span>
          </button>
        </div>

        {/* Menu sections */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {/* MY ACCOUNT Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
              My Account
            </h3>
            <ul className="space-y-1">
              {myAccountItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    ref={index === 0 ? firstMenuItemRef : undefined}
                    onClick={item.onClick}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center space-x-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.label}
                        </span>
                      </span>
                      {item.badge && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* EVENTS Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
              Events
            </h3>
            <ul className="space-y-1">
              {eventsItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={item.onClick}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <span className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <ul className="space-y-1">
            {footerItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={item.onClick}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};