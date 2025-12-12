import React from 'react';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 flex flex-col justify-center items-center group focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 rounded-md"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="sidebar-navigation"
    >
      <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>

      {/* Top line */}
      <span
        className={`block absolute h-0.5 w-6 bg-coral-700 dark:bg-neutral-300 transform transition duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
        }`}
      />

      {/* Middle line */}
      <span
        className={`block absolute h-0.5 w-6 bg-coral-700 dark:bg-neutral-300 transition duration-300 ease-in-out ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Bottom line */}
      <span
        className={`block absolute h-0.5 w-6 bg-coral-700 dark:bg-neutral-300 transform transition duration-300 ease-in-out ${
          isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
        }`}
      />
    </button>
  );
};